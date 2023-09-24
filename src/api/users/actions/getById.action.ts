import { Request, Response } from 'express'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { StatusError } from '../../../utils/responses/status-error'

export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const responseUser = await pool.query({
      text: `
        SELECT
          user_id,
          name,
          email,
          role,
          occupation,
          personal_description,
          created_at
        FROM users
        WHERE user_id = $1
      `,
      values: [req.params.userId]
    })
    if (responseUser.rowCount === 0) {
      throw new StatusError({
        message: `No se pudo encontrar el registro de id: ${req.params.userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    const { rows: responseSkills } = await pool.query({
      text: `
        SELECT
          us.skill_category_id,
          sc.name AS skill_category_name,
          us.skill_id,
          s.name AS skill_name,
          us.level
        FROM 
          user_skills AS us,
          skill_categories AS sc,
          skills AS s
        WHERE 
          us.user_id = 2 AND
          sc.skill_category_id = us.skill_category_id AND
          s.skill_id = us.skill_id
      `,
      values: [req.params.userId]
    })
    const { rows: responsePublications } = await pool.query({
      text: `
        SELECT
          publication_id,
          name,
          description,
          application_description,
          difficulty,
          status,
          created_at,
          updated_at
        FROM publications
        WHERE user_lead_id = $1
        LIMIT 3
      `,
      values: [req.params.userId]
    })
    const { rows: responseCollaborators } = await pool.query({
      text: `
        SELECT
          col.publication_id,
          col.description,
          col.rating,
          col.created_at
        FROM 
          collaborators AS col,
          publications AS pub
        WHERE 
          user_id = $1 AND
          pub.status = 'finished'
        LIMIT 3
      `,
      values: [req.params.userId]
    })

    return res.status(STATUS.OK).json({
      ...camelizeObject(responseUser.rows[0]),
      skills: camelizeObject(responseSkills),
      publications: camelizeObject(responsePublications),
      collaborators: camelizeObject(responseCollaborators)
    })
  } catch (error) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
