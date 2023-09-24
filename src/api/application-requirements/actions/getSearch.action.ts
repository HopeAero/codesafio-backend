import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { StatusError } from '../../../utils/responses/status-error'

export const getAllSearch = async (
  _req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const skillCategoryName = _req.query.skillCategoryName
    const skillName = _req.query.skillName

    const response = await pool.query({
      text: `
        SELECT
          p.publication_id,
          p.name AS project_name,
          p.description AS project_description,
          ac.skill_category_id,
          ac.skill_id,
          sc.name as skillCategoryName,
          s.name as skillName,
          ac.level,
          ac.quantity
        FROM publications p
        JOIN application_requirements ac
          ON p.publication_id = ac.publication_id
        JOIN skills s
          ON ac.skill_id = s.skill_id
        JOIN skill_categories sc
          ON ac.skill_category_id = sc.skill_category_id
        WHERE
          -- Aplicar filtro de búsqueda por nombre de categoría de habilidad o nombre de habilidad
          sc.name ~* $1 OR
          s.name ~* $2
      `,
      values: [skillCategoryName, skillName]
    })

    if (response.rowCount === 0) {
      throw new StatusError({
        message: 'No se pudo encontrar habilidades en las publicaciones',
        statusCode: STATUS.NOT_FOUND
      })
    }

    return res.status(STATUS.OK).json({
      items: camelizeObject(response.rows)
    })
  } catch (error: unknown) {
    console.error(error) // Imprime el error en la consola
    return handleControllerError(error, res)
  }
}
