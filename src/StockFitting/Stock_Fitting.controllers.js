const { createResponse } = require("../../variables/createResponse");

const StockFitting_Model = require("./Stock_Fitting.models");
exports.Get_Data_Stock_Fitting = async (req, res) => {

  const list = await StockFitting_Model.GetDataStockFitting();
  console.log('test')
  if (list != null) {
    res.status(200).send(createResponse(0, "Thành công", list));
  } else {
    res.send(createResponse(1004, "Không tìm thấy dữ liệu yêu cầu!", []));
  }
};



