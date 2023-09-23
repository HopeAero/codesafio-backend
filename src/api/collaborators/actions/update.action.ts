import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'

export const updateCollaborator = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userLeadId = req.user.id
    const { rating, description } = req.body

    // Verifica si el usuario actual lidera el proyecto especificado en req.params.publicationId
    const validate = await pool.query({
      text: `
          SELECT
            publication_id,
            user_lead_id
          FROM publications
          WHERE user_lead_id = $1 AND publication_id = $2
        `,
      values: [userLeadId, req.params.publicationId]
    })

    if (validate.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar un usuario que lidera este Proyecto o el proyecto: ${req.params.publicationId} y Usuario ${userLeadId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    // Actualiza la calificación y la descripción del colaborador
    const response = await pool.query({
      text: `
          UPDATE collaborators
          SET 
            rating = $1,
            description = $2
          WHERE 
            publication_id = $3 AND
            user_id = $4
        `,
      values: [rating, description, req.params.publicationId, req.params.userId]
    })

    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se pudo encontrar el registro de Proyecto: ${req.params.publicationId} y Usuario ${req.params.userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    return res.status(STATUS.OK).json({ message: 'Colaborador modificado correctamente' })
  } catch (error) {
    console.error(error) // Imprime el error en la consola
    return handleControllerError(error, res)
  }
}
