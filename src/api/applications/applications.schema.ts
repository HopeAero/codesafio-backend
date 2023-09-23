import { z } from 'zod'

export const ApplicationSchema = z.object({
  projectId: z
    .number()
    .min(1, 'El id de categoria debe ser mayor o igual a 1'),
  userId: z
    .number()
    .min(1, 'El id de categoria debe ser mayor o igual a 1'),
  isAccepted: z
    .boolean()
    .nullable()
    .optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede superar los 500 caracteres')
    .optional(),
  createdAt: z
    .string()
    .optional()
})

export const UpdateApplicationSchema = z.object({
  description: z
    .string()
    .max(500, 'La descripción no puede superar los 500 caracteres')
    .optional()
})

export type Application = z.infer<typeof ApplicationSchema>

export type ApplicationPayload = Omit<Application, 'createdAt'>
