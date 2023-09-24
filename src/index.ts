import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import { PORT } from './config'
import apiRouter from './api/_routes'

// App Declaration
const app = express()

// Settings
app.set('port', PORT !== '' ? PORT : 3000)

// Middlewares
app.use(morgan('dev'))
app.use(cors())
app.use(express.json()) // middleware que transforma la req.body a un json
app.use('/uploads', express.static(path.resolve('uploads')))

// Routes
app.use('/', apiRouter)

// Starting the server
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'))
})
