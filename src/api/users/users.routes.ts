import { Router } from 'express'
import { addUsers } from './actions/add.action'
import { getUsers } from './actions/get.action'
import { getUserById } from './actions/getById.action'
import { UserSchema } from './users.schema'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { updateUsers } from './actions/update.action'
import { deleteUsers } from './actions/delete.action'
import { isAdmin } from '../../middlewares/auth'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', isAdmin(), getUsers)
router.get('/:userId', getUserById)
router.post('/', isAdmin(), schemaGuard(UserSchema), addUsers)
router.put('/:userId', schemaGuard(UserSchema), updateUsers)
router.delete('/:userId', isAdmin(), deleteUsers)

export default router
