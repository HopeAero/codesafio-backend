import { Request, Response } from 'express'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'
import { getAdminsDataFromRequestBody } from '../_utils/getDataFromBody'

export const updateAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const updatedAdmin = await getAdminsDataFromRequestBody(req)
    const response = await pool.query({
      text: `
        UPDATE admins 
        SET 
          name = $1, 
          email = $2, 
          password = $3
        WHERE admin_id = $4
      `,
      values: [...updatedAdmin, req.params.adminId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se pudo encontrar el registro de id: ${req.params.adminId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json({ message: 'Administrador modificado correctamente' })
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
