import { Request, Response } from 'express'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'

export const updateUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
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
      values: [name, email, password, occupation, personalDescription, req.params.userId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se pudo encontrar el registro de id: ${req.params.userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json({ message: 'Usuario modificado correctamente' })
  } catch (error) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
