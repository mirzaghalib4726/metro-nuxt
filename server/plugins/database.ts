import mongoose from 'mongoose';

export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig();
  
  const MONGODB_URI = config.mongodbUri || 'mongodb://localhost:27017/metro';

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }

  // Graceful shutdown
  nitroApp.hooks.hook('close', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  });
});
