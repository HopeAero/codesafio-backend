import { z } from 'zod'
import { Occupations } from '../../utils/roles.enum'

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty('Es necesario indicar un correo electrónico')
    .max(64, 'El nombre debe ser menor a 64 carácteres')
    .email('Debe ingresar un correo electrónico valido'),
  password: z
    .string()
    .nonempty('Es necesario ingresar una contraseña')
    .max(64, 'El nombre debe ser menor a 64 carácteres')
})

export const registerSchema = z.object({
  name: z
    .string()
    .nonempty('Es necesario indicar un nombre de usuario')
    .max(64, 'El nombre de usuario debe ser menos a 64 carácteres'),
  email: z
    .string()
    .nonempty('Es necesario indicar un correo electrónico')
    .max(64, 'El correo debe ser menor a 64 carácteres')
    .email('Debe ingresar un correo electrónico valido'),
  password: z
    .string()
    .nonempty('Es necesario ingresar una contraseña')
    .max(64, 'El nombre debe ser menor a 64 carácteres'),
  occupation: z
    .enum([Occupations.GRADUATED, Occupations.STUDENT, Occupations.TEACHER])
})
