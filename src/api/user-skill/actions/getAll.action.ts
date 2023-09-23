import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { StatusError } from '../../../utils/responses/status-error'

export const getAllUserSkill = async (
  _req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = _req.user.id
    const response = await pool.query({
      text: `
                SELECT *
                FROM user_skills
                WHERE user_id = $1
            `,
      values: [userId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar habilidades a este usuario con id: ${userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json({
      items: camelizeObject(response.rows)
    })
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
