import { Request, Response } from 'express'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'

export const updateSkill = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { skillCategoryId, name } = req.body
    const response = await pool.query({
      text: `
        UPDATE skills
        SET skill_category_id = $1, name = $2,
        WHERE skill_id = $3
      `,
      values: [skillCategoryId, name, req.params.skillId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se pudo encontrar el registro de id: ${req.params.skillId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json({ message: 'Usuario modificado correctamente' })
  } catch (error) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
