const { default: mongoose, Schema } = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 👈 optional, but useful for populate()
      required: true,
      unique: false,
    },
    expanseType: {
      type: String,
      required: true, // 👈 better to make this required
      trim: true,
    },
    expenseAmount: {
      // 👈 spelling fixed (was `expenseAmout`)
      type: Number,
      required: true,
    },
    addedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expenses", expenseSchema);
