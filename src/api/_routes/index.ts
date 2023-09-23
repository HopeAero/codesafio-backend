import { Router } from 'express'

// APIs
import testRouter from '../test/test.routes'
import userRouter from '../users/users.routes'

const router = Router()

router.use('/users', userRouter)

router.use('/test', testRouter)

export default router
