import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { StatusError } from '../../../utils/responses/status-error'

export const getByIdSkillUser = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.id
    const skillId = req.params.skillId
    const response = await pool.query({
      text: `
                SELECT *
                FROM user_skills
                WHERE user_id = $1
                AND skill_id = $2
            `,
      values: [userId, skillId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar habilidades a este usuario con id: ${userId} y skill_id: ${skillId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json({
      item: camelizeObject(response.rows)
    })
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
