import { z } from 'zod'

export const SkillSchema = z.object({
  skillCategoryId: z
    .number()
    .min(1, 'El id de categoria debe ser mayor o igual a 1'),
  skillId: z
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

export const UpdateSkillSchema = z.object({
  name: z
    .string()
    .nonempty('Es necesario indicar un nombre para la categoria')
    .max(64, 'El nombre de la categoria debe ser menor a 64 carácteres')
})

export type Skill = z.infer<typeof SkillSchema>

export type SkillPayload = Omit<Skill, 'skillId' | 'createdAt'>
