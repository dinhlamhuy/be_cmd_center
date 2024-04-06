const express = require("express");
const createError = require("http-errors");
require("express-async-errors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const dashboardRouter = require("./src/dashboard/dashboard.routes");
const sanLuongRouter = require("./src/HourlyOutPutByFloor/HourlyOutPutByFloor.routes");
const sfq_Router = require("./src/StockFittingQuality/StockFittingQuality.routes");
const assemblyQuality_Router = require("./src/AssemblyQuality/assemblyQuality.routes");
const DataKPITotal_Router = require("./src/Data_KPI_Total/Data_KPI_Total.routes");
const TrialScheduleSeason_Router = require("./src/Trial_Schedule_Season/Trial_Schedule_Season.routes");
const AvailabilityKPI_Router = require("./src/AvailabilityKPI/AvailabilityKPI.routes");
const StockFitting_Router = require("./src/StockFitting/Stock_Fitting.routes");
const DataProductType_Router = require("./src/Data_Product_Type/Data_Product_Type.routes");
const DataQuality_Router = require("./src/Data_Quality/Data_Quality.routes");
const HRLHG_Router = require("./src/HR_LHG/HRLHG.routes");
const ShippingSchedule_Router = require("./src/ShippingSchedule/ShippingSchedule.routes");

dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, "build")));
app.use(morgan("dev"));
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

app.use(bodyParser.json());
app.use(cors());
const server = app.listen(process.env.PORT, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

io.sockets.on("connection", function (socket) {
    console.log("client connect", socket.id);


    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});
app.set("etag", "strong");
app.set("socketio", io);

app.use("/api/dashboard", dashboardRouter);
app.use("/api/bcsl", sanLuongRouter);
app.use("/api/sfq", sfq_Router);
app.use("/api/aq", assemblyQuality_Router);
app.use("/api/datakpi", DataKPITotal_Router);
app.use("/api/tss", TrialScheduleSeason_Router);
app.use("/api/akpi", AvailabilityKPI_Router);
app.use("/api/sf", StockFitting_Router);
app.use("/api/dpt", DataProductType_Router);
app.use("/api/quanlity", DataQuality_Router);
app.use("/api/hr", HRLHG_Router);
app.use("/api/shipping", ShippingSchedule_Router);

 app.get("/*", (req, res) => {
     res.sendFile(path.join(__dirname, "build/index.html"), function (err) {
         if (err) {
             res.status(500).send(err);
         }     });
 });


app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res) => {
    console.log(err.stack);
    res.status(err.status || 500).send(err.message);
});
