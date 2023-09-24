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
      u.user_id,
      u.name,
      u.email,
      u.occupation,
      u.personal_description,
      TO_CHAR(u.created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at,
      a.publication_id AS application_project_id,
      c.publication_id AS collaborator_project_id,
      ap.name AS application_project_name,
      cp.name AS collaborator_project_name
      FROM users u
      LEFT JOIN applications a ON u.user_id = a.user_id
      LEFT JOIN collaborators c ON u.user_id = c.user_id
      LEFT JOIN publications ap ON a.publication_id = ap.publication_id
      LEFT JOIN publications cp ON c.publication_id = cp.publication_id
      WHERE u.user_id = $1;
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
