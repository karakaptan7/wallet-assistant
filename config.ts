
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Export the API key
export const API_KEY = process.env.API_KEY;
