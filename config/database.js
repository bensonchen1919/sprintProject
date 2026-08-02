import mongoose from "mongoose";

export async function connectDatabase() {
  const connectionString =
    process.env.MONGODB_URI ??
    "mongodb://127.0.0.1:27017/ai-development-game";

  await mongoose.connect(connectionString);

  console.log("Connected to MongoDB");
}
