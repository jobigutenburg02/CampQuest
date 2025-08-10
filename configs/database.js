const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Database Connected'))
    .catch(err => {
      console.log("Database Connection Failed", err);
    });
};

module.exports = connectDB;
