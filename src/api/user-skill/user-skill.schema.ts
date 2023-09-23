import { z } from 'zod'

export const userSkillSchema = z.object({
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
})

export const userUpdateSkillSchema = z.object({
  level: z
    .number()
    .min(1, 'el nivel debe ser mayor o igual a 1')
    .max(4, 'el nivel debe ser menor o igual a 4')
})

export type UserSkill = z.infer<typeof userSkillSchema>

export type UserSkillPayload = Omit<UserSkill, 'skillCategoryId' | 'skillId'>
