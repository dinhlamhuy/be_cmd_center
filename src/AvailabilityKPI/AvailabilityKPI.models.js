const db = require("../../connection");
const { config_erp, config_mescc115 } = require("../../fileconfig");
exports.GetDataAvailabilityKPI = async (Years) => {
  try {
    const rs = await db.Execute(config_erp,
      `if object_id('tempdb..#SaleN6E1KPI') is not null
      begin drop table #SaleN6E1KPI end
      SELECT s.ORDERNO,s.PAIRQTY,s.SCHDT,s.DUEDT,s.LCDT,s.ORDERDT,s.ShipMode,s.Shipmode_1
             ,s.CUSTORD,s.MCUSTMER,s.ARTICLE,s.ORDDT,S.FWDt,s.Last_PODD,RY_rule.Company
      INTO #SaleN6E1KPI 
      FROM DE_ORDERM s
      LEFT JOIN RY_rule ON RY_rule.Factory_CODE = s.FTYNO
      WHERE ((YEAR(s.SCHDT)='${Years}'
        )
       OR(YEAR(s.DUEDT)='${Years}'
        )
       )
       AND RY_rule.Company='LHG'
       AND s.CODE3<>'B'AND s.STATUS<>'C' 
       AND((s.STATUS ='P' and convert(varchar,s.ORDERDT,111) <= '2012/12/26')or(s.ORDERDT IS NULL)or(s.STATUS ='N' )) 
      CREATE NONCLUSTERED INDEX ORDERNO ON #SaleN6E1KPI(ORDERNO ASC)
       INCLUDE ( CUSTORD,DUEDT,FWDT,ORDERDT,MCUSTMER,ORDDT,SCHDT,ARTICLE,PAIRQTY,LCDT,ShipMode,Shipmode_1,Last_PODD) 
       WITH (SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF) ON [PRIMARY]
      --==============================================================
      if object_id('tempdb..#FCR_DR') is not null
      begin drop table #FCR_DR end
      SELECT ISNULL(y.DDBH,s.ORDERNO)ORDERNO,s.ORDERNO RY,ISNULL(CAST(y.Qty AS INT),s.PAIRQTY)PAIRQTY,s.SCHDT
            ,s.DUEDT,s.LCDT,kdr.RE_MDP,kdr.RE_DOL15,kdr.RE_PODDs,kdr.RE_PDP,kdr.RE_PODDaa,kdr.RE_PODDas
           ,s.ORDERDT,s.ShipMode,s.Shipmode_1,s.CUSTORD,s.MCUSTMER,s.ARTICLE,s.ORDDT,S.FWDt,s.Last_PODD,p.LPD
            ,ISNULL(ISNULL(FCR.FCRDate,s.LCDT),p.LPD) FCRDate
            ,CASE WHEN FCR.FCRDate IS NOT NULL 
                   OR  s.LCDT IS NOT NULL THEN kdr.RE_SDP
                   ELSE kdr.RE_MDP END RE_SDP,s.Company INTO #FCR_DR 
      FROM #SaleN6E1KPI s
      LEFT JOIN KPI_YWDD y ON y.YSBH=s.ORDERNO AND y.YN<>'N' 
      LEFT JOIN
        (SELECT id.RYNO,ISNULL(CASE WHEN CONVERT(VARCHAR,MAX(sb.Bill_FCR_Date),111)>=
              CONVERT(VARCHAR,GETDATE(),111) THEN NULL ELSE MAX(sb.Bill_FCR_Date)END,MAX(sb.ExFty_Date)) FCRDate
           FROM KPI_INVOICE_D id LEFT JOIN KPI_Ship_Booking sb ON sb.INV_NO = id.INV_NO
         GROUP BY id.RYNO)FCR ON FCR.RYNO=y.DDBH
      LEFT JOIN
        (SELECT id.RYNO,id.DRCode,ISNULL(CASE WHEN CONVERT(VARCHAR,sb.Bill_FCR_Date,111)>=
              CONVERT(VARCHAR,GETDATE(),111) THEN NULL ELSE sb.Bill_FCR_Date END,sb.ExFty_Date) FCRDate
           FROM KPI_INVOICE_D id LEFT JOIN KPI_Ship_Booking sb ON sb.INV_NO = id.INV_NO
          )sb ON sb.RYNO=FCR.RYNO AND ISNULL(sb.FCRDate,'1999/01/01')=ISNULL(FCR.FCRDate,'1999/01/01') 
      LEFT JOIN ( SELECT RY,MAX(LPD)LPD FROM FR_LPD GROUP BY RY )p ON p.RY=s.ORDERNO
      LEFT JOIN KPI_DeReasonM kdr ON kdr.RYNO=s.ORDERNO
      GROUP BY ISNULL(y.DDBH,s.ORDERNO),s.ORDERNO ,ISNULL(CAST(y.Qty AS INT),s.PAIRQTY),s.SCHDT
            ,s.DUEDT,s.LCDT,kdr.RE_MDP,kdr.RE_DOL15,kdr.RE_PODDs,kdr.RE_PDP,kdr.RE_PODDaa,kdr.RE_PODDas
              ,s.ORDERDT,s.ShipMode,s.Shipmode_1,s.CUSTORD,s.MCUSTMER,s.ARTICLE,s.ORDDT,S.FWDt,s.Last_PODD,p.LPD
            ,FCR.FCRDate,kdr.RE_SDP,s.Company
      CREATE NONCLUSTERED INDEX ORDERNO ON #FCR_DR(ORDERNO ASC)
       INCLUDE ( DUEDT,SCHDT,LCDT,FCRDate,FWDt,Shipmode_1,PAIRQTY)
       WITH (SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF) ON [PRIMARY]
       --================================================================
      SET LANGUAGE us_english;
      select SDP.Names,CONVERT(float,SDPQtyTotal) SDPQtyTotal, CONVERT(float,CRDQtyTotal) CRDQtyTotal  
            ,'' SDPTarget
            ,case when isnull(SDPQty,0)=0 then 0 else CONVERT(float,round(SDPQty*100/CRDQtyTotal,2)) end as SDP
          ,'' PDPTarget
            , case when isnull(PDPQty,0)=0 then 0 else CONVERT(float, round(PDPQty*100/CRDQtyTotal,2)) end as PDP
          ,'' MDPTarget
            , case when isnull(MDPQty,0)=0 then 0 else CONVERT(float, round(MDPQty*100/CRDQtyTotal,2)) end as MDP
          ,'1' Target
            ,'1' Actual
      from (
            select Year(s.DUEDT)Years,cast(sum(s.PAIRQTY)as decimal(18,2))SDPQty,month(s.DUEDT) as months
                   ,upper(left(DateName(month,s.DUEDT),3)) as Names,s.Company
            from #FCR_DR s 
            left join DELAYREASON d on d.DRCODE=s.RE_SDP
            where Year(s.DUEDT)='${Years}'  
                and s.DUEDT is not null
                and ( DATEDIFF(DAY,s.FCRDate,s.SCHDT)>=0
                 or d.DRMAINCODE in('04','06')
                  )   
            group by month(s.DUEDT),Year(s.DUEDT),upper(left(DateName(month,s.DUEDT),3)),s.Company 
            union all   
            select Year(s.DUEDT)Years,cast(sum(s.PAIRQTY)as decimal(18,2))SDPQty,'13' as Months, 'TOTAL' as Names,s.Company
            from #FCR_DR s 
            left join DELAYREASON d on d.DRCODE=s.RE_SDP
            where Year(s.DUEDT)='${Years}'  
                and s.DUEDT is not null
                and ( DATEDIFF(DAY,s.FCRDate,s.SCHDT)>=0
                      or d.DRMAINCODE in('04','06')
                    )   
            group by Year(s.DUEDT),s.Company
           ) SDP
      left join
           ( select month(DUEDT) as months,cast(sum(PAIRQTY)as decimal(18,2)) as CRDQtyTotal
             from #FCR_DR
             where Year(DUEDT)='${Years}' 
             Group by Month(DUEDT)
             union all
             select '13' as months,cast(sum(PAIRQTY)as decimal(18,2)) as CRDQtyTotal
             from #FCR_DR
             where Year(DUEDT)='${Years}' 
           )CRDQtyTotal on CRDQtyTotal.Months=SDP.months
      left join
           (	select month(SCHDT) as Months,cast(sum(PAIRQTY)as decimal(18,2)) as SDPQtyTotal 
             from #FCR_DR
             where YEAR(SCHDT)='${Years}'  
             group by month(SCHDT)
             Union all 
             select '13' as Months,cast(sum(PAIRQTY)as decimal(18,2)) as SDPQtyTotal 
             from #FCR_DR
             where YEAR(SCHDT)='${Years}'  
           )SDPQtyTotal on SDPQtyTotal.Months=SDP.Months
      Left join
           ( select cast(sum(s.PAIRQTY)as decimal(18,2))MDPQty, month(s.DUEDT) as months
             from #FCR_DR s 
             left join DELAYREASON on DELAYREASON.DRCODE=s.RE_MDP	
             where Year(s.DUEDT)='${Years}'	 
                   and s.DUEDT is not null 
                   and ( DATEDIFF(DAY,s.FCRDate,s.DUEDT)>=0
                         OR DELAYREASON.DRMAINCODE='04'
                        )   
             group by month(s.DUEDT)
             Union all  
             select cast(sum(s.PAIRQTY)as decimal(18,2))MDPQty,'13' as months
             from #FCR_DR s 
             left join DELAYREASON on DELAYREASON.DRCODE=s.RE_MDP	
             where Year(s.DUEDT)='${Years}'	 
                   and s.DUEDT is not null
                   and ( DATEDIFF(DAY,s.FCRDate,s.DUEDT)>=0
                         OR DELAYREASON.DRMAINCODE='04'
                        )   
           )MDP on MDP.months=SDP.months
      left join
           ( select cast(sum(s.PAIRQTY)as decimal(18,2))PDPQty, month(s.DUEDT) as months
             from #FCR_DR s 
             left join DELAYREASON on DELAYREASON.DRCODE=s.RE_PDP	
             where Year(DUEDT)='${Years}'	
                   and( DATEDIFF(DAY,s.LPD,s.FWDT)>=0 
                        OR DELAYREASON.DRMAINCODE='04'
                       )
                        group by month(s.DUEDT)
             Union all
             select cast(sum(s.PAIRQTY)as decimal(18,2))PDPQty, '13' as months
             from #FCR_DR s 
             left join DELAYREASON on DELAYREASON.DRCODE=s.RE_PDP	
             where Year(DUEDT)='${Years}'	
                   and( DATEDIFF(DAY,s.LPD,s.FWDT)>=0 
                        OR DELAYREASON.DRMAINCODE='04'
                       )
           )PDP on PDP.months=SDP.months
      order by SDP.Months 
      
        `
    );
		
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};

exports.GetDataAvailabilityKPI_115 = async (Years) => {
  try {
    const rs = await db.Execute(config_mescc115,
      ` SELECT Years_Months 
     -- ,SDPQtyTotal ,CRDQtyTotal ,SDPTarget ,SDP 
      --,PDPTarget ,PDP  ,MDPTarget ,MDP
      ,Efficiency_Target   ,Efficiency_Actual 
       FROM Data_KPI_Display WHERE  Years_Keys ='${Years}'
        `
    );
		
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};


