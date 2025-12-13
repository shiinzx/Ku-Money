import mongoose from "mongoose";
import dotenv from "dotenv";
import Package from "./models/package.model.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const exists = await Package.findOne({ name: "Free" });
    if (exists) {
      console.log("Free package already exists");
      return process.exit();
    }

    await Package.create({
      name: "Free",
      price: 0,
      duration: 0,
      status: "active",
      features: [
        "Basic wallet tracking",
        "Limited categories",
        "Access dashboard"
      ],
    });

    console.log("Free package created successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
