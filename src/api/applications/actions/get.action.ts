import { Request, Response } from 'express'
import { pool } from '../../../database'
import { DEFAULT_PAGE, STATUS } from '../../../utils/constants'
import { PaginateSettings, paginatedItemsResponse } from '../../../utils/responses'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const getApplications = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { page = DEFAULT_PAGE.page, size = DEFAULT_PAGE.size } = req.query

  try {
    let offset = (Number(page) - 1) * Number(size)

    if (Number(page) < 1) {
      offset = 0
    }

    const { rows } = await pool.query({
      text: `
        SELECT COUNT(*) 
        FROM applications
      `
    })

    const { rows: response } = await pool.query({
      text: `
      SELECT
      a.publication_id,
      a.user_id,
      u.name AS user_name,
      a.is_accepted,
      a.description AS application_description,
      TO_CHAR(a.created_at, 'DD/MM/YYYY - HH12:MI AM') AS application_created_at,
      TO_CHAR(a.updated_at, 'DD/MM/YYYY - HH12:MI AM') AS application_updated_at,
      p.*
      FROM applications AS a
      INNER JOIN publications AS p ON a.publication_id = p.publication_id
      INNER JOIN users AS u ON a.user_id = u.user_id
      ORDER BY a.publication_id
      LIMIT $1 OFFSET $2;
      `,
      values: [size, offset]
    })

    const pagination: PaginateSettings = {
      total: Number(rows[0].count),
      page: Number(page),
      perPage: Number(size)
    }
    return paginatedItemsResponse(res, STATUS.OK, camelizeObject(response) as Array<Record<string, any>>, pagination)
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
