const jwt = require("jsonwebtoken");
const User = require("../model/user");
const { allowedToSenwdSafeSignUpDate } = require("../constants/constants");

const userMiddleWare = async (req, res, next) => {
  try {
    const { jwtToken } = req.cookies;
    console.log(jwtToken, "isItHere");
    const validateJwtToken = jwt.verify(
      jwtToken,
      "roomSplitApplication@20051998"
    );
    console.log(validateJwtToken);
    if (!validateJwtToken) {
      throw new Error("Invalid Token");
    }
    const userid = validateJwtToken._id;
    const userExist = await User.findOne({ _id: userid }).select(
      allowedToSenwdSafeSignUpDate
    );
    if (!userExist) {
      throw new Error("User doesn't Exit");
    }
    req.user = userExist;
    next();
  } catch (error) {
    res.status(401).send("ERROR:" + error.message);
  }
};

module.exports = userMiddleWare;
