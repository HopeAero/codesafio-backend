import { Request, Response } from 'express'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const addUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, email, password, occupation, personalDescription } = req.body
    const insertar = await pool.query({
      text: `
            INSERT INTO users
            (name, email, password, occupation, personal_description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id
            `,
      values: [name, email, password, occupation, personalDescription]
    })
    const insertedId: string = insertar.rows[0].user_id
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
      values: [insertedId]
    })
    return res.status(STATUS.CREATED).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
