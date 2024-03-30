const { config_erp } = require("../../fileconfig");
const db = require("../../connection");
exports.getServerTime = async () => {
    try {
      const rs = await db.Execute(
        config_erp,
        `SELECT  CONVERT(datetime,GETDATE()) time`
      );
  
      const date = rs.recordset[0].time;
      // console.log(date)
      const localDate = new Date(date);
      const year = localDate.getUTCFullYear();
      const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
      const day = String(localDate.getUTCDate()).padStart(2, "0");
      const hours = String(localDate.getUTCHours()).padStart(2, "0");
      const minutes = String(localDate.getUTCMinutes()).padStart(2, "0");
      const seconds = String(localDate.getUTCSeconds()).padStart(2, "0");
      
      const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.000`;
  // console.log(dateString)
      return dateString || null;
    } catch (error) {
      return null;
    }
  };