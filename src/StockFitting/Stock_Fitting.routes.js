const express = require("express");
const StockFitting_Router = express.Router();

const StockFitting_Controller = require("./Stock_Fitting.controllers");
StockFitting_Router.get("/get_data_stock_fitting", StockFitting_Controller.Get_Data_Stock_Fitting);
module.exports = StockFitting_Router;
