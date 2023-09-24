import { Router } from 'express'

// APIs
import skillCategoriesRouter from '../skill-categories/skill-categories.routes'
import skillsRouter from '../skills/skills.routes'
import userRouter from '../users/users.routes'
import authRouter from '../auth/auth.routes'
import publicationRouter from '../publication/publication.routes'
import collaboratorRouter from '../collaborators/collaborators.routes'
import applicationRouter from '../applications/applications.routes'
import userSkillRouter from '../user-skill/user-skill.routes'
import aplicationR from '../application-requirements/applicationR.routes'

import { tokenGuard } from '../../middlewares/tokenGuard'
import { verifyToken } from '../../middlewares/auth'

const router = Router()

router.use('/skill-categories', skillCategoriesRouter)
router.use('/skills', skillsRouter)
router.use('/users', tokenGuard(), verifyToken(), userRouter)
router.use('/auth', authRouter)
router.use('/publications', tokenGuard(), verifyToken(), publicationRouter)
router.use('/collaborators', tokenGuard(), verifyToken(), collaboratorRouter)
router.use('/applications', tokenGuard(), verifyToken(), applicationRouter)
router.use('/applications-requirements', tokenGuard(), verifyToken(), aplicationR)
router.use('/user/skills', tokenGuard(), verifyToken(), userSkillRouter)

export default router
