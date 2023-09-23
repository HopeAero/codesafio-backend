import { Router } from 'express'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { ApplicationSchema, UpdateApplicationSchema } from './applications.schema'

import { getApplications } from './actions/get.action'
import { getApplicationByProjectId } from './actions/getByProjectId.action'
import { getApplicationByUserId } from './actions/getByUserId.action'
import { addApplication } from './actions/add.action'
import { updateApplication } from './actions/update.action'
import { deleteApplication } from './actions/delete.action'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', getApplications)
router.get('/project/:projectId', getApplicationByProjectId)
router.get('/user/:userId', getApplicationByUserId)
router.post('/', schemaGuard(ApplicationSchema), addApplication)
router.put('/project/:projectId/user/:userId', schemaGuard(UpdateApplicationSchema), updateApplication)
router.delete('/project/:projectId/user/:userId', deleteApplication)

export default router
