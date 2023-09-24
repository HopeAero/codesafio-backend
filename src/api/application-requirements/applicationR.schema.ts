import { z } from 'zod'

export const ApplicationRequirementSchema = z.object({
  publicationId: z
    .number()
    .min(1, 'El id de la publicacion debe ser mayor o igual a 1'),
  skillCategoryId: z
    .number()
    .min(1, 'El id de la categoria skill debe ser mayor o igual a 1'),
  skillId: z
    .number()
    .min(1, 'El id de la habilidad debe ser mayor o igual a 1'),
  level: z
    .number()
    .min(1, 'el nivel debe ser mayor o igual a 1')
    .max(4, 'el nivel debe ser menor o igual a 4')
    .optional(),
  quantity: z
    .number()
    .min(1, 'la cantidad debe ser mayor o igual a 1')
})

export const ApplicationRequirementUpdateSchema = z.object({
  level: z
    .number()
    .min(1, 'el nivel debe ser mayor o igual a 1')
    .max(4, 'el nivel debe ser menor o igual a 4')
    .optional(),
  quantity: z
    .number()
    .min(1, 'la cantidad debe ser mayor o igual a 1')
    .optional()
})
