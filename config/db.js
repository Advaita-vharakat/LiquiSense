const mongoose = require('mongoose');

function connectToDB(){
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/liquisense';
    if (!uri) {
        console.error('MONGO_URI is not set. Please add it to your .env file.');
        return;
    }
    mongoose.connect(uri)
      .then(() => {
          console.log('connected to DB');
      })
      .catch(err => {
          console.error('MongoDB connection error:', err.message);
          // optional: exit process on DB failure
          // process.exit(1);
      });
}

module.exports = connectToDB;