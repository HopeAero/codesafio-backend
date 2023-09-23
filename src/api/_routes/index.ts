import { Router } from 'express'

// APIs
import adminsRouter from '../admins/admins.routes'
import testRouter from '../test/test.routes'

const router = Router()

router.use('/admins', adminsRouter)

router.use('/test', testRouter)

export default router
