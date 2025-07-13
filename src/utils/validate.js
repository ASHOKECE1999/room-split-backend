const validator = require("validator");

const signupdata = (req) => {
  const { fullName, emailId, password } = req.body;
  console.log(fullName.length);
  if (!validator.isEmail(emailId)) {
    throw new Error("Please Enter Valid Email");
  }
  if (!fullName || fullName.length < 4) {
    throw new Error("Please Enter UserName with min 4 Chars");
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
    })
  ) {
    throw new Error(
      "Please Choose Strong Password with" +
        `minLength: 8,minLowercase: 1,minUppercase: 1,`
    );
  }
};

const validateloginData = (req) => {
  const allowedDataList = ["emailId", "password"];
  const isAllowed = Object.keys(req.body).every((key) =>
    allowedDataList.includes(key)
  );
  if (!isAllowed) {
    throw new Error("Invalid Edit Request ");
  }
  return isAllowed;
};

const validateUpdateProfileData = (req) => {
  const allowedDataList = ["about", "password", "profileUrl", "fullName"];
  const isAllowed = Object.keys(req.body).every((key) =>
    allowedDataList.includes(key)
  );
  if (!isAllowed) {
    throw new Error("Invalid Edit Request ");
  }
  return isAllowed;
};

const validateAddbillData = (req) => {
  const allowedDataList = ["expanseType", "expenseAmount"];
  const isAllowed = Object.keys(req.body).every((key) =>
    allowedDataList.includes(key)
  );
  if (!isAllowed) {
    throw new Error("Invalid Edit Request ");
  }
  return isAllowed;
};

module.exports = {
  validateloginData,
  signupdata,
  validateUpdateProfileData,
  validateAddbillData,
};
