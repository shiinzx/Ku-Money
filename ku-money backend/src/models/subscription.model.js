import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  expiredAt: {
    type: Date,
    required: true
  },
  createdBy: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  limitCategory: {
    type: Number,
    required: true
  },
  limitIncomes: {
    type: Number,
    required: true
  },
  limitExpenses: {
    type: Number,
    required: true
  },
  limitAccount: {
    type: Number,
    required: true
  },
  lastExpiringEmailSent: {
    type: Date,
    default: null
  },
  lastExpiredEmailSent: {
    type: Date,
    default: null
  },
  expiredEmailCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true }); // otomatis buat createdAt & updatedAt

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
