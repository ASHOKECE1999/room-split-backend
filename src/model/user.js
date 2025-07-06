const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minLength: 4,
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      toLowerCase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please Enter Valid Email");
        }
      },
    },
    profileUrl: {
      type: String,
      default:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?cs=srgb&dl=pexels-pixabay-415829.jpg&fm=jpg",
    },
    about: {
      type: String,
      default: "Hey I am a developer",
    },
  },
  { timestamps: true }
);

userSchema.methods.validateHashedPassword = async function (password) {
  const user = this;
  const userPassword = password;
  const hashedPassword = user.password;
  const isTrue = await bcrypt.compare(userPassword, hashedPassword);
  return isTrue;
};

userSchema.methods.getJwtToken = async function () {
  const user = this;
  const token = await jwt.sign(
    {
      _id: user._id,
    },
    "roomSplitApplication@20051998",
    { expiresIn: "7d" }
  );
  return token;
};

module.exports = mongoose.model("User", userSchema);
