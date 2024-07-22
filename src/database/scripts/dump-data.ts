import configs from '@/src/config';
import mongoose from 'mongoose';
import { User } from '../models/user.model';

// Function to connect to the database and delete all data
const deleteData = async () => {
  try {
    await mongoose.connect(configs.mongodbUrl);
    console.log('Connected to MongoDB.');

    // Delete all documents in the User collection
    const result = await User.deleteMany({});
    console.log(`Data deleted, count: ${result.deletedCount}`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

deleteData();
