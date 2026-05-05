const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');

// Load env vars
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to database then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
