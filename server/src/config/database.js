const mongoose = require('mongoose');


const database = async () => {
    mongoose.connect(process.env.DB_LINK)
}

module.exports = database;
