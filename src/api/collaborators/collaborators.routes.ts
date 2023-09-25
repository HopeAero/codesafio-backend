import { Router } from 'express'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { CollaboratorSchema, UpdateApplicationSchema } from './collaborators.schema'
import { addCollaborator, rejectCollaborator } from './actions/add.action'
import { getCollaboratorAll } from './actions/getAll.action'
import { getCollaborator } from './actions/get.action'
import { getCollaboratorMineProject } from './actions/getMine.action'
import { getParticipate } from './actions/getParticipate.action'
import { updateCollaborator } from './actions/update.action'
import { deleteColaborator } from './actions/delete.action'
import { getPostulent } from './actions/getPostulante.action'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/all', getCollaboratorAll)
router.get('/', getCollaborator)
router.get('/project/:publicationId', getPostulent)
router.get('/mine/:publicationId', getCollaboratorMineProject)
router.get('/participate/:publicationId', getParticipate)
router.get('/:publicationId', getCollaborator)
router.post('/', schemaGuard(CollaboratorSchema), addCollaborator)
router.post('/reject', rejectCollaborator)
router.put('/:publicationId/:userId', schemaGuard(UpdateApplicationSchema), updateCollaborator)
router.delete('/:publicationId/:userId', deleteColaborator)

export default router
