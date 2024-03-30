const express = require("express");
const assemblyQuality_Router = express.Router();

const assemblyQuality = require("./AssemblyQuality.controllers");
assemblyQuality_Router.get("/data_assembly_quality", assemblyQuality.Get_Assembly_Quality);
module.exports = assemblyQuality_Router;
