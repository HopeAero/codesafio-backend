import { Router } from 'express'

// APIs
import testRouter from '../test/test.routes'
import userRouter from '../users/users.routes'
import authRouter from '../auth/auth.routes'
import { tokenGuard } from '../../middlewares/tokenGuard'
import { isAdmin, verifyToken } from '../../middlewares/auth'

const router = Router()

router.use('/users', tokenGuard(), verifyToken(), isAdmin(), userRouter)
router.use('/auth', authRouter)
router.use('/test', testRouter)

export default router
