const { createResponse } = require("../../variables/createResponse");

const TrialScheduleSeason_Model = require("./Trial_Schedule_Season.models");
exports.Get_Data_Trial_Schedule_Season = async (req, res) => {

  const list = await TrialScheduleSeason_Model.GetDataTrialScheduleSeason();
  console.log('test')
  if (list != null) {
    res.status(200).send(createResponse(0, "Thành công", list));
  } else {
    res.send(createResponse(1004, "Không tìm thấy dữ liệu yêu cầu!", []));
  }
};



