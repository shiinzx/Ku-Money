// src/server.js
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Jalankan koneksi ke database
connectDB();

// Jalankan server
app.listen(PORT, () => {
  console.log(` 🚀 Server is running on port ${PORT} and connected to MongoDB!`);
});