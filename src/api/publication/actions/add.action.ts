import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const addPublication = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { name, description, applicationDescription, difficulty, status } = req.body
    const userLeadId = req.user.id
    const insertar = await pool.query({
      text: `
            INSERT INTO publications
            (name, description, application_description, difficulty, status, user_lead_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING publication_id
            `,
      values: [name, description, applicationDescription, difficulty, status, userLeadId]
    })
    const insertedId: string = insertar.rows[0].publication_id
    const response = await pool.query({
      text: `
            SELECT
                publication_id,
                name,
                description,
                application_description,
                difficulty,
                status,
                user_lead_id,
                TO_CHAR(created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at,
                TO_CHAR(updated_at, 'DD/MM/YYYY - HH12:MI AM') AS updated_at
            FROM publications
            WHERE publication_id = $1
        `,
      values: [insertedId]
    })
    return res.status(STATUS.CREATED).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
