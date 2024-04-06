const express = require("express");
const HRLHG_Router = express.Router();

const HRLHG_Controller = require("./HRLHG.controllers");
HRLHG_Router.get("/get_hr", HRLHG_Controller.Get_Data_HR);
HRLHG_Router.get("/get_hr_detail", HRLHG_Controller.Get_Data_HR_Building);
module.exports = HRLHG_Router;
