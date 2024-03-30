const { createResponse } = require("../../variables/createResponse");

const DataProductType_Model = require("./Data_Product_Type.models");
exports.Get_Data_Product_Type = async (req, res) => {

  const list = await DataProductType_Model.GetDataDataProductType();
  console.log('test')
  if (list != null) {
    res.status(200).send(createResponse(0, "Thành công", list));
  } else {
    res.send(createResponse(1004, "Không tìm thấy dữ liệu yêu cầu!", []));
  }
};



