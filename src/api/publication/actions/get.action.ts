import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { DEFAULT_PAGE, STATUS } from '../../../utils/constants'
import { PaginateSettings, paginatedItemsResponse } from '../../../utils/responses'
import { handleControllerError } from '../../../utils/responses/handleControllerError'

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
          p.publication_id,
          p.name AS project_name,
          p.description AS project_description,
          p.application_description,
          p.difficulty,
          p.status,
          p.user_lead_id,
          TO_CHAR(p.created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at,
          TO_CHAR(p.updated_at, 'DD/MM/YYYY - HH12:MI AM') AS updated_at,
          ar.skill_category_id,
          ar.skill_id,
          s.name AS skill_name,
          sc.name AS skill_category_name,
          ar.level,
          ar.quantity
        FROM publications p
        LEFT JOIN application_requirements ar
          ON p.publication_id = ar.publication_id
        LEFT JOIN skills s
          ON ar.skill_id = s.skill_id
        LEFT JOIN skill_categories sc
          ON ar.skill_category_id = sc.skill_category_id
        ORDER BY p.publication_id
        LIMIT $1 OFFSET $2
      `,
      values: [size, offset]
    })

    const publicationsData: any[] = response.rows.map((row) => ({
      publication_id: row.publication_id,
      project_name: row.project_name,
      project_description: row.project_description,
      application_description: row.application_description,
      difficulty: row.difficulty,
      status: row.status,
      user_lead_id: row.user_lead_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
      skills: {
        skill_category_id: row.skill_category_id,
        skill_id: row.skill_id,
        skill_name: row.skill_name,
        skill_category_name: row.skill_category_name,
        level: row.level,
        quantity: row.quantity
      }
    }))

    const pagination: PaginateSettings = {
      total: Number(rows[0].count),
      page: Number(page),
      perPage: Number(size)
    }

    return paginatedItemsResponse(res, STATUS.OK, publicationsData, pagination)
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
