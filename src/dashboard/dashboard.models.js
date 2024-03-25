const db = require("../../connection");
const { configscreen } = require("../../fileconfig");


exports.getCompontDashboard = async (id_screen) => {
  try {
    const rs = await db.Execute(configscreen,`
    SELECT  DB.DB_id, DB_url, DB_name, Screen_id, Screen_position
    FROM [CMDCENTER].[dbo].[DashBoard] DB LEFT JOIN Screens SC ON DB.[DB_id] = SC.[DB_id] where (Screen_id IS NULL OR Screen_position='${id_screen}')  ORDER BY Screen_position DESC
  `);

    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};
exports.getScreensDashboard = async () => {
  try {
    const rs = await db.Execute(configscreen,`
        SELECT  DB.DB_id, DB_url, DB_name, Screen_id, Screen_position
        FROM Screens SC LEFT JOIN [CMDCENTER].[dbo].[DashBoard] DB ON DB.[DB_id] = SC.[DB_id]
  `);
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};

exports.insertDashBoardtoScreen = async (DB_id, Screen_id) => {
  try {
    const rs = await db.Execute(configscreen,`
    UPDATE Screens SET  DB_id='${DB_id}' WHERE Screen_id = '${Screen_id}' AND Screen_position= '${Screen_id}'
`);
    // console.log(rs);
    return rs;
  } catch (error) {
    return null;
  }
};

exports.swapScreen = async (Screen_id1, Screen_id2) => {
  try {
    const rs = await db.Execute(configscreen,`
    DECLARE @temp_value VARCHAR(10);
    DECLARE @Screen_id1 VARCHAR(10) = '${Screen_id1}';
    DECLARE @Screen_id2 VARCHAR(10) = '${Screen_id2}';

    SET @temp_value = (SELECT DB_id FROM Screens WHERE Screen_id = @Screen_id1);

    UPDATE Screens
    SET DB_id = (SELECT DB_id FROM Screens WHERE Screen_id = @Screen_id2)
    WHERE Screen_id = @Screen_id1;

    UPDATE Screens
    SET DB_id = @temp_value
    WHERE Screen_id = @Screen_id2;
`);
    // console.log(rs);
    return rs;
  } catch (error) {
    return null;
  }
};


exports.detailScreen = async(Screen_id)=>{
  try {
    const rs = await db.Execute(configscreen,`
    SELECT  DB.DB_id, DB_url, DB_name, Screen_id, Screen_position
    FROM [CMDCENTER].[dbo].[DashBoard] DB LEFT JOIN Screens SC ON DB.[DB_id] = SC.[DB_id] where Screen_id='${Screen_id}' 
`);
    // console.log(rs);
    return rs.recordset[0];
  } catch (error) {
    return null;
  }
}



