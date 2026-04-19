import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop the specific index and collection
    const db = mongoose.connection.db;
    
    // Drop the users collection entirely to remove the problematic index
    try {
      await db.collection('users').drop();
      console.log('Dropped users collection');
    } catch (err) {
      console.log('Collection does not exist or already dropped');
    }

    // Drop all collections to start fresh
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`Dropped ${collection.name} collection`);
    }

    console.log('All collections dropped');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

dropIndex();
