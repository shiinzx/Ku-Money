import fs from 'fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';
import connectDB from './src/config/db.js';
import SubscriptionPackage from './src/models/subscriptionpackage.model.js';
import dotenv from 'dotenv';

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to DB
connectDB();

// Read JSON files
const packages = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'subscription-packages.json'), 'utf-8')
);

// Mangle the _id field to be a valid ObjectId
const packagesToImport = packages.map(pkg => ({ ...pkg, _id: new mongoose.Types.ObjectId(pkg._id.$oid) }));

// Import into DB
const importData = async () => {
  try {
    await SubscriptionPackage.deleteMany();
    await SubscriptionPackage.create(packagesToImport);
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await SubscriptionPackage.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
    console.log('Please add an option: -i to import or -d to delete');
    process.exit();
}
