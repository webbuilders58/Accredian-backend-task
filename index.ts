import dotenv from "dotenv"
dotenv.config()
import express from 'express'
import { prismaCleanp, prismaInit } from './prisma/index.js'
import { router as referralRouter } from './routes/referralRoutes.js'
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/programme', referralRouter)

app.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}`)
  await prismaInit()
})

process.on('exit', async () => {
  await prismaCleanp()
  process.exit(1)
})
