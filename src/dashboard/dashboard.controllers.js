const { createResponse } = require("../../variables/createResponse");
const dashboardModel = require("./dashboard.models");

exports.getListDashBoard = async (req, res) => {
  // var io = req.app.get("socketio");
  const id_screen = req.body.id_screen;
  const list = await dashboardModel.getCompontDashboard(id_screen);

  // io.emit('54314', Math.random());

  res.status(200).send(
    createResponse(0, "Thành công", {
      data: list,
    })
  );
};

exports.getDetailScreen = async (req, res) => {
  // var io = req.app.get("socketio");
  const id_screen = req.body.id_screen;
  const list = await dashboardModel.detailScreen(id_screen);

  // io.emit('54314', Math.random());

  res.status(200).send(
    createResponse(0, "Thành công", {
      data: list,
    })
  );
};

exports.getListScreen = async (req, res) => {
  //  var io = req.app.get("socketio");
  const list = await dashboardModel.getScreensDashboard();
  
  // io.emit('54314', Math.random());
  res.status(200).send(
    createResponse(0, "Thành công", {
      data: list,
    })
  );
};

exports.insertComponentScreen = async (req, res) => {
   var io = req.app.get("socketio");
  const DB_id = req.body.DB_id;
  const Screen_id = req.body.id_screen;

  const list = await dashboardModel.insertDashBoardtoScreen(DB_id, Screen_id);

  io.emit("54314", Math.random());

  res.status(200).send(
    createResponse(0, "Thành công", {
      data: list,
    })
  );
};
exports.setSwapScreen = async (req, res) => {
  var io = req.app.get("socketio");
  const Screen_id1 = req.body.id_screen1;
  const Screen_id2 = req.body.id_screen2;

  const list = await dashboardModel.swapScreen(Screen_id1, Screen_id2);

  io.emit("54314", Math.random());

  res.status(200).send(
    createResponse(0, "Thành công", {
      data: list,
    })
  );
};
