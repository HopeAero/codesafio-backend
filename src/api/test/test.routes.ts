import { Router } from 'express'
import { getTest } from './actions/get.test'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.get('/', getTest)

export default router
