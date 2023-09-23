import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'

export const deletePublication = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const response = await pool.query({
      text: `
            DELETE FROM publications
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
    return res.status(STATUS.OK).json({ message: 'Publicación eliminada correctamente' })
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
