import { Router } from 'express'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { publicationSchema } from './publication.schema'
import { addPublication } from './actions/add.action'
import { getPublications } from './actions/get.action'
import { getPublicationById } from './actions/getById.action'
import { getPublicationByMine } from './actions/getByMine.action'
import { getPublicationByUser } from './actions/getByUserId.action'
import { updatePublication } from './actions/update.action'
import { isAdmin } from '../../middlewares/auth'
import { updatePublicationMine } from './actions/updateMine.action'
import { deletePublicationMine } from './actions/deleteMine.action'
import { deletePublication } from './actions/delete.action'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', getPublications)
router.get('/mine', getPublicationByMine)
router.get('/userPublication/:userId', getPublicationByUser)
router.post('/', schemaGuard(publicationSchema), addPublication)
router.put('/admin/:publicationId', schemaGuard(publicationSchema), isAdmin(), updatePublication)
router.delete('/admin/:publicationId', isAdmin(), deletePublication)
router.put('/mine/:publicationId', schemaGuard(publicationSchema), updatePublicationMine)
router.delete('/mine/:publicationId', deletePublicationMine)
router.get('/:publicationId', getPublicationById)
export default router
