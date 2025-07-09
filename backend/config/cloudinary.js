

import dotenv from 'dotenv';
dotenv.config(); // Load .env before using process.env

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//  Debug log with proper object stringification
console.log("Cloudinary ENV Loaded:", JSON.stringify({
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET,
}, null, 2));

export default cloudinary;
