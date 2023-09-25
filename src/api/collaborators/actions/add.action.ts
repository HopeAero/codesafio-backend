import { Response } from 'express'
import { ExtendedRequest } from '../../../middlewares/auth'
import { pool } from '../../../database'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { StatusError } from '../../../utils/responses/status-error'

export const addCollaborator = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { userId, publicationId, rating, description } = req.body
    const userLeadId = req.user.id
    const validate = await pool.query({
      text: `
            SELECT
                publication_id
                user_id
            FROM applications
            WHERE user_id = $1 AND publication_id = $2 AND is_accepted IS NULL
        `,
      values: [userId, publicationId]
    })

    if (validate.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar un usuario que aplico a este Proyecto: ${publicationId} y Usuario ${userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    const validate2 = await pool.query({
      text: `
                SELECT
                    publication_id
                    user_lead_id
                FROM publications
                WHERE user_lead_id = $1 AND publication_id = $2
            `,
      values: [userLeadId, publicationId]
    })

    if (validate2.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar un usuario que lidera este Proyecto: ${publicationId} y Usuario ${userLeadId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    await pool.query({
      text: `
            INSERT INTO collaborators
            (user_id, publication_id, rating, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
      values: [userId, publicationId, rating, description]
    })

    await pool.query({
      text: `
            UPDATE applications
            SET
                    user_id = $1,
                    publication_id = $2,
                    is_accepted = true
            WHERE user_id = $1 AND publication_id = $2
        `,
      values: [userId, publicationId]
    })

    const response = await pool.query({
      text: `
            SELECT
                user_id,
                publication_id,
                TO_CHAR(created_at, 'DD/MM/YYYY - HH12:MI AM') AS created_at,
            FROM collaborators
            WHERE user_id = $1 AND publication_id = $2
        `,
      values: [userId, publicationId]
    })
    return res.status(STATUS.CREATED).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}

export const rejectCollaborator = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { userId, publicationId } = req.body
    const userLeadId = req.user.id
    const validate = await pool.query({
      text: `
            SELECT
                publication_id
                user_id
            FROM applications
            WHERE user_id = $1 AND publication_id = $2 AND is_accepted IS NULL
        `,
      values: [userId, publicationId]
    })

    if (validate.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar un usuario que aplico a este Proyecto: ${publicationId} y Usuario ${userId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    const validate2 = await pool.query({
      text: `
                SELECT
                    publication_id
                    user_lead_id
                FROM publications
                WHERE user_lead_id = $1 AND publication_id = $2
            `,
      values: [userLeadId, publicationId]
    })

    if (validate2.rowCount === 0) {
      throw new StatusError({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `No se pudo encontrar un usuario que lidera este Proyecto: ${publicationId} y Usuario ${userLeadId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }

    await pool.query({
      text: `
            UPDATE applications
            SET
                    user_id = $1,
                    publication_id = $2,
                    is_accepted = false
            WHERE user_id = $1 AND publication_id = $2
        `,
      values: [userId, publicationId]
    })

    return res.status(STATUS.CREATED).json({ message: 'Colaborador rechazado correctamente' })
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
