const express = require("express");
const DataKPITotal_Router = express.Router();

const dataKPITotal_Controller = require("./Data_KPI_Total.controllers");
DataKPITotal_Router.get("/get_data_kpi", dataKPITotal_Controller.Get_Data_KPI);

module.exports = DataKPITotal_Router;
