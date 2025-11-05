const mongoose = require('mongoose');

const connectdb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
       console.log(`MongoDB connected successfully to host: ${mongoose.connection.host}`);
     } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectdb;