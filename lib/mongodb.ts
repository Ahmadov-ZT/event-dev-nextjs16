import mongoose from 'mongoose';

// Define the structure of our cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global namespace to include our mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Retrieve MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Validate that the MongoDB URI is defined
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Initialize the cached connection object
// In development, use a global variable to preserve the connection across hot reloads
// In production, this will be created fresh on each cold start
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes and returns a cached connection to MongoDB
 * 
 * This function ensures that:
 * - Only one connection is created and reused across requests
 * - In development mode, the connection persists across hot reloads
 * - Connection is properly typed for TypeScript
 * 
 * @returns Promise<typeof mongoose> - The mongoose instance with an active connection
 */
async function dbConnect(): Promise<typeof mongoose> {
  // If connection already exists, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection exists but a connection promise is in progress, await it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering to fail fast if not connected
    };

    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, clear the promise so it can be retried
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
