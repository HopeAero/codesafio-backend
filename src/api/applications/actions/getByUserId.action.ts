import { Request, Response } from 'express'
import { pool } from '../../../database'
import { STATUS, DEFAULT_PAGE } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { PaginateSettings, paginatedItemsResponse } from '../../../utils/responses'

export const getApplicationsByUserID = async (
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

    const response = await pool.query({
      text: `
        SELECT
          ap.publication_id,
          pub.name AS publication_name,
          ap.user_id,
          us.name AS user_name,
          ap.is_accepted,
          ap.description,
          TO_CHAR(ap.created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at,
          TO_CHAR(ap.updated_at, 'DD/MM/YYYY - HH12:MI AM') AS updated_at
        FROM 
          applications AS ap,
          publications AS pub,
          users AS us
        WHERE 
          ap.user_id = $3 AND
          ap.publication_id = pub.publication_id AND
          ap.user_id = us.user_id
        ORDER BY publication_id
        LIMIT $1 OFFSET $2
      `,
      values: [size, offset, req.params.userId]
    })
    const pagination: PaginateSettings = {
      total: Number(rows[0].count),
      page: Number(page),
      perPage: Number(size)
    }
    return paginatedItemsResponse(res, STATUS.OK, camelizeObject(response.rows) as any, pagination)
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
