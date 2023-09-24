import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { DEFAULT_PAGE, STATUS } from '../../../utils/constants'
import { PaginateSettings, paginatedItemsResponse } from '../../../utils/responses'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

interface Publication {
  publicationId: number
  projectName: string
  projectDescription: string
  applicationDescription: string
  difficulty: number
  status: string
  userLeadId: number
  createdAt: string
  updatedAt: string
}

interface Skill {
  publicationId: number
  skillCategoryId: number
  skillId: number
  level: number
  createdAt: string
}

interface CombinedProject {
  publication: Publication
  skills: Skill[]
}

export const getPublications = async (
  req: ExtendedRequest,
  res: Response
): Promise<any> => {
  const { page = DEFAULT_PAGE.page, size = DEFAULT_PAGE.size } = req.query
  try {
    let offset = (Number(page) - 1) * Number(size)

    if (Number(page) < 1) {
      offset = 0
    }

    const { rows } = await pool.query({
      text: `
        SELECT COUNT(*) 
        FROM publications
      `
    })

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
        TO_CHAR(p.created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at,
        TO_CHAR(p.updated_at, 'DD/MM/YYYY - HH12:MI AM') AS updated_at
      FROM publications AS p
      LIMIT $1 OFFSET $2;
      `,
      values: [size, offset]
    })

    const response2 = await pool.query({
      text: `
      SELECT
      publication_id,
      skill_category_id,
      skill_id,
      level,
      TO_CHAR(created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at
      FROM application_requirements
      WHERE publication_id = $1
      ORDER BY publication_id
      `,
      values: [response.rows[0].publication_id]
    })

    const pagination: PaginateSettings = {
      total: Number(rows[0].count),
      page: Number(page),
      perPage: Number(size)
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
    return paginatedItemsResponse(res, STATUS.OK, combinedData, pagination)
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
