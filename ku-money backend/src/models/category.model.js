import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    createdBy: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      email: {
        type: String,
        required: true
      }
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    icon: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["incomes", "expenses"],
      required: true
    }
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
