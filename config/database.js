const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB Connected')
    } catch (error) {
        console.log(error)
        console.log('MongoDB Connected failed!')
    }
}