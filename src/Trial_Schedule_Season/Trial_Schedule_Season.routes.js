const express = require("express");
const TrialScheduleSeason_Router = express.Router();

const TrialScheduleSeason_Controller = require("./Trial_Schedule_Season.controllers");
TrialScheduleSeason_Router.get("/get_data_trial_schedule_season", TrialScheduleSeason_Controller.Get_Data_Trial_Schedule_Season);
module.exports = TrialScheduleSeason_Router;
