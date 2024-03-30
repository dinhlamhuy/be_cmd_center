const { createResponse } = require("../../variables/createResponse");

const DataQuality_Model = require("./Data_Quality.models");
exports.Get_Data_Quality = async (req, res) => {

  const list = await DataQuality_Model.GetDataDataQuality();
  console.log('test')
  if (list != null) {
    res.status(200).send(createResponse(0, "Thành công", list));
  } else {
    res.send(createResponse(1004, "Không tìm thấy dữ liệu yêu cầu!", []));
  }
};



