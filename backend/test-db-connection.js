// Quick MongoDB connection test
const mongoose = require('mongoose');

// Replace this with your actual connection string
const MONGODB_URI = 'mongodb+srv://quizapp:Shashi%40123@quiz-app-cluster.abc12.mongodb.net/quiz-app?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
    console.log('Database name:', mongoose.connection.name);
    await mongoose.disconnect();
    console.log('Connection test complete.');
  } catch (error) {
    console.error('❌ ERROR: Failed to connect to MongoDB');
    console.error('Error:', error.message);
  }
}

testConnection();