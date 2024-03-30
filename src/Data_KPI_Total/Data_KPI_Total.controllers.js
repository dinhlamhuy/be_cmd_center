const { createResponse } = require("../../variables/createResponse");

const dataKPITotal_Model = require("./Data_KPI_Total.models");
exports.Get_Data_KPI = async (req, res) => {

  const list = await dataKPITotal_Model.GetDataKPI();
  if (list != null) {
    res.status(200).send(createResponse(0, "Thành công", list));
  } else {
    res.send(createResponse(1004, "Không tìm thấy dữ liệu yêu cầu!", []));
  }
};


const Get_Count_Data_KPI_Detail= async () => {

    const list = await dataKPITotal_Model.GetDataKPI();
    if (list != null) {
      res.status(200).send(createResponse(0, "Thành công", list));
    } else {
      res.send(createResponse(1004, "Không tìm thấy dữ liệu yêu cầu!", []));
    }
  };
