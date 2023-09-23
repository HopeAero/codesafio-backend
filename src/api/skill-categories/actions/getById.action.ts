import { Request, Response } from 'express'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { StatusError } from '../../../utils/responses/status-error'

export const getSkillCategoryById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const response = await pool.query({
      text: `
        SELECT
          skill_category_id,
          name,
          TO_CHAR(created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at
        FROM skill_categories
        WHERE skill_category_id = $1
          `,
      values: [req.params.userId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se pudo encontrar el registro de id: ${req.params.skillCategoryId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json(camelizeObject(response.rows[0]))
  } catch (error) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
