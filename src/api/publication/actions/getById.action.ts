import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { StatusError } from '../../../utils/responses/status-error'

export const getPublicationById = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const response = await pool.query({
      text: `
                SELECT
                    publication_id,
                    name,
                    description,
                    application_description,
                    difficulty,
                    status,
                    user_lead_id,
                    TO_CHAR(created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at,
                    TO_CHAR(updated_at, 'DD/MM/YYYY - HH12:MI AM') AS updated_at
                FROM publications
                WHERE publication_id = $1
                `,
      values: [req.params.publicationId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se pudo encontrar el registro de id: ${req.params.publicationId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json(camelizeObject(response.rows[0]))
  } catch (error) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
