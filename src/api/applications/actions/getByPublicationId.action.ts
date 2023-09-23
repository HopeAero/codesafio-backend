import { Request, Response } from 'express'
import { pool } from '../../../database'
import { STATUS, DEFAULT_PAGE } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

import { PaginateSettings, paginatedItemsResponse } from '../../../utils/responses'

export const getApplicationsByPublicationID = async (
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
        WHERE publication_id = $1
      `,
      values: [req.params.publicationId]
    })

    const response = await pool.query({
      text: `
        SELECT
          publication_id,
          user_id,
          is_accepted,
          description,
          TO_CHAR(created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at,
          TO_CHAR(updated_at, 'DD/MM/YYYY - HH12:MI AM') AS updated_at
        FROM applications
        WHERE publication_id = $3
        ORDER BY publication_id
        LIMIT $1 OFFSET $2
      `,
      values: [size, offset, req.params.publicationId]
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
