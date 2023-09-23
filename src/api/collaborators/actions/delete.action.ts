import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'

export const deleteColaborator = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userLead = req.user.id

    const validate = await pool.query({
      text: `
            SELECT
              publication_id,
              user_lead_id
            FROM publications
            WHERE user_lead_id = $1 AND publication_id = $2
          `,
      values: [userLead, req.params.publicationId]
    })

    if (validate.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar un usuario que lidera este Proyecto o el proyecto: ${req.params.publicationId} y Usuario ${userLead}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    const response = await pool.query({
      text: `
            DELETE FROM collaborators
            WHERE
                publication_id = $1 AND
                user_id = $2
            `,
      values: [req.params.publicationId, req.params.userId]
    })

    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se pudo encontrar al colaborador del Proyecto: ${req.params.publicationId} y Usuario ${req.params.userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    return res.status(STATUS.OK).json({ message: 'Colaborador eliminado correctamente' })
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
