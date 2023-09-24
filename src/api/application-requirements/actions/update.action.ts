import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'

export const updateRequirement = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { quantity, level } = req.body
    const { publicationId, skillCategoryId, skillId } = req.params
    const userLeaderId = req.user.id
    const verifyPublication = await pool.query({
      text: `
              SELECT *
              FROM publications
              WHERE publication_id = $1 AND user_lead_id = $2
              `,
      values: [publicationId, userLeaderId]
    })
    if (verifyPublication.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar la publicacion con id: ${publicationId} y user_lead_id: ${userLeaderId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    const verifyRequirement = await pool.query({
      text: `
                SELECT *
                FROM application_requirements
                WHERE publication_id = $1 AND skill_category_id = $2 AND skill_id = $3
                `,
      values: [publicationId, skillCategoryId, skillId]
    })

    if (verifyRequirement.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: 'No se pudo encontrar los requerimientos de la publicacion',
        statusCode: STATUS.NOT_FOUND
      })
    }

    const response = await pool.query({
      text: `
                UPDATE application_requirements
                SET 
                quantity = $1,
                level = $2

                WHERE 
                    publication_id = $3 AND
                    skill_category_id = $4 AND
                    skill_id = $5
            `,
      values: [quantity, level, publicationId, skillCategoryId, skillId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se pudo encontrar el registro de Proyecto: ${publicationId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json({ message: 'Requisito modificado correctamente' })
  } catch (error) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
