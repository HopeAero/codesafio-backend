import { Request, Response } from 'express'
import { pool } from '../../../database'
import { DEFAULT_PAGE, STATUS } from '../../../utils/constants'
import { PaginateSettings, paginatedItemsResponse } from '../../../utils/responses'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

interface FormattedResult {
  application: {
    publication: {
      publicationId: number
      name: string
      description: string | null
      difficulty: number
      status: string
      userLeadId: number
      createdAt: string
      updatedAt: string
    }
    applicationId: number | null
    userId: number
    isAccepted: boolean | null
    applicationDescription: string | null
    applicationCreatedAt: string
    applicationUpdatedAt: string
  }
}

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
      a.publication_id,
      a.user_id,
      a.is_accepted,
      a.description AS application_description,
      TO_CHAR(a.created_at, 'DD/MM/YYYY - HH12:MI AM') AS application_created_at,
      TO_CHAR(a.updated_at, 'DD/MM/YYYY - HH12:MI AM') AS application_updated_at,
      p.*
      FROM applications AS a
      INNER JOIN publications AS p ON a.publication_id = p.publication_id
      ORDER BY a.publication_id
      LIMIT $1 OFFSET $2;
      `,
      values: [size, offset]
    })

    const row = response.rows

    const formattedResults: FormattedResult[] = row.map((row) => {
      return {
        application: {
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
      }
    })

    const pagination: PaginateSettings = {
      total: Number(rows[0].count),
      page: Number(page),
      perPage: Number(size)
    }
    return paginatedItemsResponse(res, STATUS.OK, camelizeObject(formattedResults) as any, pagination)
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
