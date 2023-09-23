import { Router } from 'express'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { ApplicationSchema, UpdateApplicationSchema } from './applications.schema'

import { getApplications } from './actions/get.action'
import { getApplicationsByPublicationID } from './actions/getByPublicationId.action'
import { getApplicationsByUserID } from '../applications/actions/getByUserId.action'
import { addApplication } from './actions/add.action'
import { updateApplication } from './actions/update.action'
import { deleteApplication } from './actions/delete.action'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', getApplications)
router.get('/publication/:publicationId', getApplicationsByPublicationID)
router.get('/user/:userId', getApplicationsByUserID)
router.post('/', schemaGuard(ApplicationSchema), addApplication)
router.put('/publication/:publicationId/user/:userId', schemaGuard(UpdateApplicationSchema), updateApplication)
router.delete('/publication/:publicationId/user/:userId', deleteApplication)

export default router
