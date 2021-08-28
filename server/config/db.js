/**
 * mongoose connect
 */
const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        retryWrites: true,
        w: "majority",
    })
    console.log('Mongodb connected')

}

module.exports = connectDB