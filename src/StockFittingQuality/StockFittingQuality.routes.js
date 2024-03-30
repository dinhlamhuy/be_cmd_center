const express = require("express");
const sfq_Router = express.Router();

const sfqController = require("./StockFittingQuality.controllers");
sfq_Router.get("/data_pph_all", sfqController.Get_PPH_All);


module.exports = sfq_Router;
