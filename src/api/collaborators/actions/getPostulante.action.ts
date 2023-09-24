import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { StatusError } from '../../../utils/responses/status-error'

export const getPostulent = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.id
    const { publicationId } = req.params
    const validate = await pool.query({
      text: `
            SELECT
            publication_id
            FROM publications
            WHERE user_lead_id = $1 AND publication_id = $2
        `,
      values: [userId, publicationId]
    })
    if (validate.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar un usuario que lidera este Proyecto: ${publicationId} y Usuario ${userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    const response = await pool.query({
      text: `
        SELECT
        a.user_id,
        u.name AS user_name,
        a.publication_id,
        TO_CHAR(a.created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at
        FROM applications AS a
        JOIN users AS u ON a.user_id = u.user_id
        WHERE a.publication_id = $1
        ORDER BY a.publication_id;
    
        `,
      values: [publicationId]

    })

    return res.status(STATUS.OK).json({
      items: camelizeObject(response.rows)
    })
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
