import { Router } from 'express'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { ApplicationSchema, UpdateApplicationSchema } from './collaborators.schema'

import { getApplications } from './actions/get.action'
import { getApplicationByPublicationId } from './actions/getByPublicationId.action'
import { getApplicationByUserId } from './actions/getByUserId.action'
import { addApplication } from './actions/add.action'
import { updateApplication } from './actions/update.action'
import { deleteApplication } from './actions/delete.action'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', getApplications)
router.get('/project/:publicationId', getApplicationByPublicationId)
router.get('/user/:userId', getApplicationByUserId)
router.post('/', schemaGuard(ApplicationSchema), addApplication)
router.put('/project/:publicationId/user/:userId', schemaGuard(UpdateApplicationSchema), updateApplication)
router.delete('/project/:publicationId/user/:userId', deleteApplication)

export default router
