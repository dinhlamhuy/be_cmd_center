const { createResponse } = require("../../variables/createResponse");

const HRLHG_Model = require("./HRLHG.models");
exports.Get_Data_HR = async (req, res) => {

  const Manpower_Total = await HRLHG_Model.Get_Manpower_Total();
  const Manpower_Last_Month = await HRLHG_Model.Get_Manpower_Last_Month();
  const Get_Manpower_Over_Time = await HRLHG_Model.Get_Manpower_Over_Time();
  const BuildA = await HRLHG_Model.Get_Manpower_Build_Lean('A');
  const BuildB = await HRLHG_Model.Get_Manpower_Build_Lean('B');
  const BuildC = await HRLHG_Model.Get_Manpower_Build_Lean('C');
  const BuildD = await HRLHG_Model.Get_Manpower_Build_Lean('D');
  const BuildR1 = await HRLHG_Model.Get_Manpower_Build_Lean('R1');
  const BuildR2 = await HRLHG_Model.Get_Manpower_Build_Lean('R2');
  
  const result={
    ManpowerTotal: Manpower_Total,
    LastMonth: Manpower_Last_Month,
    OverTime:Get_Manpower_Over_Time,
    ManBuildingA:BuildA,
    ManBuildingB:BuildB,
    ManBuildingC:BuildC,
    ManBuildingD:BuildD,
    ManBuildingR1:BuildR1,
    ManBuildingR2:BuildR2,

  }
  if (result != null) {
    res.status(200).send(createResponse(0, "Thành công", result));
  } else {
    res.send(createResponse(1004, "Không tìm thấy dữ liệu yêu cầu!", []));
  }
};

exports.Get_Data_HR_Building = async (req, res) => {

   
    const idBuild = req.query.build;
   const Building_detail = await HRLHG_Model.Get_Manpower_Build_Lean_Detail(idBuild);
    // const result={
    //   Manpower_Total: Manpower_Total,
    //   Manpower_Last_Month: Manpower_Last_Month,
    //   BuildA:BuildA,
    //   BuildA_detail:BuildA_detail,
    //   BuildB:BuildB,
    //   BuildC:BuildC,
    //   BuildD:BuildD,
    //   BuildR1:BuildR1,
    //   BuildR2:BuildR2,
  
    // }
    if (Building_detail != null) {
      res.status(200).send(createResponse(0, "Thành công", Building_detail));
    } else {
      res.send(createResponse(1004, "Không tìm thấy dữ liệu yêu cầu!", []));
    }
  };
  




