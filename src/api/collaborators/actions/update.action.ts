import { Request, Response } from 'express'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'

export const updateApplication = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { description } = req.body
    const response = await pool.query({
      text: `
        UPDATE applications
        SET description = $1,
        WHERE 
          publication_id = $2 AND
          user_id = $3
      `,
      values: [description, req.params.publicationId, req.params.userId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se pudo encontrar el registro de Publicación: ${req.params.publicationId} y Usuario ${req.params.userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json({ message: 'Postulación modificada correctamente' })
  } catch (error) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
