const express = require("express");
const authRouter = require("./routes/userAuth");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);

connectDB()
  .then(() => {
    console.log("DB Connection Happened Successfully ");
    app.listen(3000, () => {
      console.log("app start running at 3000");
    });
  })
  .catch(() => {
    console.log("HOO GOD SOMETHING HAPPENED PLEASE TRY AGAIN LATER");
  });
