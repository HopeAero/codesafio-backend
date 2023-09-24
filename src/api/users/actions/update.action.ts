import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'

export const updateUsers = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.id
    const { name, email, password, occupation, personalDescription } = req.body
    const response = await pool.query({
      text: `
            UPDATE users
            SET
            name = $1,
            email = $2,
            password = $3,
            occupation = $4,
            personal_description = $5
            WHERE user_id = $6
            `,
      values: [name, email, password, occupation, personalDescription, userId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar el registro de id: ${userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json({ message: 'Usuario modificado correctamente' })
  } catch (error) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
