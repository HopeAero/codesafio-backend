import { Request, Response } from 'express'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'

export const updateSkillCategory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name } = req.body
    const response = await pool.query({
      text: `
        UPDATE skill_categories
        SET name = $1,
        WHERE skill_category_id = $2
      `,
      values: [name, req.params.skillCategoryId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se pudo encontrar el registro de id: ${req.params.skillCategoryId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json({ message: 'Usuario modificado correctamente' })
  } catch (error) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
