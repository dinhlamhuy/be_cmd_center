const db = require("../../connection");
const {  config_mescc115 } = require("../../fileconfig");
exports.GetDataDataQuality = async () => {
  try {
    const rs = await db.Execute(config_mescc115,
      `SELECT i_Months
      ,D_Months
      ,RFT
      ,Repacking_rate
      ,B_grade
      ,C_grade
      ,WHC
      ,DR
  FROM Data_Quality  WHERE i_Year = YEAR(GETDATE())`
    );
		
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};


