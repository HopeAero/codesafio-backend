import { Request, Response } from 'express'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const getCollaboratorAll = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const response = await pool.query({
      text: `
            SELECT *
            FROM collaborators
            `
    })
    return res.status(STATUS.OK).json({
      items: camelizeObject(response.rows)
    })
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
