import connectDB from './config/db.js'
import { env } from './config/env.js'
import runSeed from './seed/index.js'

const start = async () => {
  await connectDB()
  await runSeed()
  const app = (await import('./server.js')).default
  app.listen(env.port, () => {
    console.log(`Backend running on http://localhost:${env.port}`)
  })
}

start().catch((err) => {
  console.error('Failed to start:', err)
  process.exit(1)
})