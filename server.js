require('dotenv').config({ path: './config.env' })
const express = require('express')
const errorHandler = require('./middleware/error')

//mongoDB connect
const connectDB = require('./config/db')
connectDB()

const app = express()

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/private', require('./routes/private'))

//erro handler (should be last piece of middleware)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => console.log(`server running on port ${PORT}`))

process.on('unhandledRejection', (err, promise) => {
    console.log(`looged error : ${err}`)
    server.close(() => process.exit(1))
})