import { Router } from 'express'
import { addApplicationRequirements } from './actions/add.action'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { ApplicationRequirementSchema, ApplicationRequirementUpdateSchema } from './applicationR.schema'
import { getAllRequirements } from './actions/get.action'
import { getAllSearch } from './actions/getSearch.action'
import { updateRequirement } from './actions/update.action'
import { deleteRequirement } from './actions/delete.action'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', getAllRequirements)
router.get('/search', getAllSearch)
router.post('/publication/:publicationId', schemaGuard(ApplicationRequirementSchema), addApplicationRequirements)
router.put('/:publicationId/:skillCategoryId/:skillId', schemaGuard(ApplicationRequirementUpdateSchema), updateRequirement)
router.delete('/:publicationId/:skillCategoryId/:skillId', deleteRequirement)

export default router
