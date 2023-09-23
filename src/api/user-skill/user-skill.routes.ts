import { Router } from 'express'
import { addUserSkill } from './actions/add.action'
import { getAllUserSkill } from './actions/getAll.action'
import { getPaginated } from './actions/getPaginated.action'
import { getByIdSkillUser } from './actions/getById.action'
import { schemaGuard } from '../../middlewares/schemaGuard'
import { userSkillSchema, userUpdateSkillSchema } from './user-skill.schema'
import { updateUserSkill } from './actions/update.action'
import { deleteSkillUser } from './actions/delete.action'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', getPaginated)
router.get('/all', getAllUserSkill)
router.get('/:skillId', getByIdSkillUser)
router.post('/', schemaGuard(userSkillSchema), addUserSkill)
router.put('/:skillId', schemaGuard(userUpdateSkillSchema), updateUserSkill)
router.delete('/:skillId', deleteSkillUser)

export default router
