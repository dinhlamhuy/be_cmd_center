const db = require("../../connection");
const { config_erp, config_hris, config_mescc } = require("../../fileconfig");

exports.getServerTime = async () => {
  try {
    const rs = await db.Execute(
      config_erp,
      `SELECT  CONVERT(datetime,GETDATE()) time`
    );
    const date = rs.recordset[0].time;
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");
    const seconds = String(localDate.getSeconds()).padStart(2, "0");

    const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.000`;

    return dateString || null;
  } catch (error) {
    return null;
  }
};
const getServerTimeFrame7h30 = async () => {
  // try {
  //   const rs = await db.Execute(
  //     config_erp,
  //     `SELECT CONVERT(DATETIME, GETDATE()) time`
  //   );
  //   const date = rs.recordset[0].time;
  //   const localDate = new Date(date);

  //   // Lấy ngày, tháng, năm, giờ, phút, giây từ đối tượng Date
  //   const year = localDate.getFullYear();
  //   const month = String(localDate.getMonth() + 1).padStart(2, "0");
  //   const day = String(localDate.getDate()).padStart(2, "0");
  //   const dateString = `${year}-${month}-${day} 07:30:00.000`;
  //   // console.log("7h30", dateString);
  //   return dateString || null;
  // } catch (error) {
  //   return null;
  // }
  try {
    const rs = await db.Execute(
      config_erp,
      `SELECT CONVERT(DATETIME, CONVERT(DATE, GETDATE())) + '07:30:00.000' AS time`
    );
    const date = rs.recordset[0].time;
    return date || null;
  } catch (error) {
    return null;
  }
};

exports.Get_Type_Lean_Mapping_All = async () => {
  try {
    const rs = await db.Execute(
      config_mescc,
      `SELECT   Lean, Dep_ID, RFT FROM Type_Lean_Mapping WHERE Lean not in ('A_G15','A_G16','D3_G16','GCD_C11','GCD_C12','GCD_C13','GCD_C14','GCD_C15','GCD_C16','GCD_C17','GCD_C18','GCD_C19') AND Lean LIKE 'GCD%'  ORDER BY REPLACE(Lean,' ','')`
    );
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};

exports.Get_Type_Lean_Mapping = async (Lean) => {
  try {
    const rs = await db.Execute(
      config_mescc,
      `SELECT Lean, Dep_ID, RFT FROM Type_Lean_Mapping WHERE Lean = '${Lean.trim()}'`
    );
    return rs.recordset[0].Dep_ID || null;
  } catch (error) {
    return null;
  }
};

exports.Get_Andon_Data = async (DepID, erpTime) => {
  try {
    //    const erpTime= getServerTime()
    const rs = await db.Execute(
      config_erp,
      `SELECT A.DepId,ISNULL(SUM(A.Qty),0) AS Qty, SUM(A.NgQty) AS NgQty,SUM(A.ReQty) AS ReQty FROM Andon A
         WHERE CONVERT(DATE,A.QcDate) = CONVERT(DATE,'${erpTime}') AND DepId = '${DepID.trim()}' GROUP BY A.DepId`
    );
    // console.log(`SELECT A.DepId,ISNULL(SUM(A.Qty),0) AS Qty, SUM(A.NgQty) AS NgQty,SUM(A.ReQty) AS ReQty FROM Andon A
    // WHERE CONVERT(DATE,A.QcDate) = CONVERT(DATE,'${erpTime}') AND DepId = '${DepID.trim()}' GROUP BY A.DepId`);
    return rs.recordset[0] || null;
  } catch (error) {
    return null;
  }
};

exports.Get_Qty = async (DepID, erpTime) => {
  try {
    // const erpTime= getServerTime()
    const rs = await db.Execute(
      config_erp,
      `SELECT  BDepartment.DepId,
            ISNULL(SUM(scbbs.Qty),0) Qty 
         FROM scbbs LEFT JOIN scbb ON scbb.ProNo = scbbs.ProNo 
         LEFT JOIN BDepartment ON scbb.DepNo = BDepartment.ID 
         WHERE CONVERT(DATE,scbbs.USERDATE) = CONVERT(DATE,'${erpTime}') AND 
         BDepartment.DepId = '${DepID}'  GROUP BY BDepartment.DepId`
    );

    return rs.recordset[0].Qty || null;
  } catch (error) {
    return null;
  }
};

exports.Get_Star = async (Status, Line, erpTime) => {
  try {
    const rs = await db.Execute(
      config_mescc,
      `SELECT COUNT(Lean) LEAN_Count FROM Data_Tier_Meeting 
            WHERE Lean = '${Line.trim()}' AND Tier_Meeting_Status = '${Status}' AND CONVERT(DATE, Start_Date) = CONVERT(DATE,'${erpTime}')`
    );
//     console.log(`SELECT COUNT(Lean) LEAN_Count FROM Data_Tier_Meeting 
//     WHERE Lean = '${Line.trim()}' AND Tier_Meeting_Status = '${Status}' AND CONVERT(DATE, Start_Date) = CONVERT(DATE,'${erpTime}')`
// );
    return rs.recordset[0].LEAN_Count || 0;
  } catch (error) {
    return 0;
  }
};

exports.Get_PPH = async (Line, erpTime) => {
  try {
    let data_PPH = {};
    let result = {};
    data_PPH.Article = "";
    data_PPH.ShoeName = "";
    data_PPH.Line = Line.trim();
    if (Line.trim().length <= 0) {
      result = data_PPH;
    } else {
      const rs = await db.Execute(
        config_hris,
        `SELECT DD.Department_ID,COUNT(DP.Person_ID) AS Actual_Operator FROM Data_Department DD 
              LEFT JOIN Data_Person DP ON DP.Department_Serial_Key = DD.Department_Serial_Key 
                     WHERE DP.Magneticcard_ID IN (SELECT  Card_Number FROM Rec_Check_In_Out  WHERE CONVERT(DATE ,Check_Time) = CONVERT(DATE,'${erpTime}'))                             
              AND REPLACE( DD.Department_ID,' ','') =  REPLACE('${Line.trim()}','_C0','_C') GROUP BY DD.Department_ID `
      );
const Actual_Operator=rs.recordset[0];
      data_PPH.Operator = Actual_Operator && Actual_Operator.Actual_Operator ? Actual_Operator.Actual_Operator : 0;

      const num = await this.Get_TimeCount(erpTime);

      data_PPH.TimeCount = num;

      const depID = await this.Get_Type_Lean_Mapping(Line.trim());
      let andon_Data = await this.Get_Andon_Data(depID.trim(), erpTime);
      let Qty = await this.Get_Qty(depID.trim(), erpTime);
      //   const Qty = andon_Data && andon_Data.Qty ? andon_Data.Qty : 0;
      const NgQty = andon_Data && andon_Data.NgQty ? andon_Data.NgQty : 0;
      const ReQty = andon_Data && andon_Data.ReQty ? andon_Data.ReQty : 0;
      data_PPH.DepID = depID.trim();
      data_PPH.Actual_Output = Qty;

      if (data_PPH.TimeCount === 0 || data_PPH.Operator === 0) {
        data_PPH.PPH = 0.0;
      } else {
        data_PPH.PPH = parseFloat(
          (
            Math.round((Qty / data_PPH.Operator / data_PPH.TimeCount) * 100) /
            100
          ).toFixed(2)
        );
      }
      if (Qty === 0) {
        data_PPH.RFT = 0.0;
      } else {
        data_PPH.RFT = Math.round((Qty / (Qty + NgQty + ReQty)) * 100, 0);
      }
      data_PPH.Article = "";

      data_PPH.ShoeName = await this.Get_ShoeName_ERP(depID, erpTime);

      data_PPH.Count_Add = await this.Get_Star('Add', Line.trim(), erpTime);
      data_PPH.Count_Complete = await this.Get_Star('Complete', Line.trim(), erpTime);

      result = data_PPH;
    }
    return result || null;
  } catch (error) {
    console.log("GETPPH", error);
    return null;
  }
};

exports.Get_ShoeName_ERP = async (Line, erpTime) => {
  try {
    const value = await this.Get_RY(Line, erpTime);

    let result = "";
    const text = value;
    const rs = await db.Execute(
      config_erp,
      `SELECT xxzl.XieMing FROM DDZL LEFT JOIN xxzl ON DDZL.XieXing = xxzl.XieXing 
            AND DDZL.SheHao = xxzl.SheHao AND DDZL.ARTICLE = xxzl.ARTICLE
             WHERE DDBH = '${text}'`
    );
    const XieMing =
      rs && rs.recordset[0] && rs.recordset[0].XieMing
        ? rs.recordset[0].XieMing
        : 0;
    if (XieMing.length > 12) {
      const array = XieMing.split(" ");
      if (array[0].length > 12) {
        result = array[0].substring(0, 12);
      } else {
        result = array[0];
      }
    } else {
      result = XieMing;
    }

    return result || null;
  } catch (error) {
    console.log("Get_ShoeName_ERP", error);
    return null;
  }
};

exports.Get_RY = async (Line, erpTime) => {
  try {
    if (Line !== "") {
      const rs = await db.Execute(
        config_erp,
        `SELECT A.DepId, A.RY FROM Andon A WHERE CONVERT(DATE,A.QcDate) = CONVERT(DATE, '${erpTime}') AND A.DepId = '${Line.trim()}'`
      );
      return rs.recordset[0]?.RY || null;
    } else {
      return null;
    }
  } catch (error) {
    console.log("GetRy ", error);

    return null;
  }
};

exports.Get_TimeCount = async (Now) => {
  const time7h30 = await getServerTimeFrame7h30();
  const now = new Date(Now);
  const time = new Date(time7h30);
  console.log(now, time);
  // const timeDifferenceInMilliseconds = now - time;
  let num = Math.abs(now.getTime() - time.getTime()) / (1000 * 3600);
  // let num = timeDifferenceInMilliseconds / (1000 * 60 * 60);
  // console.log(num);

  const flag = now.getHours() > 11;
  if (flag) {
    num--;
  }
  const result = Math.ceil(num);
  console.log(parseInt(result));
  return parseInt(result);
};

exports.Type_AutoCutting = () => {
  // console.log('Type_AutoCutting');
  return "LHG";
};

//#region MES_Tier_Meeting
exports.Get_Data_Tier_Meeting = async (TierMeeting_Serial) => {
  try {
    const rs = await db.Execute(
      config_mescc,
      `SELECT TierMeeting_Serial ,Lean ,RFT_Default ,RFT_Now ,Tier_Meeting_Status ,Top_3_Defect_Code ,Type_Content ,Start_Date ,Modify_Date ,User_ID   FROM Data_Tier_Meeting   WHERE TierMeeting_Serial ='${TierMeeting_Serial}'`
    );
    console.log(rs.recordset[0]);
    return rs.recordset[0] || null;
  } catch (error) {
    console.log("Get_Data_Tier_Meeting", error);

    return null;
  }
};
exports.Get_Data_Tier_Meeting_Lean = async (Lean, ModifyDate) => {
  try {
    const rs = await db.Execute(
      config_mescc,
      `SELECT TOP 1 TierMeeting_Serial, Lean, RFT_Default, RFT_Now, Tier_Meeting_Status, 
           Top_3_Defect_Code, Type_Content, Start_Date, Modify_Date, User_ID FROM Data_Tier_Meeting WHERE Lean = '${Lean}' AND Modify_Date > '${ModifyDate}'  ORDER BY Modify_Date DESC`
    );
    // console.log(rs.recordset[0]);
    return rs.recordset[0] || null;
  } catch (error) {
    console.log("Get_Data_Tier_Meeting_Lean", error);

    return null;
  }
};

exports.Get_Top_3_Defect = async (Top_3_Defect_Code) => {
  try {
    let text = "";
    const rs = await db.Execute(
      config_mescc,
      `SELECT NameEng FROM QcDefectDetail WHERE QcDefectId IN ('${Top_3_Defect_Code}') AND SN = 1`
    );
    text += rs.recordset[0];
    return text || null;
  } catch (error) {
    return 0;
  }
};
//#endregion
