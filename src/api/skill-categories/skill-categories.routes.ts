import { Router } from 'express'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { SkillCategorySchema } from './skill-categories.schema'

import { getSkillCategories } from './actions/get.action'
import { getSkillCategoryById } from './actions/getById.action'
import { addSkillCategory } from './actions/add.action'
import { updateSkillCategory } from './actions/update.action'
import { deleteSkillCategory } from './actions/delete.action'
import { isAdmin } from '../../middlewares/auth'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', getSkillCategories)
router.get('/:skillCategoryId', getSkillCategoryById)
router.post('/', isAdmin(), schemaGuard(SkillCategorySchema), addSkillCategory)
router.put('/:skillCategoryId', isAdmin(), schemaGuard(SkillCategorySchema), updateSkillCategory)
router.delete('/:skillCategoryId', isAdmin(), deleteSkillCategory)

export default router
