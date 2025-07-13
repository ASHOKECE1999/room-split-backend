const { mongo, default: mongoose } = require("mongoose");

const dashboardSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  totalBoll: {
    type: Number,
    require: true,
    default: 0,
  },
  userName: {
    type: String,
  },
});
module.exports = mongoose.model("Dashboard", dashboardSchema);
