import { Router } from 'express'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { loginSchema, registerSchema } from './auth.schema'
import { signIn } from './actions/login.action'
import { signInAdmin } from './actions/login-admin.action'
import { signUp } from './actions/register.action'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/login', schemaGuard(loginSchema), signIn)
router.post('/login-admin', schemaGuard(loginSchema), signInAdmin)
router.post('/register', schemaGuard(registerSchema), signUp)

export default router
