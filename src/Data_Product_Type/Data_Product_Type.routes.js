const express = require("express");
const DataProductType_Router = express.Router();

const DataProductType_Controller = require("./Data_Product_Type.controllers");
DataProductType_Router.get("/get_data_product_type", DataProductType_Controller.Get_Data_Product_Type);
module.exports = DataProductType_Router;
