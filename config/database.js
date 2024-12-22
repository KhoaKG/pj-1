const mongoose = require('mongoose');

module.exports.connect = ()=>{
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("CONNECT SUCCESS!");
    } catch (error) {
        console.log("CONNECT ERROR!");
    }
}