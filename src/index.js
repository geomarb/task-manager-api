const app = require('./app')
const port = process.env.PORT

// const isInMaintenance = false
// app.use((req, res, next) => {
//     if (isInMaintenance) return res.status(503).send({ error: 'Sorry for that! Our system in currently in maintenance. We will be back soon!!!' })
//     next()
// })

app.listen(port, () => {
    console.log(`Task Manager server is up on PORT:${port}`)
})
