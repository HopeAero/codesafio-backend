import { Response, Request } from 'express'
import bcrypt from 'bcrypt'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { StatusError } from '../../../utils/responses/status-error'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { UserRole } from '../../../utils/roles.enum'

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { name, email, occupation } = req.body
    let { password } = req.body
    const registerData = [email, password]
    const { rows } = await pool.query({
      text: `
        SELECT *
        FROM users
        WHERE email = $1
      `,
      values: [registerData[0]]
    })

    if (rows.length > 0) {
      throw new StatusError({
        message: 'Email ya registrado',
        statusCode: STATUS.BAD_REQUEST
      })
    }

    password = await bcrypt.hash(registerData[1], 10)

    const response = await pool.query({
      text: `INSERT INTO users (name, email, password, role, occupation)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
      values: [name, email, password, UserRole.USER, occupation]
    })
    return res.status(STATUS.CREATED).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.error(error)
    return handleControllerError(error, res)
  }
}
