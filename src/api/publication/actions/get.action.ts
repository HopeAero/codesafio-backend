import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { DEFAULT_PAGE, STATUS } from '../../../utils/constants'
import { PaginateSettings, paginatedItemsResponse } from '../../../utils/responses'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const getPublications = async (
  req: ExtendedRequest,
  res: Response
): Promise<any> => {
  const { page = DEFAULT_PAGE.page, size = DEFAULT_PAGE.size } = req.query
  try {
    let offset = (Number(page) - 1) * Number(size)

    if (Number(page) < 1) {
      offset = 0
    }

    const { rows } = await pool.query({
      text: `
        SELECT COUNT(*) 
        FROM publications
      `
    })

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
        ORDER BY publication_id
        LIMIT $1 OFFSET $2
        `,
      values: [size, offset]
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
