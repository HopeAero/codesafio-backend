import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { StatusError } from '../../../utils/responses/status-error'

export const addApplicationRequirements = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userLeaderId = req.user.id
    const { skillCategoryId, skillId, level, quantity } = req.body
    const verifyPublication = await pool.query({
      text: `
            SELECT *
            FROM publications
            WHERE publication_id = $1 AND user_lead_id = $2
            `,
      values: [req.params.publicationId, userLeaderId]
    })
    if (verifyPublication.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar la publicacion con id: ${req.params.publicationId} y user_lead_id: ${userLeaderId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    const verifySkillCategory = await pool.query({
      text: `
                SELECT *
                FROM skill_categories
                WHERE skill_category_id = $1
                `,
      values: [skillCategoryId]
    })

    if (verifySkillCategory.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar la skill_category con id: ${skillCategoryId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    const verifySkill = await pool.query({
      text: `
                SELECT *
                FROM skills
                WHERE skill_id = $1
                `,
      values: [skillId]
    })

    if (verifySkill.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar la skill con id: ${skillId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    await pool.query({
      text: `
            INSERT INTO application_requirements
                (publication_id, skill_category_id, skill_id, level, quantity)
                VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
      values: [req.params.publicationId, skillCategoryId, skillId, level, quantity]
    })
    const response = await pool.query({
      text: `
            SELECT
                publication_id,
                skill_category_id,
                skill_id,
                level,
                quantity,
                TO_CHAR(created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at
            FROM application_requirements
            WHERE publication_id = $1 AND skill_category_id = $2 AND skill_id = $3 AND level = $4 AND quantity = $5
            `,
      values: [req.params.publicationId, skillCategoryId, skillId, level, quantity]
    })
    return res.status(STATUS.CREATED).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
