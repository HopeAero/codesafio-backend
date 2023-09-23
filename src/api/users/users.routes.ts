import { Router } from 'express'
import { addUsers } from './actions/add.action'
import { getUsers } from './actions/get,action'
import { UserSchema } from './users.schema'
import { schemaGuard } from '../../middlewares/schemaGuard'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', getUsers)
router.post('/', schemaGuard(UserSchema), addUsers)

export default router
