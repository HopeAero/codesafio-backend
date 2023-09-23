import { z } from 'zod'

export const SkillCategorySchema = z.object({
  skillCategoryId: z
    .number()
    .min(1, 'El id de categoria debe ser mayor o igual a 1')
    .optional(),
  name: z
    .string()
    .nonempty('Es necesario indicar un nombre para la categoria')
    .max(64, 'El nombre de la categoria debe ser menor a 64 carácteres'),
  createdAt: z
    .string()
    .optional()
})

export type SkillCategory = z.infer<typeof SkillCategorySchema>

export type SkillCategoryPayload = Omit<SkillCategory, 'skillCategoryId' | 'createdAt'>
