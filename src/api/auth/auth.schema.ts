import { z } from 'zod'

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
