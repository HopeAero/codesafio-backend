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

    const response = await pool.query({
      text: `
      SELECT
        publication_id,
        user_id,
        is_accepted,
        description AS application_description,
        created_at,
        updated_at
      FROM 
        applications
      ORDER BY publication_id DESC
      LIMIT $1 OFFSET $2;
      `,
      values: [size, offset]
    })

    const row = response.rows

    const formattedResults: any[] = row.map((row) => {
      return {
        publication: {
          publicationId: row.publication_id,
          name: row.name,
          description: row.description,
          difficulty: row.difficulty,
          status: row.status,
          userLeadId: row.user_lead_id,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        },
        applicationId: row.application_id,
        userId: row.user_id,
        isAccepted: row.is_accepted,
        applicationDescription: row.application_description,
        applicationCreatedAt: row.application_created_at,
        applicationUpdatedAt: row.application_updated_at

      }
    })

    const pagination: PaginateSettings = {
      total: Number(rows[0].count),
      page: Number(page),
      perPage: Number(size)
    }
    return paginatedItemsResponse(res, STATUS.OK, camelizeObject(formattedResults) as Array<Record<string, any>>, pagination)
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
