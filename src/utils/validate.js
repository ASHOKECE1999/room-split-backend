const validator = require("validator");

const signupdata = (req) => {
  const { fullName, emailId, password, profileUrl } = req.body;
  console.log(fullName.length);
  if (!validator.isEmail(emailId)) {
    throw new Error("Please Enter Valid Email");
  }
  if (!fullName || fullName.length < 4) {
    throw new Error("Please Enter UserName with min 4 Chars");
  }

  if (!validator.isURL(profileUrl)) {
    throw new Error("Please Enter Valid URL Dude");
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
    })
  ) {
    throw new Error("Please Choose Strong Password");
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

module.exports = {
  validateloginData,
  signupdata,
};
