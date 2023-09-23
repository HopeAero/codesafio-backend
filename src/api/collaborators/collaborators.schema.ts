import { z } from 'zod'

export const CollaboratorSchema = z.object({
  publicationId: z
    .number()
    .min(1, 'El id de categoria debe ser mayor o igual a 1'),
  userId: z
    .number()
    .min(1, 'El id de categoria debe ser mayor o igual a 1'),
  description: z
    .string()
    .max(500, 'La descripción no puede superar los 500 caracteres')
    .optional(),
  rating: z
    .number()
    .min(1, 'El rating minimo es de 1'),
  createdAt: z
    .string()
    .optional()
})

// export const UpdateApplicationSchema = z.object({
//   description: z
//     .string()
//     .max(500, 'La descripción no puede superar los 500 caracteres')
//     .optional()
// })

export type Collaborator = z.infer<typeof CollaboratorSchema>

export type CollaboratorPayload = Omit<Collaborator, 'createdAt'>
