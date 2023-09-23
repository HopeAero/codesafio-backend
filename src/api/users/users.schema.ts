import { z } from 'zod'
import { Occupations, UserRole } from '../../utils/roles.enum'

export const UserSchema = z.object({
  userId: z
    .number()
    .min(1, 'El id de administrador debe ser mayor o igual a 1')
    .optional(),
  name: z
    .string()
    .nonempty('Es necesario indicar un nombre de administrador')
    .max(64, 'El nombre debe ser menor a 64 carácteres'),
  email: z
    .string()
    .nonempty('Es necesario indicar un correo electrónico')
    .max(64, 'El nombre debe ser menor a 64 carácteres')
    .email('Debe ingresar un correo electrónico valido'),
  password: z
    .string()
    .nonempty('Es necesario ingresar una contraseña')
    .max(64, 'El nombre debe ser menor a 64 carácteres'),
  role: z
    .enum([UserRole.ADMIN, UserRole.USER])
    .default(UserRole.USER),
  occupation: z
    .enum([Occupations.GRADUATED, Occupations.STUDENT, Occupations.TEACHER])
    .default(Occupations.STUDENT),
  personalDescription: z
    .string()
    .max(500, 'La descripción debe ser menor a 500 carácteres')
    .optional()
})

export type User = z.infer<typeof UserSchema>

export type UserPayload = Omit<User, 'userId'>
