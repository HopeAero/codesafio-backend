import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { StatusError } from '../../../utils/responses/status-error'

export const updateUserSkill = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.id
    const skillId = req.params.skillId
    const { level } = req.body
    const response = await pool.query({
      text: `
                UPDATE user_skills
                SET level = $1
                WHERE user_id = $2 AND skill_id = $3
                RETURNING user_id
                `,
      values: [level, userId, skillId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo actualizar habilidades a este usuario con id: ${userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    const responseUpdated = await pool.query({
      text: `
                SELECT
                    user_id,
                    skill_category_id,
                    skill_id,
                    level
                FROM user_skills
                WHERE user_id = $1 AND skill_id = $2 AND level = $3 
                `,
      values: [userId, skillId, level]
    })
    return res.status(STATUS.OK).json(camelizeObject({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      message: `Se actualizo la habilidad con id: ${skillId} al usuario con id: ${userId}`,
      item: responseUpdated.rows[0]
    }))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
