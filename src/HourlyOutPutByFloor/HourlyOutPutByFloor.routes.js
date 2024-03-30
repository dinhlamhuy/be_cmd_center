const express = require("express");
const sanLuongRouter = express.Router();

const sanLuongLine = require("./HourlyOutPutByFloor.controllers");
sanLuongRouter.get("/sanluongline",sanLuongLine.getSanLuongLine);
module.exports = sanLuongRouter;