const app = require('./app');
const dbConfig = require('./config/db.config');
const cloudinaryConfig = require('./config/cloudinary.config');

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await dbConfig();
  cloudinaryConfig(); // Initialize Cloudinary configuration
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
