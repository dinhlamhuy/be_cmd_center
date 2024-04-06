const express = require("express");
const ShippingSchedule_Router = express.Router();

const ShippingSchedule_Controller = require("./ShippingSchedule.controllers");
ShippingSchedule_Router.get("/getshippingschedule", ShippingSchedule_Controller.Get_Shipping_Schedule);
module.exports = ShippingSchedule_Router;
