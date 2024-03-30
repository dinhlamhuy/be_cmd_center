const db = require("../../connection");
const {  config_mescc } = require("../../fileconfig");
exports.GetDataDataProductType = async () => {
  try {
    const rs = await db.Execute(config_mescc,
      `SELECT  ROW_NUMBER() OVER(ORDER BY Model_Name ASC) AS Num
      ,CONVERT(varchar, Date_Report ,103) Date_Report
      ,Model_Name
      ,Tool
      , Qty_Sole
      , Qty_KDL
      , Qty_GCD
      , Qty_GO                                   
FROM Data_Product_Type WHERE Date_Report = (SELECT MAX(Date_Report) From Data_Product_Type)`
    );
		
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};


