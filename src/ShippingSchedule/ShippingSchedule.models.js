const db = require("../../connection");
const { config_erp } = require("../../fileconfig");

exports.Get_Shipping_Main = async () => {
  try {
    const sql = `SELECT FS.ShipDate ShipDate, SUM(YWDD.Qty) Qty,SUM(YWDD.Qty-ISNULL(F.FQty,0)) UnPack ,COUNT(FSD.RY) PO  , 
        SUM(CASE WHEN DDZL_Inspection.CheckDate IS NULL THEN 1 ELSE 0 END) WaitInspect 
            FROM FGShip FS LEFT JOIN FGShipDtl AS FSD ON FS.FGShipId = FSD.FGShipId 
            LEFT JOIN FGSCanTotal AS F ON F.YWBH = FSD.RY LEFT JOIN YWDD ON YWDD.YSBH = FSD.RY 
            LEFT JOIN DDZL ON YWDD.YSBH = DDZL.DDBH 
            LEFT JOIN DDZL_Inspection on DDZL.DDBH=DDZL_Inspection.DDBH 
            LEFT JOIN(SELECT DDZLWH.DDBH, SUM(DDZLWH.QTY) AS EXQty FROM DDZLWH 
            WHERE TP= 'EX' GROUP BY DDZLWH.DDBH ) EX ON EX.DDBH = FSD.RY 
        WHERE ISNULL(EX.ExQty,0)< YWDD.Qty AND DDZL.DDZT <> 'C' AND DDZL.DDLB <> 'B' 
        AND CONVERT(DATE, FS.ShipDate) >=  CONVERT(DATE,GETDATE()) --CONVERT(DATE,'skdjsk')
        GROUP BY FS.ShipDate ORDER BY FS.ShipDate`;
    const rs = await db.Execute(config_erp, sql);

    // console.table(rs.recordset);
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};
exports.Get_Shipping_Detail = async () => {
  try {
    const sql = `SELECT   FS.ShipDate AS ShipDate ,FSD.RY ,YWDD.Qty ,F.FQty ,YWDD.Qty - ISNULL(F.FQty, 0) AS UnPack ,ISNULL(DDZL_InspectiON.CheckDate,GETDATE()) CheckDate
    ,DDZL.KHPO ,DDZL.Article ,XXZL.XieMing ,REPLACE(REPLACE(CONVERT(VARCHAR,(SELECT LEAN +' ' FROM PDSCH WHERE RY = FSD.RY FOR XML PATH (''))), CHAR(13), ''),
    CHAR(10), ' ') AS LEAN_A ,DDZL.ShipDate AS SDD ,DE_ORDERM.DUEDT AS CRD ,DE_CUST.COUNTRYEN FROM FGShip FS LEFT JOIN FGShipDtl AS FSD ON FS.FGShipId = FSD.FGShipId
    LEFT JOIN FGSCanTotal AS F ON F.YWBH = FSD.RY 
    LEFT JOIN YWDD ON YWDD.YSBH = FSD.RY LEFT JOIN DDZL ON YWDD.YSBH = DDZL.DDBH LEFT JOIN DE_ORDERM ON DDZL.DDBH = DE_ORDERM.ORDERNO   
    LEFT JOIN DDZL_InspectiON ON DDZL.DDBH=DDZL_InspectiON.DDBH LEFT JOIN DE_CUST ON DE_CUST.CUSTID=DE_ORDERM.MCUSTMER     
    LEFT JOIN XXZL  ON DDZL.XieXing=XXZL.XieXing and DDZL.SheHao=XXZL.SheHao LEFT JOIN (SELECT RY,isnull(Min(ZLBH),'no RY') AS ZLBH_1 
    FROM PDSCH WHERE LEAN<>'0' GROUP BY RY ) PDSCH_1 ON DDZL.DDBH=PDSCH_1.RY LEFT JOIN PDSCH PDSCH_11  ON PDSCH_11.ZLBH=PDSCH_1.ZLBH_1 
    WHERE CONVERT(DATE, FS.ShipDate) = CONVERT(DATE,GETDATE()) --getdate
    AND DDZL.DDZT <> 'C' AND DDZL.DDLB <> 'B' ORDER BY UnPack DESC`;
    const rs = await db.Execute(config_erp, sql);

    // console.table(rs.recordset);
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};
