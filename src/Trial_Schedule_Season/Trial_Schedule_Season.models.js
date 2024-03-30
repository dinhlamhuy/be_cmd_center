const db = require("../../connection");
const { config_eip } = require("../../fileconfig");
exports.GetDataTrialScheduleSeason = async () => {
  try {
    const rs = await db.Execute(config_eip,
      `SELECT ROW_NUMBER() OVER (ORDER BY REPLACE(REPLACE(PRO_START_DATE,'NOT',''),'ORDER','' ) DESC) AS Num
      , id
      , season_start
      , year_start
      , season_end
      , year_end
      , article Art
      , model Model
      , CONVERT(varchar, cwa,111) CWA
      , pro_month Pro_Month
      , mcs
      , line LINE
      , PRO_START_DATE --ROUND( pro_start_date,2) PRO_START_DATE                        
      , stage STAGE
      , processing_material Material_GC
      , cutting
      , mct
      , stitching_v
      , assembly_v
      , meeting
      , on_show
      , userid
      , userDate
      FROM  Tech_trial_schedule WHERE on_show = '1' and CWA != '1900/01/01' 
      AND year_end = YEAR(GETDATE())
      ORDER BY REPLACE(REPLACE(PRO_START_DATE,'NOT',''),'ORDER','' ) DESC`
    );
		
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};
const Get_Count_Data_Trial_Schedule_Season = async () => {
  try {
    const rs = await db.Execute(config_eip,
      ` SELECT Count(id) Num FROM  Tech_trial_schedule WHERE on_show = '1' and CWA != '1900/01/01'  AND year_end = YEAR(GETDATE()) `
    );
		
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};


