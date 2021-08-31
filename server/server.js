require('dotenv').config({ path: './config.env' })
const express = require('express')
const connectDB = require('./config/db')
/** Error handler */
const errorHandler = require('./middleware/error')

//connect DB
connectDB()

const app = express()

//middleware
app.use(express.json())

app.get("/", (req, res, next) => {
    res.send("Api running");
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/private', require('./routes/private'))
/** Error handler middleware*/
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`sever running on port ${PORT}`))

process.on('uncaughtException', (err, promise) => {
    console.log(`logged Error: ${err}`)
    server.close(() => process.exit(1))
})