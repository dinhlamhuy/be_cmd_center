const { createResponse } = require("../../variables/createResponse");

const ShippingSchedule_Model = require("./ShippingSchedule.models");
exports.Get_Shipping_Schedule = async (req, res) => {
    console.log('test')

  const list = await ShippingSchedule_Model.Get_Shipping_Main();
  const list2 = await ShippingSchedule_Model.Get_Shipping_Detail();
  const result={
    Get_Shipping_Main:list,
    Get_Shipping_Detail:list2
  }
//   console.table(list)
  if (result != null) {
    res.status(200).send(createResponse(0, "Thành công", result));
  } else {
    res.send(createResponse(1004, "Không tìm thấy dữ liệu yêu cầu!", []));
  }
};
