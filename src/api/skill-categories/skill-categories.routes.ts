import { Router } from 'express'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { SkillCategorySchema } from './skill-categories.schema'

import { getSkillCategories } from './actions/get.action'
import { getSkillCategoryById } from './actions/getById.action'
import { addSkillCategory } from './actions/add.action'
import { updateSkillCategory } from './actions/update.action'
import { deleteSkillCategory } from './actions/delete.action'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', getSkillCategories)
router.get('/:skillCategoryId', getSkillCategoryById)
router.post('/', schemaGuard(SkillCategorySchema), addSkillCategory)
router.put('/:skillCategoryId', schemaGuard(SkillCategorySchema), updateSkillCategory)
router.delete('/:skillCategoryId', deleteSkillCategory)

export default router
