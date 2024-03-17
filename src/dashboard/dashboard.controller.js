

const { createResponse } = require("../../variables/createResponse");

exports.getListScreen = async (req, res) => {
  var io = req.app.get("socketio");

  const data = [
    { id_screen: '1', label: 'DDM', descriptionL: '' },
    { id_screen: '2', label: 'STOPLINE', descriptionL: '' },
    { id_screen: '3', label: 'WAREHOUSE', descriptionL: '' },
    { id_screen: '4', label: 'EIP', descriptionL: '' },
    { id_screen: '5', label: 'ADON', descriptionL: '' },
    { id_screen: '6', label: 'iPARKING', descriptionL: '' },
    { id_screen: '7', label: 'SENT KEYS', descriptionL: '' },
    { id_screen: '8', label: 'SHOES', descriptionL: '' },
    { id_screen: '9', label: 'DMS', descriptionL: '' },
    { id_screen: '10', label: 'AUTO MAIL', descriptionL: '' },
    { id_screen: '11', label: 'HR DEC', descriptionL: '' },
    { id_screen: '12', label: 'TRACKING', descriptionL: '' },
    { id_screen: '13', label: 'FLOOR', descriptionL: '' },
    { id_screen: '14', label: 'TRUE LOVE', descriptionL: '' },
    { id_screen: '15', label: 'FREE', descriptionL: '' },
    { id_screen: '16', label: '', descriptionL: '' }
  ]
  let dl;
  if (req.body.list[0] && req.body.list !== null && req.body.list !== '') {
    dl = req.body.list;
  } else {
    dl = data;
  }
  io.emit('54314', Math.random());

  res.status(200).send(
    createResponse(0, "Thành công", {
      data: dl
    })
  );
};

