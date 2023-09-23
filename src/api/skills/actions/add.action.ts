import { Request, Response } from 'express'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const addSkill = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { skillCategoryId, name } = req.body
    const insertar = await pool.query({
      text: `
        INSERT INTO skills
          (skill_category_id, name)
          VALUES ($1, $2)
        RETURNING skill_id
      `,
      values: [skillCategoryId, name]
    })
    const insertedId: string = insertar.rows[0].category_skill_id
    const response = await pool.query({
      text: `
        SELECT
          category_skill_id,
          name,
          TO_CHAR(created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at
        FROM skill_categories
        WHERE skill_category_id = $1
      `,
      values: [insertedId]
    })
    return res.status(STATUS.CREATED).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
