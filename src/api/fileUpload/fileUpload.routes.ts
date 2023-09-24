import express, { Request, Response, NextFunction } from 'express'
import multer from 'multer'

const router = express.Router()
/* eslint-disable @typescript-eslint/no-misused-promises */
router.post('/', addFile)

export default router
