import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    createdBy: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    description: {
      type: String,
      default: "",
      trim: true
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);

export default Account;
