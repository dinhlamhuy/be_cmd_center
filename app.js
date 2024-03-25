const express = require("express");
const createError = require("http-errors");
require("express-async-errors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const dashboardRouter = require("./src/dashboard/dashboard.routes");
const sanLuongRouter = require("./src/BaoCaoSanLuong/sanluong.routes");
const sfqRouter = require("./src/StockFittingQuality/sfq.routes");

dotenv.config();

const app = express();
// app.use(express.static(path.join(__dirname, "build")));
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
app.use("/api/sfq", sfqRouter);

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build/index.html"), function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});


app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res) => {
    console.log(err.stack);
    res.status(err.status || 500).send(err.message);
});
