import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const addUserSkill = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.id
    const { skillCategoryId, skillId, level } = req.body
    await pool.query({
      text: `
            INSERT INTO user_skills
                (user_id, skill_category_id, skill_id, level)
                VALUES ($1, $2, $3, $4)
            RETURNING user_id
            `,
      values: [userId, skillCategoryId, skillId, level]
    })
    const response = await pool.query({
      text: `
            SELECT
                user_id,
                skill_category_id,
                skill_id,
                level
            FROM user_skills
            WHERE user_id = $1 AND skill_id = $2 AND skill_category_id = $3 AND level = $4 
            `,
      values: [userId, skillId, skillCategoryId, level]
    })
    return res.status(STATUS.CREATED).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
