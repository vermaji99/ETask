const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // If connection fails, we'll try to connect to local mongodb as a fallback
    if (process.env.NODE_ENV === 'development') {
      try {
        console.log('Attempting to connect to local MongoDB fallback...');
        const localConn = await mongoose.connect('mongodb://localhost:27017/kiet_task');
        console.log(`MongoDB Connected (Local Fallback): ${localConn.connection.host}`);
        return localConn;
      } catch (localError) {
        console.error(`Local MongoDB fallback failed: ${localError.message}`);
      }
    }
    console.log('Server will continue running, but database features may not work.');
  }
};

module.exports = connectDB;
