import { Request, Response } from 'express'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { StatusError } from '../../../utils/responses/status-error'

export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const response = await pool.query({
      text: `
        SELECT
          user_id,
          name,
          email,
          password,
          occupation,
          personal_description,
          TO_CHAR(created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at
          FROM users
          WHERE user_id = $1
          `,
      values: [req.params.userId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se pudo encontrar el registro de id: ${req.params.userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json(camelizeObject(response.rows[0]))
  } catch (error) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
