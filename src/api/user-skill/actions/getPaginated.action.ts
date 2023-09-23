import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { DEFAULT_PAGE, STATUS } from '../../../utils/constants'
import { PaginateSettings, paginatedItemsResponse } from '../../../utils/responses'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const getPaginated = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  const userId = req.user.id
  const { page = DEFAULT_PAGE.page, size = DEFAULT_PAGE.size } = req.query

  try {
    let offset = (Number(page) - 1) * Number(size)

    if (Number(page) < 1) {
      offset = 0
    }

    const { rows } = await pool.query({
      text: `
                SELECT COUNT(*) 
                FROM user_skills
                WHERE user_id = $1
            `,
      values: [userId]
    })

    const response = await pool.query({
      text: `
                SELECT
                user_id,
                skill_category_id,
                skill_id,
                level
                FROM user_skills
                WHERE user_id = $1
                ORDER BY user_id
                LIMIT $2 OFFSET $3
            `,
      values: [userId, size, offset]
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
