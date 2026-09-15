import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import { env } from './config/env.js'
import routes from './routes/index.js'
import errorHandler from './middleware/error.js'
import { apiLimiter } from './middleware/rateLimit.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const allowedOrigins = new Set([
  ...(env.clientUrls || [env.clientUrl]),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://hassan-noor.vercel.app',
].filter(Boolean))

if (env.nodeEnv === 'development') app.use(morgan('dev'))
app.use(compression())
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true)
      return
    }

    callback(new Error(`CORS policy: origin ${origin} is not allowed`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Serve frontend build in production
if (env.nodeEnv === 'production') {
  const distPath = path.join(__dirname, '../../dist')
  app.use(express.static(distPath))
}

app.use('/api', apiLimiter, routes)

app.get('/health', (req, res) => res.json({ status: 'ok', env: env.nodeEnv }))

// 404
app.use('*', (req, res) => {
  if (env.nodeEnv === 'production') {
    return res.sendFile(path.join(__dirname, '../../dist', 'index.html'))
  }
  res.status(404).json({ success: false, message: 'Route not found.' })
})

app.use(errorHandler)

export default app