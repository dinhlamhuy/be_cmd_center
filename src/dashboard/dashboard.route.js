const express = require("express");
const dashboardRouter = express.Router("./dashboard.route");
const dashboardController = require("./dashboard.controller");

dashboardRouter.post("/getlistscreen",dashboardController.getListScreen);

module.exports = dashboardRouter;
