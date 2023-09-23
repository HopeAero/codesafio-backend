import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { StatusError } from '../../../utils/responses/status-error'

export const getParticipate = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.id
    const { publicationId } = req.params

    // Verifica si el usuario actual lidera el proyecto especificado en publicationId
    const validate = await pool.query({
      text: `
          SELECT
            publication_id,
            user_id,
            is_accepted,
            description
          FROM applications
          WHERE user_id = $1 AND publication_id = $2
        `,
      values: [userId, publicationId]
    })

    if (validate.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar un usuario colaborante a este Proyecto: ${publicationId} y Usuario ${userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    // Obtiene la lista de colaboradores del proyecto con user_id igual a userId
    const response = await pool.query({
      text: `
          SELECT
            user_id,
            publication_id,
            TO_CHAR(created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at
          FROM collaborators
          WHERE publication_id = $1 AND user_id = $2
          ORDER BY publication_id
        `,
      values: [publicationId, userId]
    })

    return res.status(STATUS.OK).json({
      items: camelizeObject(response.rows)
    })
  } catch (error: unknown) {
    console.error(error) // Imprime el error en la consola
    return handleControllerError(error, res)
  }
}
