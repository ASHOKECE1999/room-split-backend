const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const { validateLoginData, signupdata } = require("../utils/validate");
const { sign } = require("jsonwebtoken");
const authRouter = express.Router();
const { allowedToSenwdSafeSignUpDate } = require("../constants/constants");

authRouter.post("/signup", async (req, res) => {
  const { fullName, emailId, password, profileUrl, about } = req.body;
  try {
    //1. validate the data entered by User
    signupdata(req);
    const hashedPassword = await bcrypt.hash(password, 4);
    // 2 .save the date into an object and add it to mongoDb with Model
    const userInfo = {
      fullName,
      emailId,
      password: hashedPassword,
      profileUrl,
      about,
    };
    const user = new User(userInfo);

    // 3 . save the user after adding it to User
    const signedUser = await user.save();

    // 4. extract the data to send with safe mechanisms
    const sendData = await User.find({ _id: signedUser._id }).select(
      allowedToSenwdSafeSignUpDate
    );

    //4 added schema methods to get getToken Here

    const jwtToken = await signedUser.getJwtToken();
    res.cookie("jwtToken", jwtToken);
    console.log(signedUser);
    res.json({
      message: "user successfully SignedIn",
      data: sendData,
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    //1.validate the data is safe or not
    const { emailId, password } = req.body;
    console.log("itsCamehere");
    console.log(password);
    console.log("came heere for 2");

    //2 . verify the recevied mail is or user is exits in DB or not
    const userExits = await User.findOne({
      emailId: emailId,
    });

    console.log(userExits);
    if (!userExits) {
      throw new Error("Please Login With Valid Credentilas");
    }
    // 3 . verify db password is same or not the received
    const validUser = await userExits.validateHashedPassword(password);
    if (validUser) {
      const jwtToken = await userExits.getJwtToken();
      const token = res.cookie("jwtToken", jwtToken);
      res.json({
        message: userExits.fullName + "you have SuccessFully logged In",
      });
    } else {
      throw new Error("Invalid Passowrd");
    }
    //4 all checked are passed then send cookies with message
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = authRouter;
