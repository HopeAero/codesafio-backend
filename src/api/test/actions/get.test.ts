import { Response, Request } from 'express'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const getTest = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const response = await pool.query({
      text: 'SELECT * FROM test'
    })

    return res.status(STATUS.OK).json(camelizeObject(response.rows))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
