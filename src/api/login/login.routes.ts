import { Router } from 'express'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { loginSchema } from './login.schema'
import { signIn } from './actions/login.action'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/', schemaGuard(loginSchema), signIn)

export default router
