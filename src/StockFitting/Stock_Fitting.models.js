const db = require("../../connection");
const { config_eip } = require("../../fileconfig");
exports.GetDataStockFitting = async () => {
  try {
    const rs = await db.Execute(config_eip,
      `   SELECT  Num, Line , Total_Member , Article, Model_Name , Target , Value_Hour 
      , Hour_8 , Hour_9 , Hour_10 , Hour_11, Hour_12, Hour_13 , Hour_14, Hour_15 , Total  , [Percent],PPH,  RFT,Name_Shift
      FROM ( SELECT REPLACE( b.name_machine,'S','') Num,b.name_machine Line
                                 ,ISNULL( a.puller_man,0) Total_Member
                                 ,ISNULL(a.article,'') Article
                                 ,ISNULL(a.model ,'') Model_Name
                                 ,CASE WHEN a.hours > 0 THEN  ISNULL(ROUND( a.target/a.hours,0),'') ELSE '' END Target
                                 ,ISNULL(a.hours,'') Value_Hour
                                 ,ISNULL( a.h1,'') Hour_8
                                 ,ISNULL( a.h2,'') Hour_9
                                 ,ISNULL( a.h3,'') Hour_10
                                 ,ISNULL( a.h4,'') Hour_11
                                 ,ISNULL( a.h5,'') Hour_12
                                 ,ISNULL( a.h6,'') Hour_13
                                 ,ISNULL( a.h7,'') Hour_14
                                 ,ISNULL( a.h8,'') Hour_15
                                 ,ISNULL((a.h1+a.h2+a.h3+a.h4+a.h5+a.h6+a.h7+a.h8+a.h9),'') Total
                                 ,ISNULL(CONVERT(VARCHAR, ROUND( convert (varchar,((a.h1+a.h2+a.h3+a.h4+a.h5+a.h6+a.h7+a.h8+a.h9)/(case when a.[target] = 0 then NULL else a.[target] end) )*100),2)),'') [Percent]
                                 ,ISNULL(ROUND( round((a.h1+a.h2+a.h3+a.h4+a.h5+a.h6+a.h7)/(case when a.puller_man = 0 then NULL else a.puller_man end),2)/(case when a.[hours] = 0 then NULL else a.[hours] end),2),'') PPH  
                                 ,ROUND(ISNULL(e.rft ,0),2) RFT
                                 ,c.name_shift   Name_Shift 
                                 FROM (select * from PPH_TreatmentAndBottom where 1=1 and [date]=CONVERT(date,GETDATE()) and [type]='GCD' ) a 
                                 left join ( select * from PPH_TreatmentAndBottoms where [type] = 'GCD') b on a.id_machine = b.id_machine 
                                 left join ( select * from PPH_TreatmentAndBottomss where yn=1 and [type] = 'GCD') c on a.id_shift = c.id_shift 
                                 left join (SELECT line,alias FROM PPH_Line_IP WHERE factory='LHG' AND YN='1' AND alias IS NOT NULL GROUP BY line,alias) d on a.id_machine = d.line 
                                 left join (select Depid,  (convert(float,SUM(Qty))/(SUM(Qty)+SUM(NgQty)))*100 rft from [LIY_ERP].LIY_ERP.dbo.Andon where convert(varchar(10),QcDate,120) = CONVERT(date,GETDATE()) group by Depid) e on b.depid_erp = e.Depid ) a 


                    UNION ALL

                    SELECT '' Num,'Total'  Line ,   sum(CONVERT(float, Total_Member)) Total_Member
      ,'' Article,'' Model_Name , Sum( Target) Target , '' Value_Hour 
      , SUM(Hour_8) Hour_8 ,  SUM(Hour_9) Hour_9 ,  SUM(Hour_10) Hour_10
      ,  SUM(Hour_11) Hour_11,  SUM(Hour_12) Hour_12,  SUM(Hour_13) Hour_13
      , SUM(Hour_14) Hour_14,  SUM(Hour_15) Hour_15 , SUM(Total) Total 
      ,''[Percent],''PPH, '' RFT,''Name_Shift
      FROM (
      SELECT REPLACE( b.name_machine,'S','') Num,b.name_machine Line
                                 ,ISNULL( a.puller_man,0) Total_Member
                                 ,ISNULL(a.article,'') Article
                                 ,ISNULL(a.model ,'') Model_Name
                                 ,CASE WHEN a.hours > 0 THEN  ISNULL(ROUND( a.target/a.hours,0),'') ELSE '' END Target
                                 ,ISNULL(a.hours,'') Value_Hour
                                 ,ISNULL( a.h1,'') Hour_8
                                 ,ISNULL( a.h2,'') Hour_9
                                 ,ISNULL( a.h3,'') Hour_10
                                 ,ISNULL( a.h4,'') Hour_11
                                 ,ISNULL( a.h5,'') Hour_12
                                 ,ISNULL( a.h6,'') Hour_13
                                 ,ISNULL( a.h7,'') Hour_14
                                 ,ISNULL( a.h8,'') Hour_15
                                 ,ISNULL((a.h1+a.h2+a.h3+a.h4+a.h5+a.h6+a.h7+a.h8+a.h9),'') Total
                                 ,ISNULL(CONVERT(VARCHAR, ROUND( convert (varchar,((a.h1+a.h2+a.h3+a.h4+a.h5+a.h6+a.h7+a.h8+a.h9)/(case when a.[target] = 0 then NULL else a.[target] end) )*100),2)),'') [Percent]
                                 ,ISNULL(ROUND( round((a.h1+a.h2+a.h3+a.h4+a.h5+a.h6+a.h7)/(case when a.puller_man = 0 then NULL else a.puller_man end),2)/(case when a.[hours] = 0 then NULL else a.[hours] end),2),'') PPH  
                                 ,ROUND(ISNULL(e.rft ,0),2) RFT
                                 ,c.name_shift   Name_Shift 
                                 FROM (select * from PPH_TreatmentAndBottom where 1=1 and [date]=CONVERT(date,GETDATE()) and [type]='GCD' ) a 
                                 left join ( select * from PPH_TreatmentAndBottoms where [type] = 'GCD') b on a.id_machine = b.id_machine 
                                 left join ( select * from PPH_TreatmentAndBottomss where yn=1 and [type] = 'GCD') c on a.id_shift = c.id_shift 
                                 left join (SELECT line,alias FROM PPH_Line_IP WHERE factory='LHG' AND YN='1' AND alias IS NOT NULL GROUP BY line,alias) d on a.id_machine = d.line 
                                 left join (select Depid,  (convert(float,SUM(Qty))/(SUM(Qty)+SUM(NgQty)))*100 rft from [LIY_ERP].LIY_ERP.dbo.Andon where convert(varchar(10),QcDate,120) = CONVERT(date,GETDATE()) group by Depid) e on b.depid_erp = e.Depid ) a`
    );
		
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};


