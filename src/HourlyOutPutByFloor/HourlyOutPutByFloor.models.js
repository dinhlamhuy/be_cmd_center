const db = require("../../connection");
const { config_eip } = require("../../fileconfig");
exports.getSanLuong = async () => {
  try {
    const rs = await db.Execute(config_eip,
      `if object_id('tempdb..#LINE_REPORT') is not null  
        begin drop table #LINE_REPORT END
		SELECT (Case when Len(SUBSTRING(PA.LINE, CHARINDEX( '-',PA. LINE)+1,2))=1 then   REPLACE(PA.LINE, '-', '_M0') else REPLACE(PA.LINE, '-', '_M') end) line,PPH_Line_IP.Loc
		,pas.cycle,pas.outputtime,stitching_output,PPH_Line_ip.ERP_stitching_line_name
		INTO #LINE_REPORT
		FROM PPH_Adjustment_report PA
		left join PPH_Adjustment_report_s PAS ON  PA.reportno=PAS.reportno 
		LEFT JOIN PPH_Line_ip ON PPH_Line_ip.line=PA.line 
		WHERE CONVERT (VARCHAR,PA.outputdate,111)=CONVERT(VARCHAR,GETDATE(),111) 
		GROUP BY PA.line,pas.cycle,pas.outputtime,PPH_Line_ip.ERP_stitching_line_name ,stitching_output,PPH_Line_IP.Loc
		UNION ALL
		SELECT (Case when Len(SUBSTRING(PA.LINE, CHARINDEX( '-',PA. LINE)+1,2))=1 then   REPLACE(PA.LINE, '-', '_G0') else  REPLACE(PA.LINE, '-', '_G') end) line,PPH_Line_IP.Loc
		,pas.cycle,pas.outputtime,assembly_output,PPH_Line_ip.ERP_assembly_line_name
		FROM PPH_Adjustment_report PA 
		left join PPH_Adjustment_report_s PAS ON  PA.reportno=PAS.reportno
		LEFT JOIN PPH_Line_ip ON PPH_Line_ip.line=PA.line 
		WHERE  CONVERT (VARCHAR,PA.outputdate,111)=CONVERT(VARCHAR,GETDATE(),111)
		GROUP BY PA.line,pas.cycle,pas.outputtime,PPH_Line_ip.ERP_assembly_line_name ,assembly_output,PPH_Line_IP.Loc

    if object_id('tempdb..#LINE_TARGET') is not null  
    begin drop table #LINE_TARGET END
			SELECT SCBZCL.DepNo,SCBZCL.QTY QTY,SCRL.SCGS,ROUND (SCBZCL.QTY/SCRL.SCGS,0) M_TARGET
			INTO #LINE_TARGET
			FROM LIY_ERP.LIY_ERP.DBO.SCBZCL SCBZCL 
			LEFT JOIN  LIY_ERP.LIY_ERP.DBO.SCRL SCRL ON SCRL.DepNO=SCBZCL.DepNo  
							AND YEAR (SCBZCL.BZDate)=SCRL.SCYEAR
							AND MONTH (SCBZCL.BZDate)=SCRL.SCMONTH
							AND DAY(SCBZCL.BZDate)=SCRL.SCDay
			WHERE SCBZCL.GSBH='LHG' AND SCBZCL.BZDate=CONVERT(VARCHAR,GETDATE(),111)
		
    if object_id('tempdb..#pph_hourly_report_auto') is not null  
    begin drop table #pph_hourly_report_auto END
    SELECT #LINE_REPORT.line,#LINE_REPORT.cycle,#LINE_REPORT.outputtime,#LINE_REPORT.stitching_output,#LINE_TARGET.QTY, #LINE_TARGET.M_TARGET,#LINE_REPORT.Loc
    INTO #pph_hourly_report_auto
    FROM #LINE_REPORT
    LEFT JOIN  #LINE_TARGET ON #LINE_TARGET.DepNo=#LINE_REPORT.ERP_stitching_line_name COLLATE Chinese_Taiwan_Stroke_CI_AS	

    if object_id('tempdb..#pph_hourly_report_auto_s') is not null  
    begin drop table #pph_hourly_report_auto_s END
     SELECT b.Line
      ,Total_Emp 
      ,AT_ALL 
      ,AT_IN_DR
      ,AB_ALL
      ,b.QTY
      ,CONVERT(decimal(10,0),b.M_TARGET) TARGET 
	    ,(Select stitching_output from #pph_hourly_report_auto  where 1=1 and outputtime = '07:30-08:30' and line =b.line ) '07:30-08:30'
	    ,(Select stitching_output from #pph_hourly_report_auto  where 1=1 and outputtime = '08:30-09:30' and line =b.line ) '08:30-09:30'  
        ,(Select stitching_output from #pph_hourly_report_auto  where 1=1 and outputtime = '09:30-10:30' and line =b.line ) '09:30-10:30'  
        ,(Select stitching_output from #pph_hourly_report_auto  where 1=1 and outputtime = '10:30-11:30' and line =b.line ) '10:30-11:30'  
        ,(Select stitching_output from #pph_hourly_report_auto  where 1=1 and outputtime = '11:30-12:30' and line =b.line ) '11:30-12:30'
	    ,(Select stitching_output from #pph_hourly_report_auto  where 1=1 and outputtime = '12:30-13:30' and line =b.line ) '12:30-13:30'  
        ,(Select stitching_output from #pph_hourly_report_auto  where 1=1 and outputtime = '13:30-14:30' and line =b.line ) '13:30-14:30'        
        ,(Select stitching_output from #pph_hourly_report_auto  where 1=1 and outputtime = '14:30-15:30' and line =b.line ) '14:30-15:30'     
        ,(Select stitching_output from #pph_hourly_report_auto  where 1=1 and outputtime = '15:30-16:30' and line =b.line ) '15:30-16:30',Loc into #pph_hourly_report_auto_s
         from #pph_hourly_report_auto b LEFT JOIN (select * from PPH_Line_Attendance where CONVERT(date,userdate) = CONVERT(date,GETDATE()) ) CD ON b.line COLLATE Chinese_Taiwan_Stroke_CI_AS = cd.Department_ID  WHERE Total_Emp  IS NOT NULL AND b.M_TARGET <> 0  group by b.Line,B.M_TARGET ,Total_Emp ,AT_ALL ,AT_IN_DR ,AB_ALL,B.QTY,Loc  order by b.line


	     select line,Total_Emp Total_Member  ,AT_ALL Today_Absent  ,AT_IN_DR InDirect ,AB_ALL Today_member ,QTY CAPACITY ,TARGET,[07:30-08:30] Hour_8,[08:30-09:30] Hour_9,[09:30-10:30] Hour_10,[10:30-11:30] Hour_11,[11:30-12:30] Hour_12,[12:30-13:30] Hour_13,[13:30-14:30] Hour_14,[14:30-15:30] Hour_15,[15:30-16:30] Hour_16 from #pph_hourly_report_auto_s where loc = 'A-F4' AND line like '%M%'
	     UNION ALL
	     select 'Total' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where loc = 'A-F4' AND line like '%M%' group by Loc
	     UNION ALL
	     select line,Total_Emp,AT_ALL,AT_IN_DR,AB_ALL,QTY,TARGET,[07:30-08:30],[08:30-09:30],[09:30-10:30],[10:30-11:30],[11:30-12:30],[12:30-13:30],[13:30-14:30],[14:30-15:30],[15:30-16:30] from #pph_hourly_report_auto_s where loc = 'A-F4' AND line like '%G%'
	     UNION ALL
	     select 'Total' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where loc = 'A-F4' AND line like '%G%' group by Loc
	     UNION ALL
	     select line,Total_Emp,AT_ALL,AT_IN_DR,AB_ALL,QTY,TARGET,[07:30-08:30],[08:30-09:30],[09:30-10:30],[10:30-11:30],[11:30-12:30],[12:30-13:30],[13:30-14:30],[14:30-15:30],[15:30-16:30] from #pph_hourly_report_auto_s where loc = 'A-F2' AND line like '%M%'
	     UNION ALL
	     select 'Total' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where loc = 'A-F2' AND line like '%M%' group by Loc
	     UNION ALL
	     select line,Total_Emp,AT_ALL,AT_IN_DR,AB_ALL,QTY,TARGET,[07:30-08:30],[08:30-09:30],[09:30-10:30],[10:30-11:30],[11:30-12:30],[12:30-13:30],[13:30-14:30],[14:30-15:30],[15:30-16:30] from #pph_hourly_report_auto_s where loc = 'A-F2' AND line like '%G%'
	     UNION ALL
	     select 'Total' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where loc = 'A-F2' AND line like '%G%' group by Loc
	     UNION ALL
	     select line,Total_Emp,AT_ALL,AT_IN_DR,AB_ALL,QTY,TARGET,[07:30-08:30],[08:30-09:30],[09:30-10:30],[10:30-11:30],[11:30-12:30],[12:30-13:30],[13:30-14:30],[14:30-15:30],[15:30-16:30] from #pph_hourly_report_auto_s where loc = 'A-F1' AND line like '%M%'
	     UNION ALL
	     select 'Total' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where loc = 'A-F1' AND line like '%M%' group by Loc
	     UNION ALL
	     select line,Total_Emp,AT_ALL,AT_IN_DR,AB_ALL,QTY,TARGET,[07:30-08:30],[08:30-09:30],[09:30-10:30],[10:30-11:30],[11:30-12:30],[12:30-13:30],[13:30-14:30],[14:30-15:30],[15:30-16:30] from #pph_hourly_report_auto_s where loc = 'A-F1' AND line like '%G%'
	     UNION ALL
	     select 'Total' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where loc = 'A-F1' AND line like '%G%' group by Loc
		     UNION ALL
	     select line,Total_Emp,AT_ALL,AT_IN_DR,AB_ALL,QTY,TARGET,[07:30-08:30],[08:30-09:30],[09:30-10:30],[10:30-11:30],[11:30-12:30],[12:30-13:30],[13:30-14:30],[14:30-15:30],[15:30-16:30] from #pph_hourly_report_auto_s where loc = 'B-F2' AND line like '%M%'
	     UNION ALL
	     select 'Total' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where loc = 'B-F2' AND line like '%M%' group by Loc
	     UNION ALL
	     select line,Total_Emp,AT_ALL,AT_IN_DR,AB_ALL,QTY,TARGET,[07:30-08:30],[08:30-09:30],[09:30-10:30],[10:30-11:30],[11:30-12:30],[12:30-13:30],[13:30-14:30],[14:30-15:30],[15:30-16:30] from #pph_hourly_report_auto_s where loc = 'B-F2' AND line like '%G%'
	     UNION ALL
	     select 'Total' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where loc = 'B-F2' AND line like '%G%' group by Loc
	     UNION ALL
	     select line,Total_Emp,AT_ALL,AT_IN_DR,AB_ALL,QTY,TARGET,[07:30-08:30],[08:30-09:30],[09:30-10:30],[10:30-11:30],[11:30-12:30],[12:30-13:30],[13:30-14:30],[14:30-15:30],[15:30-16:30] from #pph_hourly_report_auto_s where loc = 'C-F2' AND line like '%M%'
	     UNION ALL
	     select 'Total' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where loc = 'C-F2' AND line like '%M%' group by Loc
	     UNION ALL
	     select line,Total_Emp,AT_ALL,AT_IN_DR,AB_ALL,QTY,TARGET,[07:30-08:30],[08:30-09:30],[09:30-10:30],[10:30-11:30],[11:30-12:30],[12:30-13:30],[13:30-14:30],[14:30-15:30],[15:30-16:30] from #pph_hourly_report_auto_s where loc = 'C-F2' AND line like '%G%'
	     UNION ALL
	     select 'Total' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where loc = 'C-F2' AND line like '%G%' group by Loc
	     UNION ALL
	     select line,Total_Emp,AT_ALL,AT_IN_DR,AB_ALL,QTY,TARGET,[07:30-08:30],[08:30-09:30],[09:30-10:30],[10:30-11:30],[11:30-12:30],[12:30-13:30],[13:30-14:30],[14:30-15:30],[15:30-16:30] from #pph_hourly_report_auto_s where loc = 'D-F1' AND line like '%M%'
	     UNION ALL
	     select 'Total' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where loc = 'D-F1' AND line like '%M%' group by Loc
	     UNION ALL
	     select line,Total_Emp,AT_ALL,AT_IN_DR,AB_ALL,QTY,TARGET,[07:30-08:30],[08:30-09:30],[09:30-10:30],[10:30-11:30],[11:30-12:30],[12:30-13:30],[13:30-14:30],[14:30-15:30],[15:30-16:30] from #pph_hourly_report_auto_s where loc = 'D-F1' AND line like '%G%'
	     UNION ALL
	     select 'Total' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where loc = 'D-F1' AND line like '%G%' group by Loc
	     UNION ALL
	     select line,Total_Emp,AT_ALL,AT_IN_DR,AB_ALL,QTY,TARGET,[07:30-08:30],[08:30-09:30],[09:30-10:30],[10:30-11:30],[11:30-12:30],[12:30-13:30],[13:30-14:30],[14:30-15:30],[15:30-16:30] from #pph_hourly_report_auto_s where loc = 'D-F3' AND line like '%M%'
	     UNION ALL
	     select 'Total' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where loc = 'D-F3' AND line like '%M%' group by Loc
	     UNION ALL
	     select line,Total_Emp,AT_ALL,AT_IN_DR,AB_ALL,QTY,TARGET,[07:30-08:30],[08:30-09:30],[09:30-10:30],[10:30-11:30],[11:30-12:30],[12:30-13:30],[13:30-14:30],[14:30-15:30],[15:30-16:30] from #pph_hourly_report_auto_s where loc = 'D-F3' AND line like '%G%'
	     UNION ALL
	     select 'Total' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where loc = 'D-F3' AND line like '%G%' group by Loc
	    UNION ALL
	     select 'M_ALL' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where line like '%M%'
	    UNION ALL
	     select 'G_ALL' Line,SUM(Total_Emp) Total_Emp,sum(AT_ALL) AT_ALL,sum(AT_IN_DR) AT_IN_DR,sum(AB_ALL) AB_ALL,sum(QTY) QTY,sum(TARGET) TARGET,sum([07:30-08:30]) [07:30-08:30],
			    sum([08:30-09:30]) [08:30-09:30],sum([09:30-10:30]) [09:30-10:30],sum([10:30-11:30]) [10:30-11:30],sum([11:30-12:30]) [11:30-12:30],
			    sum([12:30-13:30]) [12:30-13:30],sum([13:30-14:30]) [13:30-14:30],sum([14:30-15:30]) [14:30-15:30],sum([15:30-16:30]) [15:30-16:30] from #pph_hourly_report_auto_s where line like '%G%' `
    );
		
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};
