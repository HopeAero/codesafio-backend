import { Router } from 'express'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { SkillSchema, UpdateSkillSchema } from './skills.schema'

import { getSkills } from './actions/get.action'
import { getSkillByID } from './actions/getById.action'
import { addSkill } from './actions/add.action'
import { updateSkill } from './actions/update.action'
import { deleteSkill } from './actions/delete.action'

// import { isAdmin } from '../../middlewares/auth'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', getSkills)
router.get('/:skillId', getSkillByID)
router.post('/', schemaGuard(SkillSchema), addSkill)
router.put('/:skillId', schemaGuard(UpdateSkillSchema), updateSkill)
router.delete('/:skillId', deleteSkill)

export default router
