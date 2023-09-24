import { Request, Response } from 'express'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const getVeryAll = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { rows } = await pool.query({
      text: `
      SELECT
      skill_category_id,
      skill_id,
      name,
      TO_CHAR(created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at
    FROM skills
    ORDER BY skill_category_id;    
      `
    })
    return res.status(STATUS.OK).json(camelizeObject(rows))
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
