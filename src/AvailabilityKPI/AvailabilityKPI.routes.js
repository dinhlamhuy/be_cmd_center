const express = require("express");
const AvailabilityKPI_Router = express.Router();

const AvailabilityKPI_Controller = require("./AvailabilityKPI.controllers");
AvailabilityKPI_Router.get("/get_data_availabitykpi", AvailabilityKPI_Controller.Get_Availability_KPI);
module.exports = AvailabilityKPI_Router;
