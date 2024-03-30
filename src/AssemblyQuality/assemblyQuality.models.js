const db = require("../../connection");
const { config_erp, config_hris, config_mescc } = require("../../fileconfig");

exports.Get_Type_Lean_Mapping_All = async () => {
    try {
      const rs = await db.Execute(
        config_mescc,
        `SELECT   Lean, Dep_ID, RFT FROM Type_Lean_Mapping WHERE Lean not in ('A_G15','A_G16','D3_G16') AND Lean LIKE 'GCD%'  ORDER BY REPLACE(Lean,' ','')`
      );
      console.log(`SELECT   Lean, Dep_ID, RFT FROM Type_Lean_Mapping WHERE Lean not in ('A_G15','A_G16','D3_G16') AND Lean LIKE 'GCD%'  ORDER BY REPLACE(Lean,' ','')`
      )
      return rs.recordset || null;
    } catch (error) {
      return null;
    }
  };