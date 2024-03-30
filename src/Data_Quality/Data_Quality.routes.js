const express = require("express");
const DataQuality_Router = express.Router();

const DataQuality_Controller = require("./Data_Quality.controllers");
DataQuality_Router.get("/get_data_quality", DataQuality_Controller.Get_Data_Quality);
module.exports = DataQuality_Router;
