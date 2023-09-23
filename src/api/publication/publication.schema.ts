import { z } from 'zod'
import { StatusPublication } from '../../utils/status.enum'

export const publicationSchema = z.object({
  publicationId: z
    .number()
    .min(1, 'El id del proyecto debe ser mayor o igual a 1')
    .optional(),
  name: z
    .string()
    .nonempty('Es necesario indicar un nombre de proyecto')
    .max(64, 'El nombre debe ser menor a 64 carácteres'),
  description: z
    .string()
    .nonempty('Es necesario indicar una descripción de proyecto')
    .max(500, 'La descripción debe ser menor a 500 carácteres')
    .optional(),
  applicationDescription: z
    .string()
    .nonempty('Es necesario indicar una descripción de aplicación de proyecto')
    .max(500, 'La descripción debe ser menor a 500 carácteres')
    .optional(),
  difficulty: z
    .number()
    .min(1, 'La dificultad debe ser mayor o igual a 1')
    .max(4, 'La dificultad debe ser menor o igual a 5'),
  status: z
    .enum([StatusPublication.STARTED, StatusPublication.FINISHED, StatusPublication.NOTSTARTED])
    .default(StatusPublication.NOTSTARTED)
})

export type Publication = z.infer<typeof publicationSchema>

export type PublicationPayload = Omit<Publication, 'publicationId'>
