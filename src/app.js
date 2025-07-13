const express = require("express");
const authRouter = require("./routes/userAuth");
const userProfile = require("./routes/userProfile");
const connectDB = require("./config/database");
const expensesLoad = require("./routes/expencesLoad");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/", authRouter);
app.use("/", userProfile);
app.use("/", expensesLoad);

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
