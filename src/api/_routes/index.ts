import { Router } from 'express'

// APIs
import skillCategoriesRouter from '../skill-categories/skill-categories.routes'
import skillsRouter from '../skills/skills.routes'
import userRouter from '../users/users.routes'
import authRouter from '../auth/auth.routes'
import publicationRouter from '../publication/publication.routes'
import skillRouter from '../skill-categories/skill-categories.routes'

import { tokenGuard } from '../../middlewares/tokenGuard'
import { isAdmin, verifyToken } from '../../middlewares/auth'

const router = Router()

router.use('/skill-categories', skillCategoriesRouter)
router.use('/skills', skillsRouter)
router.use('/users', tokenGuard(), verifyToken(), isAdmin(), userRouter)
router.use('/auth', authRouter)
router.use('/publications', tokenGuard(), verifyToken(), publicationRouter)
router.use('/skillCategory', tokenGuard(), verifyToken(), skillRouter)
router.use('/skill', tokenGuard(), verifyToken(), skillRouter)

export default router
