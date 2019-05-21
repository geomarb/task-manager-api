const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const server = { port: process.env.PORT }

// const isInMaintenance = false
// app.use((req, res, next) => {
//     if (isInMaintenance) return res.status(503).send({ error: 'Sorry for that! Our system in currently in maintenance. We will be back soon!!!' })
//     next()
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(server.port, () => {
    console.log(`Task Manager server is up on PORT:${server.port}`)
})
