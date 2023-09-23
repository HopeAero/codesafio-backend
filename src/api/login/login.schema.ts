import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .nonempty('Es necesario indicar un correo electrónico')
    .max(64, 'El nombre debe ser menor a 64 carácteres'),
  password: z
    .string()
    .nonempty('Es necesario ingresar una contraseña')
    .max(64, 'El nombre debe ser menor a 64 carácteres')
})
