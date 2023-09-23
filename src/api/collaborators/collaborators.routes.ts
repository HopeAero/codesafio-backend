import { Router } from 'express'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { CollaboratorSchema } from './collaborators.schema'
import { addCollaborator } from './actions/add.action'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */

router.post('/', schemaGuard(CollaboratorSchema), addCollaborator)

export default router
