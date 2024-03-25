const { createResponse } = require("../../variables/createResponse");

const sanLuongModel = require("./sanluong.models");
exports.getSanLuongLine = async (req, res) => {

  const list = await sanLuongModel.getSanLuong();
  if (list != null) {
    res.status(200).send(createResponse(0, "Thành công", list));
  } else {
    res.send(createResponse(1004, "Không tìm thấy dữ liệu yêu cầu!", []));
  }
};
