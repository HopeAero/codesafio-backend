import { Router } from 'express'
import { addFile } from './actions/addFile.action'

const router = Router()

/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/', addFile)

export default router
