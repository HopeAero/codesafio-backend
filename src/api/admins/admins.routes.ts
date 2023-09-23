import { Router } from 'express'

// Middlewares
import { paginationGuard } from '../../middlewares/paginationGuard'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { adminsSchema } from './admins.schema'

// Controllers
import { getAdmins } from './actions/get.action'
import { getAdminById } from './actions/getById.action'
import { addAdmin } from './actions/add.action'
import { updateAdmin } from './actions/update.action'
import { deleteAdmin } from './actions/delete.action'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', paginationGuard(), getAdmins)
router.get('/:adminId', getAdminById)
router.post('/', schemaGuard(adminsSchema), addAdmin)
router.put('/:adminId', schemaGuard(adminsSchema), updateAdmin)
router.delete('/:adminId', deleteAdmin)

export default router
