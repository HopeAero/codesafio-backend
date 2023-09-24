import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { StatusError } from '../../../utils/responses/status-error'
import { CombinedProject, Publication, Skill } from './get.action'

export const getPublicationById = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const response = await pool.query({
      text: `
      SELECT
        p.publication_id,
        p.name AS project_name,
        p.description AS project_description,
        p.application_description,
        p.difficulty,
        p.status,
        p.user_lead_id,
        u.name AS user_lead_name,
        TO_CHAR(p.created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at,
        TO_CHAR(p.updated_at, 'DD/MM/YYYY - HH12:MI AM') AS updated_at
      FROM publications AS p
      INNER JOIN users AS u ON p.user_lead_id = u.user_id
      WHERE p.publication_id = $1
      `,
      values: [req.params.publicationId]
    })

    const response2 = await pool.query({
      text: `
      SELECT
      ar.publication_id,
      s.skill_category_id AS skill_category_id,
      s.skill_id AS skill_id,
      s.name AS skill_name,
      ar.level,
      TO_CHAR(ar.created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at
      FROM application_requirements AS ar
      INNER JOIN skills AS s ON ar.skill_id = s.skill_id
      WHERE ar.publication_id = $1
      ORDER BY ar.publication_id;
      `,
      values: [req.params.publicationId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se pudo encontrar el registro de id: ${req.params.publicationId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    // Obtén los datos de proyectos y habilidades requeridas
    const projectData: Publication[] = camelizeObject(response.rows) as Publication[]
    const skillData: Skill[] = camelizeObject(response2.rows) as Skill[]

    // Combina los datos de proyectos y habilidades requeridas
    const combinedData: CombinedProject[] = projectData.map((publication) => {
      const projectSkills: Skill[] = skillData.filter(
        (skill) => skill.publicationId === publication.publicationId
      )
      return { publication, skills: projectSkills }
    })

    // Ahora, response contendrá la estructura deseada
    return res.status(STATUS.OK).json(combinedData[0])
  } catch (error) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
