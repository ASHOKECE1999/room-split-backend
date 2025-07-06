const mongoose = require("mongoose");

const connectionUrl =
  "mongodb+srv://ashokkumarece2020:pe5bpSqaVvH8J2B4@nodejsproject.2xjwwhd.mongodb.net/roomsplit";
const connnectDB = async () => {
  await mongoose.connect(connectionUrl, { autoIndex: true });
};

module.exports = connnectDB;
