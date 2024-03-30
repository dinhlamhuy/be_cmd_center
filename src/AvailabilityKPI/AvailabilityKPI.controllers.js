const { createResponse } = require("../../variables/createResponse");

const AvailabilityKPI_Model = require("./AvailabilityKPI.models");
exports.Get_Availability_KPI = async (req, res) => {

  const list = await AvailabilityKPI_Model.GetDataAvailabilityKPI('2024');
const list_115 = await AvailabilityKPI_Model.GetDataAvailabilityKPI_115('2024');
const combinedList = list.map((item, index) => {
  return {
      ...item,// Giữ nguyên cột Name từ list
      Efficiency_Target: list_115[index].Efficiency_Target, // Lấy cột 0 từ list_115
      Efficiency_Actual: list_115[index].Efficiency_Actual // Lấy cột 1 từ list_115
  };
});

  if (list != null) {
    res.status(200).send(createResponse(0, "Thành công", combinedList));
  } else {
    res.send(createResponse(1004, "Không tìm thấy dữ liệu yêu cầu!", []));
  }
};
