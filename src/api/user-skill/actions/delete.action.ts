import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'

export const deleteSkillUser = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.id
    const skillId = req.params.skillId
    const response = await pool.query({
      text: `
                DELETE FROM user_skills
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
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      message: `Se elimino la habilidad con id: ${skillId} al usuario con id: ${userId}`
    })
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
