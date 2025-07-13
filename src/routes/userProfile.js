const express = require("express");
const userMiddleWare = require("../middlewares/userMiddleWare");
const User = require("../model/user");
const userProfile = express.Router();
const { allowedToSenwdSafeSignUpDate } = require("../constants/constants");
const { validateUpdateProfileData } = require("../utils/validate");
const bcrypt = require("bcrypt");

userProfile.get("/profile/view", userMiddleWare, (req, res) => {
  try {
    console.log(req.user);
    res.send(req.user);
  } catch (error) {
    res.status(401).send("Invalid Request" + error.message);
  }
});

userProfile.patch("/profile/edit", userMiddleWare, async (req, res) => {
  //1 . verify the data received
  try {
    const allowedData = validateUpdateProfileData(req);
    if (!allowedData) {
      throw new Error("Enter Data canot Be Updated");
    }
    const { fullName, about, profileUrl } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { fullName, about, profileUrl },
      {
        new: true, // return the updated document
        runValidators: true,
      }
    ).select(allowedToSenwdSafeSignUpDate);
    if (!updatedUser) return res.status(404).send("User not found");
    res.json(updatedUser);
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
  //2. once data verifed then update the data for that user

  //3. send the saved data back to user
});

userProfile.patch(
  "/profile/updatepassword",
  userMiddleWare,
  async (req, res) => {
    const { password } = req.body;
    // 1. verified user using usermiddlware
    // 2 .get the new passowrd from body and encrypt it and save into DB
    const hashedPassword = await bcrypt.hash(password, 4);
    const user = req.user;
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { password: hashedPassword } }, // Fields to update
      { new: true }
    ).select("firstName About profileUrl");
    console.log(hashedPassword);
    res.json({
      data: updatedUser,
      message: "Password SuccessFully Changed",
    });
    // 3 . send new success Message
    try {
    } catch (error) {
      res.status(400).send("Error on Updating Password" + error.message);
    }
  }
);

module.exports = userProfile;
