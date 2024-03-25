const express = require("express");
const dashboardRouter = express.Router("./dashboard.route");
const dashboardController = require("./dashboard.controllers");

dashboardRouter.post("/getlistscreen",dashboardController.getListScreen);
dashboardRouter.post("/getlistcomponent",dashboardController.getListDashBoard);
dashboardRouter.post("/insertcomponentscreen",dashboardController.insertComponentScreen);
dashboardRouter.post("/swapscreen",dashboardController.setSwapScreen);
dashboardRouter.post("/getdetailscreen",dashboardController.getDetailScreen);

module.exports = dashboardRouter;
