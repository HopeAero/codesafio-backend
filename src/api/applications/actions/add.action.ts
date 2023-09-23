import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { StatusError } from '../../../utils/responses/status-error'

export const addApplication = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.id
    const { publicationId, isAccepted, description } = req.body

    const verify = await pool.query({
      text: `
        SELECT
          publication_id
          user_lead_id
        FROM publications
        WHERE publication_id = $1 AND user_lead_id = $2
      `,
      values: [publicationId, userId]
    })

    if (verify.rowCount > 1) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se puede postular un usuario a su mismo proyecto: ${publicationId} y Usuario ${userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    const insertar = await pool.query({
      text: `
        INSERT INTO applications
          (publication_id, user_id, is_accepted, description)
          VALUES ($1, $2, $3, $4)
        RETURNING publication_id, user_id
      `,
      values: [publicationId, userId, isAccepted, description]
    })
    const insertedPublicationId: string = insertar.rows[0].publication_id
    const insertedUserId: string = insertar.rows[0].user_id
    const response = await pool.query({
      text: `
        SELECT
          publication_id,
          user_id,
          is_accepted,
          description,
          TO_CHAR(created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at
        FROM applications
        WHERE 
          publication_id = $1 AND
          user_id = $2
      `,
      values: [insertedPublicationId, insertedUserId]
    })
    return res.status(STATUS.CREATED).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
