import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'

export const updatePublication = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { name, description, applicationDescription, difficulty, status } = req.body
    const response = await pool.query({
      text: `
                UPDATE publications
                SET
                name = $1,
                description = $2,
                application_description = $3,
                difficulty = $4,
                status = $5
                WHERE publication_id = $6
                `,
      values: [name, description, applicationDescription, difficulty, status, req.params.publicationId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se pudo encontrar el registro de id: ${req.params.publicationId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json({ message: 'Publicación modificada correctamente' })
  } catch (error) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
