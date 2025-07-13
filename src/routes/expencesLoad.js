const express = require("express");
const userMiddleWare = require("../middlewares/userMiddleWare");
const expanses = require("../model/expanses");
const { validateAddbillData } = require("../utils/validate");
const User = require("../model/user");

const expensesLoad = express.Router();

expensesLoad.post("/addexpense", userMiddleWare, (req, res) => {
  try {
    console.log("it got hit here");
    const user = req.user;
    const userId = user._id;
    validateAddbillData(req);
    const { expanseType, expenseAmount } = req.body;
    const newObject = {
      expanseType,
      expenseAmount,
      userId,
    };

    const addedObject = new expanses(newObject);
    addedObject.save();
    res.send("added success");
    // 1.validate the info came from user first
    // 2. create aa instance and add it to mongo
    // 3 . then send response to user successfully added
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
});
expensesLoad.get("/getallexpenses", userMiddleWare, async (req, res) => {
  try {
    const user = req.user;
    const allExpansesArray = await expanses.find({
      userId: user._id,
    });

    res.send(allExpansesArray);
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
});

expensesLoad.get("/monthwise", userMiddleWare, async (req, res) => {
  try {
    const user = req.user;
    // 1. get the month and year from the req.query
    const { month, year } = req.query;
    const users = await User.find({}).select("fullName profileUrl");
    console.log(users);
    const inputMonth = `${year}-${String(month).padStart(2, "0")}`; // from user input
    console.log(inputMonth, "inputMonth");
    const start = new Date(`${inputMonth}-01T00:00:00.000Z`);
    const end = new Date(Date.UTC(parseInt(year), parseInt(month), 1)); // next month
    console.log(start, "+", end);

    const getMonthExpenses = await expanses.aggregate([
      {
        $match: {
          addedDate: {
            $gte: start,
            $lt: end,
          },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalAmount: { $sum: "$expenseAmount" },
          expenses: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          totalAmount: 1,
          // expenses: 1,
        },
      },
    ]);
    console.log(getMonthExpenses, "getMonthExpenses");

    const userDataSend = getMonthExpenses.map((eachItem) => {
      const filterUser = users.filter(
        (user) => user._id.toString() === eachItem.userId.toString()
      );

      return {
        userData: filterUser,
        expenses: eachItem.totalAmount,
      };
    });

    const newReturnData = users.map((eachItem) => {
      const filterExpanse = getMonthExpenses.filter(
        (expanse) => expanse.userId.toString() === eachItem._id.toString()
      );
      console.log(filterExpanse, "filterExpanse");
      if (filterExpanse) {
        return {
          userData: [eachItem],
          expenses: filterExpanse[0]?.totalAmount,
        };
      }
      return { userData: eachItem, expenses: filterExpanse.length };
    });

    console.log(newReturnData);

    // 2. lets get all the users expanes bases on year and month and send to UI

    console.log(req.query);
    res.json({
      message: "successFully Added Date",
      data: newReturnData,
    });
  } catch (error) {
    res.status(401).send("Error While Feching thr Date" + error.message);
  }
});

module.exports = expensesLoad;
