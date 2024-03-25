const express = require("express");
const sfqRouter = express.Router();

const sfqController = require("./sfq.controllers");

// sfqRouter.get("/get_andon_data", sfqController.andon_data);
sfqRouter.get("/data_pph_all", sfqController.Get_PPH_All);
//  sfqRouter.get("/data_pph", sfqController.get_pphs);

module.exports = sfqRouter;
