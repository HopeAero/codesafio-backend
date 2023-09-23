import { Request, Response } from 'express'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'

export const deleteSkill = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const response = await pool.query({
      text: `
        DELETE FROM skills
        WHERE skill_id = $1
      `,
      values: [req.params.skillId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se pudo encontrar el registro de id: ${req.params.skillId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json({ message: 'Habilidad eliminada correctamente' })
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
