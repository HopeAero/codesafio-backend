import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { StatusError } from '../../../utils/responses/status-error'

export const getAllRequirements = async (
  _req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = _req.user.id
    const publicationId = _req.body.publicationId

    const verifyPublication = await pool.query({
      text: `
              SELECT *
              FROM publications
              WHERE publication_id = $1 AND user_lead_id = $2
              `,
      values: [publicationId, userId]
    })

    if (verifyPublication.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar la publicacion con id: ${publicationId} y user_lead_id: ${userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    const response = await pool.query({
      text: `
        SELECT p.name AS project_name,
               ar.*,
               s.name AS skill_name,
               sc.name AS skill_category_name
        FROM application_requirements ar
        JOIN publications p
          ON ar.publication_id = p.publication_id
        JOIN skills s
          ON ar.skill_id = s.skill_id
        JOIN skill_categories sc
          ON ar.skill_category_id = sc.skill_category_id
        WHERE ar.publication_id = $1
      `,
      values: [publicationId]
    })

    if (response.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar habilidades a esta publicacion con id: ${userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json({
      items: camelizeObject(response.rows)
    })
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
