const sql = require("mssql");
// const { config } = require("./fileconfig");
require("dotenv").config();

async function connectDB(config) {
  const pool = new sql.ConnectionPool(config);

  try {
    await pool.connect();
    // console.log("Connected to DB");
    return pool;
  } catch (err) {
    console.log("Failed to connect to DB", err);

    return err;
  }
}

exports.Execute = async (config,query) => {
  // const connect = await sql.connect(config);
  // console.log("Kết nối thành công đến cơ sở dữ liệu MSSQL.");
  const DB = await connectDB(config);

  try {
    // Thực hiện các thao tác với cơ sở dữ liệu ở đây
    const result = await DB.request().query(query);
    await DB.close();
    return result;
  } catch (error) {
    console.error("Lỗi khi kết nối đến cơ sở dữ liệu MSSQL:", error);
  } finally {
    await DB.close();
  }
};
// {
//   recordsets: [],
//   recordset: undefined,
//   output: {},
//   rowsAffected: [ 1 ]
// }
