const db = require("../../connection");
const { config_erp } = require("../../fileconfig");
exports.GetDataKPI = async () => {
  try {
    const rs = await db.Execute(config_erp,
      `DECLARE @START VARCHAR(10) =YEAR(GETDATE())
      DECLARE @END VARCHAR(10) = YEAR(GETDATE())
      SET ANSI_NULLS ON
      SET ANSI_WARNINGS ON
           if object_id('tempdb..#LYV_Q_KPI_D') is not null      
            begin  drop table #LYV_Q_KPI_D end    
        SELECT  QKPI_Detail_Factory.ID_QKPI,(isnull(QKPI_Detail_ID.CNName,'')+ '/' + QKPI_Detail_ID.EngName)KPI,QKPI_Detail_Factory.QFactory   
         ,QKPI_Detail_Factory.Jan,QKPI_Detail_Factory.Feb,QKPI_Detail_Factory.Mar,QKPI_Detail_Factory.Apr,QKPI_Detail_Factory.May   
         ,QKPI_Detail_Factory.Jun,QKPI_Detail_Factory.Jul,QKPI_Detail_Factory.Aug,QKPI_Detail_Factory.Sep,QKPI_Detail_Factory.Oct   
         ,QKPI_Detail_Factory.Nov,QKPI_Detail_Factory.Dec,(ISNULL(Jan,0)+ISNULL(Feb,0)+ISNULL(Mar,0)+ISNULL(Apr,0)+ISNULL(May,0)+ISNULL(Jun,0)+ISNULL(Jul,0)+ISNULL(Aug,0)+ISNULL(Sep,0)+ISNULL(Oct,0)+ISNULL(Nov,0)+ISNULL(Dec,0))Total,''YN    
         INTO #LYV_Q_KPI_D  
         from QKPI_Detail_Factory   
         left join QKPI_Detail_ID on QKPI_Detail_Factory.ID_QKPI=QKPI_Detail_ID.ID_KPI   
         where 1=1   
        and QKPI_Detail_Factory.QYear Between @START And @END
        AND QKPI_Detail_Factory.QFactory ='LYV'  
        order by QKPI_Detail_Factory.QFactory  
         if object_id('tempdb..#LHG_Q_KPI_D') is not null      
            begin  drop table #LHG_Q_KPI_D end    
        SELECT  QKPI_Detail_Factory.ID_QKPI,(isnull(QKPI_Detail_ID.CNName,'')+ '/' + QKPI_Detail_ID.EngName)KPI,QKPI_Detail_Factory.QFactory   
         ,QKPI_Detail_Factory.Jan,QKPI_Detail_Factory.Feb,QKPI_Detail_Factory.Mar,QKPI_Detail_Factory.Apr,QKPI_Detail_Factory.May   
         ,QKPI_Detail_Factory.Jun,QKPI_Detail_Factory.Jul,QKPI_Detail_Factory.Aug,QKPI_Detail_Factory.Sep,QKPI_Detail_Factory.Oct   
         ,QKPI_Detail_Factory.Nov,QKPI_Detail_Factory.Dec,(ISNULL(Jan,0)+ISNULL(Feb,0)+ISNULL(Mar,0)+ISNULL(Apr,0)+ISNULL(May,0)+ISNULL(Jun,0)+ISNULL(Jul,0)+ISNULL(Aug,0)+ISNULL(Sep,0)+ISNULL(Oct,0)+ISNULL(Nov,0)+ISNULL(Dec,0))Total,''YN    
        INTO #LHG_Q_KPI_D  
        FROM LHG.LIY_ERP.DBO.QKPI_Detail_Factory  QKPI_Detail_Factory  
         left JOIN LHG.LIY_ERP.DBO.QKPI_Detail_ID QKPI_Detail_ID on QKPI_Detail_Factory.ID_QKPI=QKPI_Detail_ID.ID_KPI   
         where 1=1   
        and QKPI_Detail_Factory.QYear Between  @START And @END
        AND QKPI_Detail_Factory.QFactory ='LHG'  
        order by QKPI_Detail_Factory.QFactory  
         if object_id('tempdb..#LVL_Q_KPI_D') is not null      
            begin  drop table #LVL_Q_KPI_D end    
        SELECT  QKPI_Detail_Factory.ID_QKPI,(isnull(QKPI_Detail_ID.CNName,'')+ '/' + QKPI_Detail_ID.EngName)KPI,QKPI_Detail_Factory.QFactory   
         ,QKPI_Detail_Factory.Jan,QKPI_Detail_Factory.Feb,QKPI_Detail_Factory.Mar,QKPI_Detail_Factory.Apr,QKPI_Detail_Factory.May   
         ,QKPI_Detail_Factory.Jun,QKPI_Detail_Factory.Jul,QKPI_Detail_Factory.Aug,QKPI_Detail_Factory.Sep,QKPI_Detail_Factory.Oct   
         ,QKPI_Detail_Factory.Nov,QKPI_Detail_Factory.Dec,(ISNULL(Jan,0)+ISNULL(Feb,0)+ISNULL(Mar,0)+ISNULL(Apr,0)+ISNULL(May,0)+ISNULL(Jun,0)+ISNULL(Jul,0)+ISNULL(Aug,0)+ISNULL(Sep,0)+ISNULL(Oct,0)+ISNULL(Nov,0)+ISNULL(Dec,0))Total,''YN    
        INTO #LVL_Q_KPI_D  
        FROM QKPI_Detail_Factory  QKPI_Detail_Factory  
         left JOIN QKPI_Detail_ID QKPI_Detail_ID on QKPI_Detail_Factory.ID_QKPI=QKPI_Detail_ID.ID_KPI   
         where 1=1   
        and QKPI_Detail_Factory.QYear Between  @START And @END
        AND QKPI_Detail_Factory.QFactory ='VB7'  
        order by QKPI_Detail_Factory.QFactory  
         if object_id('tempdb..#LYM_Q_KPI_D') is not null      
            begin  drop table #LYM_Q_KPI_D end    
        SELECT  QKPI_Detail_Factory.ID_QKPI,(isnull(QKPI_Detail_ID.CNName,'')+ '/' + QKPI_Detail_ID.EngName)KPI,QKPI_Detail_Factory.QFactory   
         ,QKPI_Detail_Factory.Jan,QKPI_Detail_Factory.Feb,QKPI_Detail_Factory.Mar,QKPI_Detail_Factory.Apr,QKPI_Detail_Factory.May   
         ,QKPI_Detail_Factory.Jun,QKPI_Detail_Factory.Jul,QKPI_Detail_Factory.Aug,QKPI_Detail_Factory.Sep,QKPI_Detail_Factory.Oct   
         ,QKPI_Detail_Factory.Nov,QKPI_Detail_Factory.Dec,(ISNULL(Jan,0)+ISNULL(Feb,0)+ISNULL(Mar,0)+ISNULL(Apr,0)+ISNULL(May,0)+ISNULL(Jun,0)+ISNULL(Jul,0)+ISNULL(Aug,0)+ISNULL(Sep,0)+ISNULL(Oct,0)+ISNULL(Nov,0)+ISNULL(Dec,0))Total,''YN    
        INTO #LYM_Q_KPI_D  
        FROM LYM.LIY_ERP.DBO.QKPI_Detail_Factory  QKPI_Detail_Factory  
         left JOIN LYM.LIY_ERP.DBO.QKPI_Detail_ID QKPI_Detail_ID on QKPI_Detail_Factory.ID_QKPI=QKPI_Detail_ID.ID_KPI   
         where 1=1   
        and QKPI_Detail_Factory.QYear Between  @START And @END
        AND QKPI_Detail_Factory.QFactory ='POL'  
        order by QKPI_Detail_Factory.QFactory  
        if object_id('tempdb..#LYG_Q_KPI_M') is not null      
            begin  drop table #LYG_Q_KPI_M end   

        SELECT  * INTO #LYG_Q_KPI_M FROM #LYV_Q_KPI_D  
        UNION ALL  
        SELECT  * FROM #LHG_Q_KPI_D  
        UNION ALL  
        SELECT  * FROM #LVL_Q_KPI_D  
        UNION ALL  
        SELECT  * FROM #LYM_Q_KPI_D  
        select  ID_QKPI,(isnull(QKPI_Detail_ID.CNName,'') + '/' + QKPI_Detail_ID.EngName)KPI, SUM(isnull(Jan,0))Jan,Sum(isnull(Feb,0))Feb, Sum(isnull(Mar,0))Mar, SUM(isnull(Apr,0))Apr, Sum(isnull(May,0))May,SUM(isnull(Jun,0))Jun 
        , SUM(isnull(Jul,0))Jul,SUM(isnull(Aug,0))Aug, SUM(isnull(Sep,0))Sep,SUM(isnull(Oct,0))Oct,SUM(isnull(Nov,0))Nov,SUM(isnull(Dec,0))Dec   
        ,(SUM(isnull(Jan,0)) + Sum(isnull(Feb,0))+Sum(isnull(Mar,0))+ SUM(isnull(Apr,0))+ Sum(isnull(May,0)) + SUM(isnull(Jun,0)) + SUM(isnull(Jul,0)) +   
        SUM(isnull(Aug,0)) + SUM(isnull(Sep,0)) + SUM(isnull(Oct,0)) + SUM(isnull(Nov,0)) + SUM(isnull(Dec,0)) )Total  
        from #LYG_Q_KPI_M QKPI_Detail_Factory  
        left join QKPI_Detail_ID on QKPI_Detail_Factory.ID_QKPI = QKPI_Detail_ID.ID_KPI  
        where 1=1  
       group by ID_QKPI, QKPI_Detail_ID.CNName,QKPI_Detail_ID.EngName`
    );
		
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};
const GetCountDataKPIDetail = async () => {
  try {
    const rs = await db.Execute(config_erp,
      `DECLARE @START VARCHAR(10) =YEAR(GETDATE())
      DECLARE @END VARCHAR(10) = YEAR(GETDATE())
      SET ANSI_NULLS ON
                            SET ANSI_WARNINGS ON
                                 if object_id('tempdb..#LYV_Q_KPI_D') is not null      
                                  begin  drop table #LYV_Q_KPI_D end    
                              SELECT  QKPI_Detail_Factory.ID_QKPI,(isnull(QKPI_Detail_ID.CNName,'')+ '/' + QKPI_Detail_ID.EngName)KPI,QKPI_Detail_Factory.QFactory   
                               ,QKPI_Detail_Factory.Jan,QKPI_Detail_Factory.Feb,QKPI_Detail_Factory.Mar,QKPI_Detail_Factory.Apr,QKPI_Detail_Factory.May   
                               ,QKPI_Detail_Factory.Jun,QKPI_Detail_Factory.Jul,QKPI_Detail_Factory.Aug,QKPI_Detail_Factory.Sep,QKPI_Detail_Factory.Oct   
                               ,QKPI_Detail_Factory.Nov,QKPI_Detail_Factory.Dec,(ISNULL(Jan,0)+ISNULL(Feb,0)+ISNULL(Mar,0)+ISNULL(Apr,0)+ISNULL(May,0)+ISNULL(Jun,0)+ISNULL(Jul,0)+ISNULL(Aug,0)+ISNULL(Sep,0)+ISNULL(Oct,0)+ISNULL(Nov,0)+ISNULL(Dec,0))Total,''YN    
                               INTO #LYV_Q_KPI_D  
                               from QKPI_Detail_Factory   
                               left join QKPI_Detail_ID on QKPI_Detail_Factory.ID_QKPI=QKPI_Detail_ID.ID_KPI   
                               where 1=1   
                              and QKPI_Detail_Factory.QYear Between @START And @END
                              AND QKPI_Detail_Factory.QFactory ='LYV'  
                              order by QKPI_Detail_Factory.QFactory  
                               if object_id('tempdb..#LHG_Q_KPI_D') is not null      
                                  begin  drop table #LHG_Q_KPI_D end    
                              SELECT  QKPI_Detail_Factory.ID_QKPI,(isnull(QKPI_Detail_ID.CNName,'')+ '/' + QKPI_Detail_ID.EngName)KPI,QKPI_Detail_Factory.QFactory   
                               ,QKPI_Detail_Factory.Jan,QKPI_Detail_Factory.Feb,QKPI_Detail_Factory.Mar,QKPI_Detail_Factory.Apr,QKPI_Detail_Factory.May   
                               ,QKPI_Detail_Factory.Jun,QKPI_Detail_Factory.Jul,QKPI_Detail_Factory.Aug,QKPI_Detail_Factory.Sep,QKPI_Detail_Factory.Oct   
                               ,QKPI_Detail_Factory.Nov,QKPI_Detail_Factory.Dec,(ISNULL(Jan,0)+ISNULL(Feb,0)+ISNULL(Mar,0)+ISNULL(Apr,0)+ISNULL(May,0)+ISNULL(Jun,0)+ISNULL(Jul,0)+ISNULL(Aug,0)+ISNULL(Sep,0)+ISNULL(Oct,0)+ISNULL(Nov,0)+ISNULL(Dec,0))Total,''YN    
                              INTO #LHG_Q_KPI_D  
                              FROM LHG.LIY_ERP.DBO.QKPI_Detail_Factory  QKPI_Detail_Factory  
                               left JOIN LHG.LIY_ERP.DBO.QKPI_Detail_ID QKPI_Detail_ID on QKPI_Detail_Factory.ID_QKPI=QKPI_Detail_ID.ID_KPI   
                               where 1=1   
                              and QKPI_Detail_Factory.QYear Between  @START And @END
                              AND QKPI_Detail_Factory.QFactory ='LHG'  
                              order by QKPI_Detail_Factory.QFactory  
                               if object_id('tempdb..#LVL_Q_KPI_D') is not null      
                                  begin  drop table #LVL_Q_KPI_D end    
                              SELECT  QKPI_Detail_Factory.ID_QKPI,(isnull(QKPI_Detail_ID.CNName,'')+ '/' + QKPI_Detail_ID.EngName)KPI,QKPI_Detail_Factory.QFactory   
                               ,QKPI_Detail_Factory.Jan,QKPI_Detail_Factory.Feb,QKPI_Detail_Factory.Mar,QKPI_Detail_Factory.Apr,QKPI_Detail_Factory.May   
                               ,QKPI_Detail_Factory.Jun,QKPI_Detail_Factory.Jul,QKPI_Detail_Factory.Aug,QKPI_Detail_Factory.Sep,QKPI_Detail_Factory.Oct   
                               ,QKPI_Detail_Factory.Nov,QKPI_Detail_Factory.Dec,(ISNULL(Jan,0)+ISNULL(Feb,0)+ISNULL(Mar,0)+ISNULL(Apr,0)+ISNULL(May,0)+ISNULL(Jun,0)+ISNULL(Jul,0)+ISNULL(Aug,0)+ISNULL(Sep,0)+ISNULL(Oct,0)+ISNULL(Nov,0)+ISNULL(Dec,0))Total,''YN    
                              INTO #LVL_Q_KPI_D  
                              FROM QKPI_Detail_Factory  QKPI_Detail_Factory  
                               left JOIN QKPI_Detail_ID QKPI_Detail_ID on QKPI_Detail_Factory.ID_QKPI=QKPI_Detail_ID.ID_KPI   
                               where 1=1   
                              and QKPI_Detail_Factory.QYear Between  @START And @END
                              AND QKPI_Detail_Factory.QFactory ='VB7'  
                              order by QKPI_Detail_Factory.QFactory  
                               if object_id('tempdb..#LYM_Q_KPI_D') is not null      
                                  begin  drop table #LYM_Q_KPI_D end    
                              SELECT  QKPI_Detail_Factory.ID_QKPI,(isnull(QKPI_Detail_ID.CNName,'')+ '/' + QKPI_Detail_ID.EngName)KPI,QKPI_Detail_Factory.QFactory   
                               ,QKPI_Detail_Factory.Jan,QKPI_Detail_Factory.Feb,QKPI_Detail_Factory.Mar,QKPI_Detail_Factory.Apr,QKPI_Detail_Factory.May   
                               ,QKPI_Detail_Factory.Jun,QKPI_Detail_Factory.Jul,QKPI_Detail_Factory.Aug,QKPI_Detail_Factory.Sep,QKPI_Detail_Factory.Oct   
                               ,QKPI_Detail_Factory.Nov,QKPI_Detail_Factory.Dec,(ISNULL(Jan,0)+ISNULL(Feb,0)+ISNULL(Mar,0)+ISNULL(Apr,0)+ISNULL(May,0)+ISNULL(Jun,0)+ISNULL(Jul,0)+ISNULL(Aug,0)+ISNULL(Sep,0)+ISNULL(Oct,0)+ISNULL(Nov,0)+ISNULL(Dec,0))Total,''YN    
                              INTO #LYM_Q_KPI_D  
                              FROM LYM.LIY_ERP.DBO.QKPI_Detail_Factory  QKPI_Detail_Factory  
                               left JOIN LYM.LIY_ERP.DBO.QKPI_Detail_ID QKPI_Detail_ID on QKPI_Detail_Factory.ID_QKPI=QKPI_Detail_ID.ID_KPI   
                               where 1=1   
                              and QKPI_Detail_Factory.QYear Between  @START And @END
                              AND QKPI_Detail_Factory.QFactory ='POL'  
                              order by QKPI_Detail_Factory.QFactory  
                              if object_id('tempdb..#LYG_Q_KPI_M') is not null      
                                  begin  drop table #LYG_Q_KPI_M end   
	 
                              SELECT  * INTO #LYG_Q_KPI_M FROM #LYV_Q_KPI_D  
                              UNION ALL  
                              SELECT  * FROM #LHG_Q_KPI_D  
                              UNION ALL  
                              SELECT  * FROM #LVL_Q_KPI_D  
                              UNION ALL  
                              SELECT  * FROM #LYM_Q_KPI_D  
                              select COUNT(ID_QKPI) Num from  (
                              select ID_QKPI,(isnull(QKPI_Detail_ID.CNName,'') + '/' + QKPI_Detail_ID.EngName)KPI, SUM(isnull(Jan,0))Jan,Sum(isnull(Feb,0))Feb, Sum(isnull(Mar,0))Mar, SUM(isnull(Apr,0))Apr, Sum(isnull(May,0))May,SUM(isnull(Jun,0))Jun 
                              , SUM(isnull(Jul,0))Jul,SUM(isnull(Aug,0))Aug, SUM(isnull(Sep,0))Sep,SUM(isnull(Oct,0))Oct,SUM(isnull(Nov,0))Nov,SUM(isnull(Dec,0))Dec   
                              ,(SUM(isnull(Jan,0)) + Sum(isnull(Feb,0))+Sum(isnull(Mar,0))+ SUM(isnull(Apr,0))+ Sum(isnull(May,0)) + SUM(isnull(Jun,0)) + SUM(isnull(Jul,0)) +   
                              SUM(isnull(Aug,0)) + SUM(isnull(Sep,0)) + SUM(isnull(Oct,0)) + SUM(isnull(Nov,0)) + SUM(isnull(Dec,0)) )Total  
                              from #LYG_Q_KPI_M QKPI_Detail_Factory  
                              left join QKPI_Detail_ID on QKPI_Detail_Factory.ID_QKPI = QKPI_Detail_ID.ID_KPI  
                              where 1=1  
                             group by ID_QKPI, QKPI_Detail_ID.CNName,QKPI_Detail_ID.EngName ) A
      `
    );
		
    return rs.recordset[0] || null;
  } catch (error) {
    return null;
  }
};


