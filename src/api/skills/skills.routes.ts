import { Router } from 'express'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { SkillSchema } from './skills.schema'

import { getSkills } from './actions/get.action'
import { getSkillCategoryById } from './actions/getById.action'
import { addSkill } from './actions/add.action'
import { updateSkill } from './actions/update.action'
import { deleteSkill } from './actions/delete.action'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', getSkills)
router.get('/:skillId', getSkillCategoryById)
router.post('/', schemaGuard(SkillSchema), addSkill)
router.put('/:skillId', schemaGuard(SkillSchema), updateSkill)
router.delete('/:skillId', deleteSkill)

export default router
