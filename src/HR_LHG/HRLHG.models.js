const db = require("../../connection");
const { config_hris } = require("../../fileconfig");
exports.Get_Manpower_Total = async () => {
  try {
    const rs = await db.Execute(
      config_hris,
      `  DECLARE @SETDATE VARCHAR(20),@STARTDATE VARCHAR(20),@CHECK_START VARCHAR(20),@CHECK_END VARCHAR(20)
      DECLARE @ACTUAL INT, @VACATION INT, @MATERNITY INT, @NO_CHECK INT, @EXPECTED INT, @LEAVE INT 
      SET @STARTDATE = CONVERT(DATE,GETDATE())
      SET @SETDATE =  CONVERT(DATE,GETDATE())
      SET @CHECK_END = DATEADD(DAY, 1,  CONVERT(DATE,GETDATE()))
      SET @CHECK_START = @SETDATE + ' 5:00:00'
      SET @CHECK_END = @CHECK_END + ' 5:00:00' 
      SET @EXPECTED = (SELECT COUNT(Person_ID) FROM  Data_Person 
      WHERE Magneticcard_ID <> '' AND Department_Serial_Key NOT IN ('DP0000000000055','DP0000000000056','DP0000000000079','DP0000000000083','DP0000000000101','DP0000000000104','DP0000000000115','DP0000000000132','DP0000000000487','DP0000000000488','DP0000000000489','DP0000000000490') 
      AND Person_Serial_Key NOT IN (SELECT DP.Person_Serial_Key 
      FROM  Data_Person DP LEFT JOIN Data_Person_Detail DD ON DD.Person_Serial_Key = DP.Person_Serial_Key 
      WHERE Nationality_Serial_Key IN ('S00001','S00009','S00006')) AND CONVERT(DATE,Date_Come_In) <=@SETDATE AND CONVERT(DATE,Date_Work_End) >=@STARTDATE) 
      SET @ACTUAL =(SELECT COUNT(DISTINCT DP.Person_ID) FROM Data_Person DP LEFT JOIN Rec_Check_In_Out RC ON RC.Card_Number = DP.Magneticcard_ID 
      WHERE CONVERT(DATETIME ,Check_Time) > @CHECK_START AND CONVERT(DATETIME ,Check_Time) <= @CHECK_END) SET @VACATION = (SELECT COUNT(Person_ID) FROM  Data_Person WHERE Magneticcard_ID <> ''AND Department_Serial_Key NOT IN ('DP0000000000055','DP0000000000056','DP0000000000079','DP0000000000083','DP0000000000101','DP0000000000104','DP0000000000115','DP0000000000132','DP0000000000487','DP0000000000488','DP0000000000489','DP0000000000490') 
      AND Person_Serial_Key NOT IN (SELECT DP.Person_Serial_Key FROM  Data_Person DP LEFT JOIN Data_Person_Detail DD ON DD.Person_Serial_Key = DP.Person_Serial_Key WHERE Nationality_Serial_Key IN ('S00001','S00009')) 
      AND CONVERT(DATE,Date_Come_In) <=@SETDATE AND CONVERT(DATE,Date_Work_End) >=@STARTDATE AND Person_Serial_Key NOT IN (SELECT DP.Person_Serial_Key FROM Data_Person DP 
      LEFT JOIN Rec_Check_In_Out RC ON RC.Card_Number = DP.Magneticcard_ID WHERE CONVERT(DATETIME ,Check_Time) > @CHECK_START AND CONVERT(DATETIME ,Check_Time) <= @CHECK_END) AND Person_Serial_Key IN (SELECT P.Person_Serial_Key FROM Data_Person P 
      LEFT JOIN Data_Vacation_Detail V ON P.Person_Serial_Key = V.Person_Serial_Key WHERE CONVERT(VARCHAR,@SETDATE,101) BETWEEN  Vacation_From_Date AND Vacation_To_Date)) SET @MATERNITY = (SELECT COUNT(Person_ID) Maternity_Leave FROM Data_Vacation_Detail V  
      LEFT JOIN Data_Person P ON P.Person_Serial_Key = V.Person_Serial_Key WHERE Vacation_Serial_Key ='V000000021' AND CONVERT(VARCHAR,@SETDATE,101) BETWEEN Vacation_From_Date AND Vacation_To_Date AND P.Person_Serial_Key NOT IN(SELECT DP.Person_Serial_Key FROM  Data_Person DP 
      LEFT JOIN Data_Person_Detail DD ON DD.Person_Serial_Key = DP.Person_Serial_Key WHERE Nationality_Serial_Key IN ('S00001','S00009')))
      SET @NO_CHECK = (SELECT COUNT(P.Person_ID) FROM  Data_Person P LEFT JOIN Data_Department DD ON DD.Department_Serial_Key = P.Department_Serial_Key WHERE P.Magneticcard_ID <> '' AND P.Department_Serial_Key NOT IN ('DP0000000000055','DP0000000000056','DP0000000000079','DP0000000000083','DP0000000000101','DP0000000000104','DP0000000000115','DP0000000000132','DP0000000000487','DP0000000000488','DP0000000000489','DP0000000000490')
      AND P.Person_Serial_Key NOT IN (SELECT DP.Person_Serial_Key FROM  Data_Person DP LEFT JOIN Data_Person_Detail DD ON DD.Person_Serial_Key = DP.Person_Serial_Key WHERE Nationality_Serial_Key IN ('S00001','S00009','S00006')) AND CONVERT(DATE,Date_Come_In) <=@SETDATE AND CONVERT(DATE,Date_Work_End) >=@STARTDATE AND P.Person_Serial_Key NOT IN (SELECT Person_Serial_Key FROM Data_Person DP LEFT JOIN Rec_Check_In_Out RC ON RC.Card_Number = DP.Magneticcard_ID 
      WHERE CONVERT(DATETIME ,Check_Time) > @CHECK_START AND CONVERT(DATETIME ,Check_Time) <= @CHECK_END)AND P.Person_Serial_Key NOT IN (SELECT Person_Serial_Key FROM  Data_Person WHERE Magneticcard_ID <> '' AND Department_Serial_Key NOT IN ('DP0000000000055','DP0000000000056','DP0000000000079','DP0000000000083','DP0000000000101','DP0000000000104','DP0000000000115','DP0000000000132','DP0000000000487','DP0000000000488','DP0000000000489','DP0000000000490') AND Person_Serial_Key NOT IN (SELECT DP.Person_Serial_Key FROM  Data_Person DP LEFT JOIN Data_Person_Detail DD ON DD.Person_Serial_Key = DP.Person_Serial_Key 
      WHERE Nationality_Serial_Key IN ('S00001','S00009','S00006')) AND CONVERT(DATE,Date_Come_In) <=@SETDATE AND CONVERT(DATE,Date_Work_End) >=@STARTDATE AND Person_Serial_Key NOT IN (SELECT DP.Person_Serial_Key FROM Data_Person DP LEFT JOIN Rec_Check_In_Out RC ON RC.Card_Number = DP.Magneticcard_ID 
      WHERE CONVERT(DATETIME ,Check_Time) > @CHECK_START AND CONVERT(DATETIME ,Check_Time) <= @CHECK_END) AND Person_Serial_Key IN (SELECT V.Person_Serial_Key FROM Data_Vacation_Detail V WHERE CONVERT(VARCHAR,@SETDATE,101) BETWEEN  Vacation_From_Date AND Vacation_To_Date))
      AND P.Person_Serial_Key NOT IN (SELECT Person_Serial_Key FROM Data_Shift_Register WHERE Shift_Serial_Key IN('S0002','S0003') AND CONVERT(VARCHAR, @SETDATE,101) BETWEEN  Shift_From_Date AND Shift_To_Date))
      SET @LEAVE = (SELECT COUNT(Decided_Serial_Key) AS Qty FROM Data_Decided WHERE Decided_Serial_Key IN('D0011', 'D0012', 'D0013', 'D0014') AND CONVERT(DATE, Applied_Date) >= @SETDATE AND CONVERT(DATE, Applied_Date) <= @SETDATE) 
      --SELECT @SETDATE SetDay, @EXPECTED Expected_Attendence, @ACTUAL Actual_Attendence,@LEAVE Leave_Factory,@VACATION Vacation, @MATERNITY Maternity_Leave, @NO_CHECK No_Check
              --SELECT @SETDATE SetDay, 
              --@EXPECTED - @LEAVE Expected_Attendence,
              --@ACTUAL Actual_Attendence,
              --@LEAVE Leave_Factory,
              --@VACATION No_Check,
              --@MATERNITY Maternity_Leave,
              --@NO_CHECK Vacation,
              --@VACATION + @NO_CHECK + @MATERNITY Today_Absence,
              --'0' Accident_month,
              --'0' Accident_Year
              SELECT @SETDATE SetDay, 
              @EXPECTED - @LEAVE Expected_Attendence,
              @ACTUAL Actual_Attendence,
              @LEAVE Leave_Factory,
              @VACATION No_Check,
              @MATERNITY Maternity_Leave,
              @NO_CHECK Vacation,
              @VACATION + @NO_CHECK + @MATERNITY Today_Absence,ISNULL( Count( Person_Serial_Key),0) Accident_month
,(SELECT ISNULL( Count( Person_Serial_Key)  ,0) Accident_Year FROM Data_Occupational_Accident WHERE  YEAR(Accident_Date) = YEAR(GETDATE())) Accident_year
FROM Data_Occupational_Accident WHERE MONTH(Accident_Date) = MONTH(GETDATE()) and YEAR(Accident_Date) = YEAR(GETDATE())`
    );

    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};

const Get_Value_Accident_MES_TurnOverate = async () => {
  try {
    const rs = await db.Execute(
      config_hris,
      `
        select ISNULL(  SUM (CONVERT(INT, Data_Value,0)),0) Accident_month 
,(select ISNULL(  SUM (CONVERT(INT, Data_Value,0)),0) Accident_Year from Data_Turnover_Rate where Data_Type = 'WI' AND LEFT( Date_Year_Month,4) = YEAR(GETDATE())) Accident_year
from Data_Turnover_Rate where Data_Type = 'WI' AND Date_Year_Month = CONCAT ( YEAR(GETDATE()) , RIGHT(CONCAT('000',MONTH(GETDATE())),2) )
        `
    );
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};
const Get_Value_Accident = async () => {
  try {
    const rs = await db.Execute(
      config_hris,
      `
        SELECT ISNULL( Count( Person_Serial_Key),0) Accident_month
        ,(SELECT ISNULL( Count( Person_Serial_Key)  ,0) Accident_Year FROM Data_Occupational_Accident WHERE  YEAR(Accident_Date) = YEAR(GETDATE())) Accident_year
         FROM Data_Occupational_Accident WHERE MONTH(Accident_Date) = MONTH(GETDATE()) and YEAR(Accident_Date) = YEAR(GETDATE())`
    );
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};
const Get_Manpower_Build_Lean = async (setBuilding) => {
  try {
    const rs = await db.Execute(
      config_hris,
      `
        DECLARE @SETDATE VARCHAR(20),@STARTDATE VARCHAR(20),@CHECK_START VARCHAR(20),@CHECK_END VARCHAR(20) 
        DECLARE @MATERNITY INT, @NO_CHECK INT, @EXPECTED INT, @LEAVE INT ,@Accident int
        DECLARE 
        @START_MONTH VARCHAR(20)= (SELECT CONVERT(VARCHAR(25),DATEADD(dd,-(DAY(GETDATE())-1),GETDATE()),101) AS Date_Value),
        @END_MONTH VARCHAR(20) =(SELECT CONVERT(VARCHAR(25),DATEADD(dd,-(DAY(DATEADD(mm,1,GETDATE()))),DATEADD(mm,1,GETDATE())),101) )

        SET @STARTDATE= CAST(CONCAT(YEAR(GETDATE()), '/', MONTH(GETDATE()), '/01') AS DATE)
        SET @SETDATE= CONVERT(DATE,GETDATE())
        SET @CHECK_END = CONVERT(DATE,GETDATE()+1)
        SET @CHECK_START = @SETDATE + ' 5:00:00'
        SET @CHECK_END = @CHECK_END + ' 5:00:00'
        SET @EXPECTED = (SELECT COUNT(P.Person_ID) FROM  Data_Person P
        LEFT JOIN Data_Department DP ON DP.Department_Serial_Key = P.Department_Serial_Key 
        WHERE P.Magneticcard_ID <> ''  
        AND P.Department_Serial_Key NOT IN ('DP0000000000055','DP0000000000056','DP0000000000079','DP0000000000083','DP0000000000101','DP0000000000104','DP0000000000115','DP0000000000132','DP0000000000487','DP0000000000488','DP0000000000489','DP0000000000490')  AND
        P.Person_Serial_Key NOT IN (SELECT DP.Person_Serial_Key FROM  Data_Person DP LEFT JOIN
        Data_Person_Detail DD ON DD.Person_Serial_Key = DP.Person_Serial_Key
        WHERE Nationality_Serial_Key IN ('S00001','S00009','S00006')) 
        AND CONVERT(DATE,Date_Come_In) <=@SETDATE AND CONVERT(DATE,Date_Work_End) >= @STARTDATE 
        AND DP.Building LIKE "+setBuilding+ @")
        SET @MATERNITY = 
        (SELECT COUNT(Person_ID) Maternity_Leave
        FROM Data_Vacation_Detail V  
        LEFT JOIN Data_Person P ON P.Person_Serial_Key = V.Person_Serial_Key  LEFT JOIN Data_Department DP ON DP.Department_Serial_Key = P.Department_Serial_Key
        WHERE Vacation_Serial_Key ='V000000021' AND 
        CONVERT(VARCHAR,@SETDATE,101) BETWEEN Vacation_From_Date AND Vacation_To_Date AND 
        P.Person_Serial_Key NOT IN(SELECT DP.Person_Serial_Key FROM  Data_Person DP LEFT JOIN Data_Person_Detail DD ON DD.Person_Serial_Key = DP.Person_Serial_Key WHERE Nationality_Serial_Key IN ('S00001','S00009'))
        AND DP.Building LIKE '%${setBuilding}%')
        SET @NO_CHECK = (SELECT COUNT(P.Person_ID) FROM  Data_Person P
        LEFT JOIN Data_Department DD ON DD.Department_Serial_Key = P.Department_Serial_Key
        WHERE P.Magneticcard_ID <> '' 
        AND P.Department_Serial_Key NOT IN ('DP0000000000055','DP0000000000056','DP0000000000079','DP0000000000083','DP0000000000101','DP0000000000104','DP0000000000115','DP0000000000132','DP0000000000487','DP0000000000488','DP0000000000489','DP0000000000490') 
        AND P.Person_Serial_Key NOT IN (SELECT DP.Person_Serial_Key FROM  Data_Person DP 
        LEFT JOIN      Data_Person_Detail DD ON DD.Person_Serial_Key = DP.Person_Serial_Key 
        WHERE Nationality_Serial_Key IN ('S00001','S00009','S00006')) 
        AND CONVERT(DATE,Date_Come_In) <=@SETDATE  
        AND CONVERT(DATE,Date_Work_End) >=@STARTDATE
        AND P.Person_Serial_Key NOT IN (SELECT Person_Serial_Key FROM Data_Person DP LEFT JOIN Rec_Check_In_Out RC ON RC.Card_Number = DP.Magneticcard_ID 
        WHERE CONVERT(DATETIME ,Check_Time) > @CHECK_START AND CONVERT(DATETIME ,Check_Time) <= @CHECK_END)             AND P.Person_Serial_Key NOT IN (SELECT Person_Serial_Key FROM  Data_Person WHERE  
        Magneticcard_ID <> ''  
        AND Department_Serial_Key NOT IN ('DP0000000000055','DP0000000000056','DP0000000000079','DP0000000000083','DP0000000000101','DP0000000000104','DP0000000000115','DP0000000000132','DP0000000000487','DP0000000000488','DP0000000000489','DP0000000000490') 
        AND Person_Serial_Key NOT IN (SELECT DP.Person_Serial_Key FROM  Data_Person DP LEFT JOIN Data_Person_Detail DD ON DD.Person_Serial_Key = DP.Person_Serial_Key WHERE Nationality_Serial_Key IN ('S00001','S00009','S00006')) 
        AND CONVERT(DATE,Date_Come_In) <=@SETDATE AND CONVERT(DATE,Date_Work_End) >=@STARTDATE 
        AND Person_Serial_Key NOT IN (SELECT DP.Person_Serial_Key FROM Data_Person DP LEFT JOIN Rec_Check_In_Out RC ON RC.Card_Number = DP.Magneticcard_ID WHERE CONVERT(DATETIME ,Check_Time) > @CHECK_START AND CONVERT(DATETIME ,Check_Time) <= @CHECK_END) 
        AND Person_Serial_Key IN (SELECT V.Person_Serial_Key FROM Data_Vacation_Detail V WHERE CONVERT(VARCHAR,@SETDATE,101) BETWEEN  Vacation_From_Date AND Vacation_To_Date))  
        AND P.Person_Serial_Key NOT IN (SELECT Person_Serial_Key FROM Data_Shift_Register WHERE Shift_Serial_Key IN('S0002','S0003') AND CONVERT(VARCHAR, @SETDATE,101) BETWEEN  Shift_From_Date AND Shift_To_Date)
        AND DD.Building LIKE '%${setBuilding}%')
        SET @LEAVE = (SELECT COUNT(Decided_Serial_Key) AS Qty FROM Data_Decided DD 
        LEFT JOIN Data_Person P ON DD.Person_Serial_Key = P.Person_Serial_Key
        LEFT JOIN Data_Department DP ON DP.Department_Serial_Key = P.Department_Serial_Key
        WHERE Decided_Serial_Key IN('D0011', 'D0012', 'D0013', 'D0014') AND CONVERT(DATE, Applied_Date) >= @SETDATE AND CONVERT(DATE, Applied_Date) <= @SETDATE
        AND DP.Building LIKE '%${setBuilding}%')
       /* SET @Accident = ( SELECT COUNT(Person_ID) FROM  Data_Person LEFT JOIN Data_Department D ON Data_Person.Department_Serial_Key = D.Department_Serial_Key
         WHERE Magneticcard_ID <> ''AND D.Department_Serial_Key NOT IN ('DP0000000000055','DP0000000000056','DP0000000000079','DP0000000000083','DP0000000000101','DP0000000000104','DP0000000000115','DP0000000000132','DP0000000000487','DP0000000000488','DP0000000000489','DP0000000000490') 
            AND D.Building LIKE '%${setBuilding}%'

                    AND Person_Serial_Key NOT IN (SELECT DP.Person_Serial_Key FROM  Data_Person DP LEFT JOIN Data_Person_Detail DD ON DD.Person_Serial_Key = DP.Person_Serial_Key										
                    WHERE Nationality_Serial_Key IN ('S00001','S00009')) 
                    AND CONVERT(DATE,Date_Come_In) <=@CHECK_START AND CONVERT(DATE,Date_Work_End) >=@CHECK_START AND Person_Serial_Key NOT IN (SELECT DP.Person_Serial_Key FROM Data_Person DP 
                    LEFT JOIN Rec_Check_In_Out RC ON RC.Card_Number = DP.Magneticcard_ID WHERE CONVERT(DATETIME ,Check_Time) > @CHECK_START AND CONVERT(DATETIME ,Check_Time) <= @CHECK_END)
                    
                    AND Person_Serial_Key IN (SELECT P.Person_Serial_Key
                                                FROM Data_Person P 
                                                LEFT JOIN Data_Vacation_Detail V ON P.Person_Serial_Key = V.Person_Serial_Key
                                                WHERE  Vacation_Serial_Key ='V000000015' AND Vacation_From_Date BETWEEN @START_MONTH AND @END_MONTH
                                                )
                                                GROUP BY D.Department_Serial_Key)*/
        SET @Accident = (	SELECT COUNT(Person_Serial_Key) FROM Data_Occupational_Accident WHERE CONVERT(DATE,Accident_Date) BETWEEN @START_MONTH AND @END_MONTH
                AND Person_Serial_Key IN (SELECT Person_Serial_Key FROM Data_Person P LEFT JOIN Data_Department D ON P.Department_Serial_Key = D.Department_Serial_Key WHERE D.Building LIKE '%${setBuilding}%'))

                                                
        SELECT  
        @EXPECTED ExpectedAttendence,
        @LEAVE LeaveFactory,
        @MATERNITY MaternityLeave, 
        @NO_CHECK Absence,
        @Accident Accident
        `
    );
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};

exports.Get_Manpower_Build_Lean_Detail = async (setBuilding) => {
  try {
    // let query='';
    // if(setBuilding.includes('A')){
    //     query=`('A_G01','A_M01','A_G02','A_M02','A_G03','A_M03','A_G04','A_M04','A_G05','A_M05','A_G06','A_M06','A_G07','A_M07','A_G08','A_M08','A_G09','A_M09','A_G10','A_M10','A_G11','A_M11','A_G12','A_M12','A_G13','A_M13','A_G14','A_M14','A_G15','A_M15','A_G16','A_M16')`;
    // }else if(setBuilding.includes('B')){
    //     query=`('B_G01','B_M01','B_G02','B_M02','B_G03','B_M03','B_G04','B_M04','B_G05','B_M05','B_G06','B_M06','B_G07','B_M07','B_G08','B_M08','B_G09','B_M09','B_G10','B_M10','B_G11','B_M11','B_G12','B_M12','B_G13','B_M13')`;
    // }else if(setBuilding.includes('C')){
    //     query=`('C_G01','C_M01','C_G02','C_M02','C_G03','C_M03','C_G04','C_M04','C_G05','C_M05','C_G06','C_M06','C_G07','C_M07')`;
    // }else if(setBuilding.includes('D')){
    //     query=`('D3_G01','D3_M01','D3_G02','D3_M02','D3_G03','D3_M03','D3_G04','D3_M04','D3_G05','D3_M05','D3_G06','D3_M06','D3_G07','D3_M07','D3_G08','D3_M08','D3_G09','D3_M09','D3_G10','D3_M10','D3_G11','D3_M11','D3_G12','D3_M12','D3_G13','D3_M13','D3_G14','D3_M14','D3_G15','D3_M15','D3_G16','D3_M16')`;
    // }else if(setBuilding.includes('R2')){
    //     query=`('GCD_UV','GCD_C1','GCD_C2','GCD_C3','GCD_C4','GCD_C5','GCD_C6','GCD_C10','GCD_C11','GCD_C12','GCD_C13','GCD_C14','GCD_C15','GCD_C16','GCD_C17','GCD_C18','GCD_C19','GCD_MAIDE')`;
    // }else if(setBuilding.includes('R1')){
    //     query=`('VANMALUC','CCS','KTCCS_XD','LHG_KTD','CBLD')`;
    // }
    const rs = await db.Execute(
      config_hris,
      `
      DECLARE @SETDATE VARCHAR(20),@STARTDATE VARCHAR(20),@CHECK_START VARCHAR(20),@CHECK_END VARCHAR(20) 
      DECLARE @MATERNITY INT, @NO_CHECK INT, @EXPECTED INT, @LEAVE INT
      SET @STARTDATE = '"+SetDay.ToString("yyyy/MM/")+ @"' + '1'
      SET @SETDATE = '" + SetDay.ToString("yyyy/MM/dd") + @"'
      SET @CHECK_END = DATEADD(DAY, 1, '" + SetDay.ToString("yyyy/MM/dd") + @"')
      SET @CHECK_START = @SETDATE + ' 5:00:00'
      SET @CHECK_END = @CHECK_END + ' 5:00:00'
    SELECT A.Department_ID Name, 
          ISNULL(ExpectedAttendence, 0)ExpectedAttendence,
          ISNULL(LeaveFactory, 0)LeaveFactory,
          ISNULL(Absence, 0)Absence,
          ISNULL(Maternity_Leave, 0)MaternityLeave
    FROM(SELECT COUNT(P.Person_ID) ExpectedAttendence, Department_ID FROM  Data_Person P
      LEFT JOIN Data_Department DP ON DP.Department_Serial_Key = P.Department_Serial_Key
      WHERE P.Magneticcard_ID <> ''
      AND P.Department_Serial_Key NOT IN ('DP0000000000055','DP0000000000056','DP0000000000079','DP0000000000083','DP0000000000101','DP0000000000104','DP0000000000115','DP0000000000132','DP0000000000487','DP0000000000488','DP0000000000489','DP0000000000490')  AND
      P.Person_Serial_Key NOT IN(SELECT DP.Person_Serial_Key FROM  Data_Person DP LEFT JOIN
      Data_Person_Detail DD ON DD.Person_Serial_Key = DP.Person_Serial_Key
      WHERE Nationality_Serial_Key IN('S00001', 'S00009', 'S00006'))
      AND CONVERT(DATE, Date_Come_In) <= @SETDATE AND CONVERT(DATE, Date_Work_End) >= @STARTDATE
      AND DP.Department_ID IN " + setBuilding+ @"
      GROUP BY Department_ID) A
      LEFT JOIN
      (SELECT COUNT(Person_ID) Maternity_Leave, Department_ID
      FROM Data_Vacation_Detail V
      LEFT JOIN Data_Person P ON P.Person_Serial_Key = V.Person_Serial_Key  LEFT JOIN Data_Department DP ON DP.Department_Serial_Key = P.Department_Serial_Key
      WHERE Vacation_Serial_Key = 'V000000021' AND
      CONVERT(VARCHAR, @SETDATE, 101) BETWEEN Vacation_From_Date AND Vacation_To_Date AND
      P.Person_Serial_Key NOT IN(SELECT DP.Person_Serial_Key FROM  Data_Person DP LEFT JOIN Data_Person_Detail DD ON DD.Person_Serial_Key = DP.Person_Serial_Key WHERE Nationality_Serial_Key IN('S00001', 'S00009'))
      AND DP.Department_ID IN ${query}
      GROUP BY Department_ID) B
      ON A.Department_ID = B.Department_ID
      LEFT JOIN
      (SELECT COUNT(P.Person_ID) Absence, Department_ID FROM  Data_Person P
      LEFT JOIN Data_Department DD ON DD.Department_Serial_Key = P.Department_Serial_Key
      WHERE P.Magneticcard_ID<> ''
      AND P.Department_Serial_Key NOT IN ('DP0000000000055','DP0000000000056','DP0000000000079','DP0000000000083','DP0000000000101','DP0000000000104','DP0000000000115','DP0000000000132','DP0000000000487','DP0000000000488','DP0000000000489','DP0000000000490') 
      AND P.Person_Serial_Key NOT IN(SELECT DP.Person_Serial_Key FROM  Data_Person DP
      LEFT JOIN      Data_Person_Detail DD ON DD.Person_Serial_Key = DP.Person_Serial_Key
      WHERE Nationality_Serial_Key IN('S00001', 'S00009', 'S00006'))
      AND CONVERT(DATE, Date_Come_In) <= @SETDATE
      AND CONVERT(DATE, Date_Work_End) >= @STARTDATE
      AND P.Person_Serial_Key NOT IN(SELECT Person_Serial_Key FROM Data_Person DP LEFT JOIN Rec_Check_In_Out RC ON RC.Card_Number = DP.Magneticcard_ID
      WHERE CONVERT(DATETIME, Check_Time) > @CHECK_START AND CONVERT(DATETIME, Check_Time) <= @CHECK_END)             AND P.Person_Serial_Key NOT IN(SELECT Person_Serial_Key FROM  Data_Person WHERE
      Magneticcard_ID <> ''
      AND Department_Serial_Key NOT IN ('DP0000000000055','DP0000000000056','DP0000000000079','DP0000000000083','DP0000000000101','DP0000000000104','DP0000000000115','DP0000000000132','DP0000000000487','DP0000000000488','DP0000000000489','DP0000000000490') 
      AND Person_Serial_Key NOT IN(SELECT DP.Person_Serial_Key FROM  Data_Person DP LEFT JOIN Data_Person_Detail DD ON DD.Person_Serial_Key = DP.Person_Serial_Key WHERE Nationality_Serial_Key IN('S00001', 'S00009', 'S00006'))
      AND CONVERT(DATE, Date_Come_In) <= @SETDATE AND CONVERT(DATE, Date_Work_End) >= @STARTDATE
      AND Person_Serial_Key NOT IN(SELECT DP.Person_Serial_Key FROM Data_Person DP LEFT JOIN Rec_Check_In_Out RC ON RC.Card_Number = DP.Magneticcard_ID WHERE CONVERT(DATETIME, Check_Time) > @CHECK_START AND CONVERT(DATETIME, Check_Time) <= @CHECK_END)
      AND Person_Serial_Key IN(SELECT V.Person_Serial_Key FROM Data_Vacation_Detail V WHERE CONVERT(VARCHAR, @SETDATE, 101) BETWEEN  Vacation_From_Date AND Vacation_To_Date))
      AND P.Person_Serial_Key NOT IN(SELECT Person_Serial_Key FROM Data_Shift_Register WHERE Shift_Serial_Key IN('S0002', 'S0003') AND CONVERT(VARCHAR, @SETDATE, 101) BETWEEN  Shift_From_Date AND Shift_To_Date)
      AND DD.Department_ID IN ${query}
      GROUP BY Department_ID) C
      ON A.Department_ID = C.Department_ID
      LEFT JOIN(
      SELECT COUNT(Decided_Serial_Key) AS LeaveFactory, Department_ID FROM Data_Decided DD
      LEFT JOIN Data_Person P ON DD.Person_Serial_Key = P.Person_Serial_Key
      LEFT JOIN Data_Department DP ON DP.Department_Serial_Key = P.Department_Serial_Key
      WHERE Decided_Serial_Key IN('D0011', 'D0012', 'D0013', 'D0014') AND CONVERT(DATE, Applied_Date) >= @SETDATE AND CONVERT(DATE, Applied_Date) <= @SETDATE
      AND DP.Department_ID IN ${query}
      GROUP BY Department_ID) D
      ON A.Department_ID = C.Department_ID
    `
    );
    return rs.recordset || null;
  } catch (error) {
    return null;
  }
};

const Get_Manpower_Last_Month = async () => {
  try {
    const rs = await db.Execute(
      config_hris,
      `DECLARE @ExpectedAttendence INT, @LeaveFactory INT, @LastMonth INT, @MaternityLeave INT

            SET @ExpectedAttendence = (SELECT COUNT(Person_ID) Expected_Attendance 
            FROM Data_Person  WHERE Date_Come_In <= CONVERT(VARCHAR(25),DATEADD(dd,-(DAY(GETDATE())),GETDATE()),101)
            AND Date_Work_End > CONVERT(VARCHAR(25),DATEADD(M,-1,DATEADD(MM, DATEDIFF(MM,0,GETDATE()), 0)),101) )

            SET @LeaveFactory = (SELECT COUNT(Person_ID) Resignation --leave
            FROM Data_Person P
            LEFT JOIN Data_Department D ON P.Department_Serial_Key = D.Department_Serial_Key
            LEFT JOIN Data_Decided T ON P.Person_Serial_Key = T.Person_Serial_Key
            WHERE   Decided_Serial_Key IN('D0011', 'D0012', 'D0013', 'D0014') 
            AND Applied_Date BETWEEN Convert(varchar(25),DATEADD(MM,-1, DATEADD(MM,DATEDIFF(mm,0,getdate()),0)),101) 
            and CONVERT(VARCHAR(25),DATEADD(dd,-(DAY(GETDATE())),GETDATE()),101) )

            SET @MaternityLeave = (SELECT COUNT(Person_ID) Maternity_Leave  
            FROM Data_Vacation_Detail V  LEFT JOIN Data_Person P  
            ON P.Person_Serial_Key = V.Person_Serial_Key  
            WHERE  Vacation_Serial_Key ='V000000021' and  CONVERT(VARCHAR(25),DATEADD(dd,-(DAY(getdate())),getdate()),101) BETWEEN Vacation_From_Date AND Vacation_To_Date)

            SET @LastMonth = @ExpectedAttendence - @LeaveFactory --- @MaternityLeave

            SELECT  @ExpectedAttendence ExpectedAttendence
                    ,@LeaveFactory LeaveFactory
                    ,@LastMonth LastMonth
                    ,@MaternityLeave MaternityLeave`
    );

    const data = rs.recordset;
    const newData = data.map((item, index) => {
      const newTurnoverRate =
        item.ExpectedAttendence === 0
          ? 0
          : item.LeaveFactory / item.ExpectedAttendence;
      const newLastMonth = item.ExpectedAttendence === 0 ? 0 : item.LastMonth;
      const newMaternityLeave =
        item.ExpectedAttendence === 0 ? 0 : item.MaternityLeave;

      return {
        ...item,
        newTurnoverRate: newTurnoverRate,
        newLastMonth: newLastMonth,
        newMaternityLeave: newMaternityLeave,
      };
    });
    return newData || null;
  } catch (error) {
    return null;
  }
};
const Get_Manpower_Month = async (date) => {
  try {
    const rs = await db.Execute(
      config_hris,
      `DECLARE @CHECK_START VARCHAR(50)= CONVERT(DATE,'${date}'),
            --DECLARE @MYDATE DATETIME = GETDATE(),
            @STARTDATE VARCHAR(20)= (SELECT CONVERT(VARCHAR(25),DATEADD(dd,-(DAY(GETDATE())-1),GETDATE()),101) AS Date_Value),
            @ENDDATE VARCHAR(20) =(SELECT CONVERT(VARCHAR(25),DATEADD(dd,-(DAY(DATEADD(mm,1,GETDATE()))),DATEADD(mm,1,GETDATE())),101) ),
            @CHECK_END VARCHAR(20),@Accident_Month INT, @Accident_Year INT
            SET @CHECK_START = @CHECK_START + ' 5:00:00'
            SET @CHECK_END = DATEADD(DAY, 1, @CHECK_START)
            SET @CHECK_END = @CHECK_END + ' 5:00:00'
                SET @Accident_Month = (
                SELECT COUNT(Person_ID) FROM  Data_Person WHERE Magneticcard_ID <> ''AND Department_Serial_Key NOT IN ('DP0000000000055','DP0000000000056','DP0000000000079','DP0000000000083','DP0000000000101','DP0000000000104','DP0000000000115','DP0000000000132','DP0000000000487','DP0000000000488','DP0000000000489','DP0000000000490') 
            AND Person_Serial_Key NOT IN (SELECT DP.Person_Serial_Key FROM  Data_Person DP LEFT JOIN Data_Person_Detail DD ON DD.Person_Serial_Key = DP.Person_Serial_Key WHERE Nationality_Serial_Key IN ('S00001','S00009')) 
            AND CONVERT(DATE,Date_Come_In) <=@CHECK_START AND CONVERT(DATE,Date_Work_End) >=@CHECK_START AND Person_Serial_Key NOT IN (SELECT DP.Person_Serial_Key FROM Data_Person DP 
            LEFT JOIN Rec_Check_In_Out RC ON RC.Card_Number = DP.Magneticcard_ID WHERE CONVERT(DATETIME ,Check_Time) > @CHECK_START AND CONVERT(DATETIME ,Check_Time) <= @CHECK_END)
            AND Person_Serial_Key IN (SELECT P.Person_Serial_Key
                                        FROM Data_Person P 
                                        LEFT JOIN Data_Vacation_Detail V ON P.Person_Serial_Key = V.Person_Serial_Key
                                        WHERE  Vacation_Serial_Key ='V000000015' AND Vacation_From_Date BETWEEN @STARTDATE AND @ENDDATE))

                                        SELECT @Accident_Month Accident_month--, @Accident_Year Accident_year `
    );
    return rs.recordset[0].Accident_month || null;
  } catch (error) {
    return null;
  }
};
const Get_Manpower_Over_Time= async (date)=>{
    try {
        const rs = await db.Execute(
          config_hris,`DECLARE @DAY VARCHAR(20) =CONVERT(DATE,'${date}'),@REMOVE_CHECK_IN BIT = 0, @REMOVE_CHECK_OUT BIT = 0, @TIME_OUT_CHC VARCHAR(20), @QTY_TOTAL INT,@QTY_CHC INT 
          SET @TIME_OUT_CHC = '16:45:59'
          IF OBJECT_ID('tempdb..#Overtime') IS NOT NULL DROP TABLE #Overtime
          SELECT	P.Person_Serial_Key, S.Shift_Serial_key, Card_Number,
                      CASE WHEN @REMOVE_CHECK_IN = 1 THEN '' ELSE ISNULL((SELECT MIN(Check_Time) FROM Rec_Check_In_Out RCIO WHERE RCIO.Card_Number = WT.Card_Number AND CONVERT(DATE, Check_Time) = @DAY), '') END RAW_CHECK_IN,

                      CASE WHEN @REMOVE_CHECK_OUT = 1 THEN '' ELSE ISNULL((SELECT MAX(Check_Time) FROM Rec_Check_In_Out RCIO WHERE RCIO.Card_Number = WT.Card_Number AND Check_Time BETWEEN @DAY AND DATEADD(HH, 5, CONVERT(datetime,@DAY) +''+ CONVERT(varchar,Finish_Time,114))), '')END RAW_CHECK_OUT
              INTO #Overtime		
              FROM	Data_Person P, Data_Work_Time WT, Data_Shift S
              WHERE	P.Person_Serial_Key = WT.Person_Serial_Key
                      AND WT.Shift_Serial_key = S.Shift_Serial_Key
                      AND Check_Day = @DAY
                      AND CONVERT(TIME, Start_Time) < CONVERT(TIME, Finish_Time)
                      AND Is_Lock = 0

              SET @QTY_TOTAL = (SELECT COUNT(Person_Serial_Key) FROM #Overtime)

              SET @QTY_CHC = (SELECT COUNT(Person_Serial_Key) FROM #Overtime WHERE CONVERT(TIME,RAW_CHECK_OUT) < @TIME_OUT_CHC)

              SELECT @QTY_TOTAL - @QTY_CHC qty_overtime`);

          return rs.recordset || null;
        } catch (error) {
          return null;
        }
}