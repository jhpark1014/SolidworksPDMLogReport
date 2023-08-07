-- function user department-------------------------------------------------------------------
SELECT dbo.GetDepartment('ch.jung');

--DROP FUNCTION dbo.GetDepartment;

CREATE FUNCTION GetDepartment( @user_name NVARCHAR(MAX) )
	RETURNS NVARCHAR(100)  	
	AS BEGIN
		DECLARE @returnValue NVARCHAR(100) = ''
		
		select @returnValue = g.Groupname 
		from users u, groupmembers gm,  groups g
		where u.username = @user_name and u.UserID = gm.UserID 
			and gm.GroupID <> 2 and gm.GroupID = g.GroupID
		
	RETURN @returnValue
END
;


-- function user name-------------------------------------------------------------------
SELECT dbo.GetUsername('ch.jung');

--DROP FUNCTION dbo.GetUsername;

CREATE FUNCTION GetUsername( @user_id NVARCHAR(MAX) )
	RETURNS NVARCHAR(100) 	
	AS BEGIN
		DECLARE @returnValue NVARCHAR(100) = @user_id
		
		select @returnValue = u.FullName
		from users u
		where u.username = @user_id
		
	RETURN @returnValue
END
;


-- function license Hold Qty-------------------------------------------------------------------
SELECT dbo.GetLicHoldQty('swepdm_cadeditorandweb', '2023-06-30 23:59:59:999');

--DROP FUNCTION dbo.GetLicHoldQty;

CREATE FUNCTION GetLicHoldQty( @lic_name NVARCHAR(MAX), @end_date NVARCHAR(MAX) )
	RETURNS NVARCHAR(5) 	
	AS BEGIN
		DECLARE @returnValue NVARCHAR(5)
		
		select TOP 1 @returnValue = TOTAL_SUM
		from SK_LICENSE_TRACE
		where PRODUCT = @lic_name 
			and CREATE_DATE < @end_date
		order by CREATE_DATE desc
		
	RETURN @returnValue
END
;


-- function get parameters  -------------------------------------------------------------------
--DROP FUNCTION dbo.GetParameters;

select * from dbo.GetParameters('time', '2023-07-01 13');

CREATE FUNCTION GetParameters( @SEARCH_TYPE NVARCHAR(MAX), @SEARCH_DATE NVARCHAR(MAX) )
	RETURNS @returnTable TABLE 
	(
		DATE_TYPE nvarchar(MAX),
		START_DATE nvarchar(MAX),
		END_DATE nvarchar(MAX),
		COLUMNS nvarchar(MAX)
	)
	AS BEGIN
			
	DECLARE @DATE_TYPE     	NVARCHAR(MAX) = ''
	DECLARE @START_DATE     NVARCHAR(MAX) = ''
	DECLARE @END_DATE     	NVARCHAR(MAX) = ''
	DECLARE @COLUMNS 		NVARCHAR(MAX) = ''
	
	DECLARE @i 				INT = 0
	DECLARE @LAST_COL 		INT = 0
	
	IF (@SEARCH_TYPE = 'time')			--시 단위
	BEGIN 
		SET @DATE_TYPE = 'HOUR'
		SET @START_DATE = @SEARCH_DATE + ':00:00.001'
		SET @END_DATE = @SEARCH_DATE + ':59:59.999'
		SET @LAST_COL = DATEPART(HOUR, @END_DATE)
						
		WHILE(@i <= @LAST_COL)
		BEGIN			
			SET @COLUMNS = @COLUMNS + '[' + CONVERT(NVARCHAR(2), @i) + '],'
			SET @i = @i + 1
		END
	END
	IF (@SEARCH_TYPE = 'day')			--일 단위
	BEGIN 
		SET @DATE_TYPE = 'HOUR'
		SET @START_DATE = @SEARCH_DATE + ' 00:00:00.001'
		SET @END_DATE = @SEARCH_DATE + ' 23:59:59.999'
		SET @LAST_COL = DATEPART(HOUR, @END_DATE)
						
		WHILE(@i <= @LAST_COL)
		BEGIN			
			SET @COLUMNS = @COLUMNS + '[' + CONVERT(NVARCHAR(2), @i) + '],'
			SET @i = @i + 1
		END
	END
	ELSE IF (@SEARCH_TYPE = 'month')	--월 단위
	BEGIN
		SET @DATE_TYPE = 'DAY'
		SET @START_DATE = @SEARCH_DATE + '-01 00:00:00.001'
		SET @END_DATE = CONVERT(VARCHAR, EOMONTH(@START_DATE)) + ' 23:59:59.999'
		SET @LAST_COL = DATEPART(DAY, @END_DATE)
		
		WHILE(@i < @LAST_COL)
		BEGIN
			SET @i = @i + 1
			SET @COLUMNS = @COLUMNS + '[' + CONVERT(NVARCHAR(2), @i) + '],'
		END
	END
	ELSE IF (@SEARCH_TYPE = 'year')		-- 년 단위
	BEGIN
		SET @DATE_TYPE = 'MONTH'
		SET @START_DATE = @SEARCH_DATE + '-01-01 00:00:00.001'		
		SET @END_DATE = @SEARCH_DATE + '-12-31 23:59:59.999'					
		SET @LAST_COL = DATEPART(MONTH, @END_DATE)
		
		WHILE(@i < @LAST_COL)
		BEGIN
			SET @i = @i + 1
			SET @COLUMNS = @COLUMNS + '[' + CONVERT(NVARCHAR(2), @i) + '],'
		END				
	END
		

	INSERT @returnTable (DATE_TYPE, START_DATE, END_DATE, COLUMNS)
		VALUES (@DATE_TYPE, @START_DATE, @END_DATE, @COLUMNS);

	RETURN 

END;


-- function get parameters  -------------------------------------------------------------------
--DROP FUNCTION dbo.GetParametersForRange;

select * from dbo.GetParametersForRange('2023-07-01', '2023-07-10');

CREATE FUNCTION GetParametersForRange( @SEARCH_START_DATE NVARCHAR(MAX), @SEARCH_END_DATE NVARCHAR(MAX) )
	RETURNS @returnTable TABLE 
	(
		DATE_TYPE nvarchar(MAX),
		START_DATE nvarchar(MAX),
		END_DATE nvarchar(MAX),
		COLUMNS nvarchar(MAX)
	)
	AS BEGIN
			
	DECLARE @DATE_TYPE     	NVARCHAR(MAX) = ''
	DECLARE @START_DATE     NVARCHAR(MAX) = ''
	DECLARE @END_DATE     	NVARCHAR(MAX) = ''
	DECLARE @COLUMNS 		NVARCHAR(MAX) = ''
	
	DECLARE @i 				INT = 0
	DECLARE @LAST_COL 		INT = 0
		
	IF (@SEARCH_START_DATE <> '' and @SEARCH_END_DATE <> '')
	BEGIN		
		SET @DATE_TYPE = 'DAY'
		SET @START_DATE = @SEARCH_START_DATE + ' 00:00:00.001'
		SET @END_DATE = @SEARCH_END_DATE + ' 23:59:59.999'
		SET @COLUMNS = '[' + @SEARCH_START_DATE + ' ~ ' + @SEARCH_END_DATE + ']'				
	END
	
	insert @returnTable (DATE_TYPE, START_DATE, END_DATE, COLUMNS)
		values (@DATE_TYPE, @START_DATE, @END_DATE, @COLUMNS);

	RETURN 

END;




-- function download log Query -------------------------------------------------------------------
SELECT dbo.GetDownloadLogQuery('DETAIL', 'DAY', '2023-07-13 00:00:00:001', '2023-07-13 23:59:59:999', 'jm.ko');

--DROP FUNCTION dbo.GetDownloadLogQuery;
	
CREATE FUNCTION GetDownloadLogQuery( @SELECT_TYPE NVARCHAR(MAX), @DATE_TYPE NVARCHAR(MAX), @START_DATE NVARCHAR(MAX), @END_DATE NVARCHAR(MAX), @USER_ID NVARCHAR(MAX), @EXC_USER_ID NVARCHAR(MAX) )
	RETURNS NVARCHAR(MAX) 	
	AS BEGIN		
		DECLARE @SQL     		NVARCHAR(MAX) = ''
		DECLARE @EXSQL     		NVARCHAR(MAX) = ''
		DECLARE @SELECT     	NVARCHAR(MAX) = ''
		
		-- select
		IF (@SELECT_TYPE = 'DETAIL')
			SET @SELECT = 'CONVERT(CHAR(19), Q.CREDATE, 120) as datetime, D.Filename as filename, R.RevNr as version, CONCAT(FORMAT(CEILING(R.filesize/ 1024.0), N''#,0''), '' KB'') as filesize'
		ELSE
			SET @SELECT = 'DATEPART('+ @DATE_TYPE +', dateadd(HOUR, 9, Q.CREDATE)) as date, U.username as user_id, U.FullName as user_name, dbo.GetDepartment(U.username) as department, 1 as CNT'
			
		-- where add
		IF (@USER_ID <> 'All')
			SET @EXSQL = ' and U.username = ''' + @USER_ID + ''''		
		IF (@EXC_USER_ID <> '')
			SET @EXSQL = @EXSQL + 'and U.username not in (' + @EXC_USER_ID + ')'
			
		SET @SQL = ' 
				select ' + @SELECT +'					
				from SK_QUEUE_LOG Q, users U, documents D, revisions R
				where Q.USERID = U.UserID and Q.DOCID = D.DocumentID and D.DocumentID = R.DocumentID and D.ObjectTypeID = 1
				  and R.RevNr = (select max(RR.RevNr) from revisions RR where RR.DocumentID = D.DocumentID group by RR.DocumentID)
				  and dateadd(HOUR, 9, Q.CREDATE) between ''' + @START_DATE + ''' and ''' + @END_DATE + '''
				  ' + @EXSQL + '		  				
		'
	RETURN @SQL
END
;


-- function newcreate log Query -------------------------------------------------------------------
SELECT dbo.GetNewcreateLogQuery('DETAIL', 'DAY', '2023-07-01 00:00:00:001', '2023-07-31 23:59:59:999', 'jm.ko');

--DROP FUNCTION dbo.GetNewcreateLogQuery;
	
CREATE FUNCTION GetNewcreateLogQuery( @SELECT_TYPE NVARCHAR(MAX), @DATE_TYPE NVARCHAR(MAX), @START_DATE NVARCHAR(MAX), @END_DATE NVARCHAR(MAX), @USER_ID NVARCHAR(MAX), @EXC_USER_ID NVARCHAR(MAX) )
	RETURNS NVARCHAR(MAX) 	
	AS BEGIN		
		DECLARE @SQL     		NVARCHAR(MAX) = ''
		DECLARE @EXSQL     		NVARCHAR(MAX) = ''
		DECLARE @SELECT     	NVARCHAR(MAX) = ''
		
		-- select
		IF (@SELECT_TYPE = 'DETAIL')
			SET @SELECT = 'CONVERT(CHAR(19), R.date, 120) as datetime, D.Filename as filename, R.RevNr as version, CONCAT(FORMAT(CEILING(R.filesize/ 1024.0), N''#,0''), '' KB'') as filesize'
		ELSE
			SET @SELECT = 'DATEPART('+ @DATE_TYPE +', dateadd(HOUR, 9, R.date)) as logDate, U.username as user_id, U.FullName as user_name, dbo.GetDepartment(U.username) as department, 1 as CNT'
			
		-- where add
		IF (@USER_ID <> 'All')
			SET @EXSQL = 'and U.username = ''' + @USER_ID + ''''
		IF (@EXC_USER_ID <> '')
			SET @EXSQL = @EXSQL + 'and U.username not in (' + @EXC_USER_ID + ')'
			
		SET @SQL = ' 
				select ' + @SELECT +'					
				from revisions R, users U, documents D
				where R.revnr = 1 and R.userid = U.UserID and D.DocumentID = R.DocumentID and D.ObjectTypeID = 1
  				and dateadd(HOUR, 9, R.date) between ''' + @START_DATE + ''' and ''' + @END_DATE + '''
				  	' + @EXSQL + '		  				
		'
	RETURN @SQL
END
;


-- function versionup log Query -------------------------------------------------------------------
select dbo.GetVersionupLogQuery('LIST', 'day', '2023-07-01 00:00:00:001', '2023-07-31 23:59:59:999', 'All');

--DROP FUNCTION dbo.GetVersionupLogQuery;
	
CREATE FUNCTION GetVersionupLogQuery( @SELECT_TYPE NVARCHAR(MAX), @DATE_TYPE NVARCHAR(MAX), @START_DATE NVARCHAR(MAX), @END_DATE NVARCHAR(MAX), @USER_ID NVARCHAR(MAX), @EXC_USER_ID NVARCHAR(MAX)  )
	RETURNS NVARCHAR(MAX) 	
	AS BEGIN		
		DECLARE @SQL     		NVARCHAR(MAX) = ''
		DECLARE @EXSQL     		NVARCHAR(MAX) = ''
		DECLARE @SELECT     	NVARCHAR(MAX) = ''
		
		-- select
		IF (@SELECT_TYPE = 'DETAIL')
			SET @SELECT = 'CONVERT(CHAR(19), R.date, 120) as datetime, D.Filename as filename, R.RevNr as version, CONCAT(FORMAT(CEILING(R.filesize/ 1024.0), N''#,0''), '' KB'') as filesize'
		ELSE
			SET @SELECT = 'DATEPART('+ @DATE_TYPE +', dateadd(HOUR, 9, R.date)) as logDate, U.username as user_id, U.FullName as user_name, dbo.GetDepartment(U.username) as department, 1 as CNT'
			
		-- where add
		IF (@USER_ID <> 'All')
			SET @EXSQL = 'and U.username = ''' + @USER_ID + ''''
		IF (@EXC_USER_ID <> '')
			SET @EXSQL = @EXSQL + 'and U.username not in (' + @EXC_USER_ID + ')'
			
		SET @SQL = ' 
				select ' + @SELECT +'					
				from revisions R, users U, documents D
				where R.userid = U.UserID and D.DocumentID = R.DocumentID and D.ObjectTypeID = 1
  				and dateadd(HOUR, 9, R.date) between ''' + @START_DATE + ''' and ''' + @END_DATE + '''
				  	' + @EXSQL + '		  				
		'
	RETURN @SQL
END
;
 				 				
				
-- function engchange log Query -------------------------------------------------------------------
select dbo.GetEngchangeLogQuery('LIST', 'day', '2023-01-01 00:00:00:001', '2023-01-31 23:59:59:999', 'All', '');
select dbo.GetEngchangeLogQuery('DETAIL', 'day', '2023-01-01 00:00:00:001', '2023-01-31 23:59:59:999', 'All', '');

--DROP FUNCTION dbo.GetEngchangeLogQuery;
	
CREATE FUNCTION GetEngchangeLogQuery( @SELECT_TYPE NVARCHAR(MAX), @DATE_TYPE NVARCHAR(MAX), @START_DATE NVARCHAR(MAX), @END_DATE NVARCHAR(MAX), @USER_ID NVARCHAR(MAX), @EXC_USER_ID NVARCHAR(MAX)  )
	RETURNS NVARCHAR(MAX) 	
	AS BEGIN		
		DECLARE @SQL     		NVARCHAR(MAX) = ''
		DECLARE @EXSQL     		NVARCHAR(MAX) = ''
		DECLARE @SELECT     	NVARCHAR(MAX) = ''
		
		-- select
		IF (@SELECT_TYPE = 'DETAIL')
			SET @SELECT = 'CONVERT(CHAR(19), ur.Date, 120) as datetime, d.Filename as filename, ur.RevNr as version, CONCAT(FORMAT(CEILING(r.filesize/ 1024.0), N''#,0''), '' KB'') as filesize'
		ELSE
			SET @SELECT = 'DATEPART('+ @DATE_TYPE +', dateadd(HOUR, 9, ur.Date)) as logDate, u.Username as user_id, u.FullName as user_name, dbo.GetDepartment(u.Username) as department, 1 as CNT'
			
		-- where add
		IF (@USER_ID <> 'All')
			SET @EXSQL = 'AND u.username = ''' + @USER_ID + ''''
		IF (@EXC_USER_ID <> '')
			SET @EXSQL = @EXSQL + 'AND u.username not in (' + @EXC_USER_ID + ')'
			
		SET @SQL = ' 				
				SELECT ' + @SELECT +'
				FROM UserRevs ur, Documents d, Users u, Revisions r
				WHERE d.DocumentID = ur.DocumentID 	
					AND d.ExtensionID = (SELECT ExtensionID FROM FileExtension fe WHERE Extension = ''slddrw'') --slddrw 만
					AND DATEADD(HOUR, 9, ur.Date) BETWEEN ''' + @START_DATE + ''' and ''' + @END_DATE + '''
					AND ur.UserRevID IN (
						SELECT UserRevID 
						FROM UserRevs 
						WHERE DocumentID = d.DocumentID 
							AND RevNr <> (SELECT MIN(RevNr) FROM UserRevs WHERE DocumentID = d.DocumentID)) -- 첫번째 승인 데이트는 제외
					AND u.UserID = ur.UserID	
					AND d.DocumentID = r.DocumentID 
					AND ur.RevNr = r.RevNr   				
					' + @EXSQL + '	
		'
	RETURN @SQL
END
;

 				
		
 				  
				
		
 				
		
-- procedure PDM log Query -------------------------------------------------------------------
-- argument 'searchType' 'serachDate' 'serachEndDate' 'serachUser' 'excludeUser'
select dbo.getPDMLogQuery ('POINT', 'LIST', 'download', 'month', '2023-07', '', 'All', '''jm.ko''');	
select dbo.getPDMLogQuery ('POINT', 'DETAIL', 'download', 'month', '2023-07', '', 'All', '''jm.ko''');
select dbo.getPDMLogQuery ('RANGE', 'LIST', 'download', 'month', '2023-07', 'All', '''jm.ko''');
select dbo.getPDMLogQuery ('POINT', 'DEATIL', 'engchange', 'month', '2023-01', '', 'All', '''jm.ko''');

--DROP FUNCTION dbo.getPDMLogQuery;

CREATE FUNCTION getPDMLogQuery (			
	@QUERY_TYPE1		NVARCHAR(MAX) = '',
	@QUERY_TYPE2		NVARCHAR(MAX) = '',
	@LOG_TYPE     		NVARCHAR(MAX) = '',	
    @SEARCH_TYPE     	NVARCHAR(MAX) = '',
    @SEARCH_START_DATE  NVARCHAR(MAX) = '',    
    @SEARCH_END_DATE    NVARCHAR(MAX) = '',
    @USER_ID     		NVARCHAR(MAX) = '',
    @EXC_USER_ID     	NVARCHAR(MAX) = '')
    RETURNS NVARCHAR(MAX)
	AS BEGIN
		DECLARE @DATE_TYPE     	NVARCHAR(MAX) = ''
		DECLARE @START_DATE     NVARCHAR(MAX) = ''
		DECLARE @END_DATE     	NVARCHAR(MAX) = ''
		DECLARE @COLUMNS 		NVARCHAR(MAX) = ''
		DECLARE @SQL     		NVARCHAR(MAX) = ''
			
		-- type, startdate, enddate, columns 정의
		IF (@QUERY_TYPE1='RANGE')			
			select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
			from dbo.GetParametersForRange(@SEARCH_START_DATE, @SEARCH_END_DATE)
		ELSE
			select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
			from dbo.GetParameters(@SEARCH_TYPE, @SEARCH_START_DATE)
		
			
		IF (@COLUMNS <> '')
		BEGIN
			SET @COLUMNS = LEFT(@COLUMNS, LEN(@COLUMNS) - 1)
			
			DECLARE @FROM     		NVARCHAR(MAX) = ''							
			IF (@LOG_TYPE = 'download')
				SET @FROM = dbo.GetDownloadLogQuery(@QUERY_TYPE2, @DATE_TYPE, @START_DATE, @END_DATE, @USER_ID, @EXC_USER_ID)
			ELSE IF (@LOG_TYPE = 'newcreate')
				SET @FROM = dbo.GetNewcreateLogQuery(@QUERY_TYPE2, @DATE_TYPE, @START_DATE, @END_DATE, @USER_ID, @EXC_USER_ID)
			ELSE IF (@LOG_TYPE = 'versionup')
				SET @FROM = dbo.GetVersionupLogQuery(@QUERY_TYPE2, @DATE_TYPE, @START_DATE, @END_DATE, @USER_ID, @EXC_USER_ID)
			ELSE IF (@LOG_TYPE = 'engchange')
				SET @FROM = dbo.GetEngChangeLogQuery(@QUERY_TYPE2, @DATE_TYPE, @START_DATE, @END_DATE, @USER_ID, @EXC_USER_ID)
			
				
			IF (@QUERY_TYPE1='POINT' AND @QUERY_TYPE2 = 'LIST')
				SET @SQL = ' 
					select *
					from (' + @FROM + ') result
					PIVOT (count(CNT) FOR logDate IN (' + @COLUMNS + ')) AS pivot_result	
					order by user_name asc
				'			
			ELSE IF (@QUERY_TYPE1='RANGE' AND @QUERY_TYPE2 = 'LIST')
				SET @SQL = ' 
					select count(logDate) as cnt, user_id, user_name, department
					from (' + @FROM + ') result
					group by user_id, user_name, department	
					order by user_name asc
				'
			ELSE
				SET @SQL = @FROM
				
		END
	RETURN @SQL
END



-- procedure PDM log -------------------------------------------------------------------
-- argument 'searchType' 'serachDate' 'serachEndDate' 'serachUser' 'excludeUser'
select dbo.getLicenseLogQuery ('POINT', 'LIST', 'download', 'month', '2023-07', '', 'All', '''jm.ko''');	
select dbo.getLicenseLogQuery ('POINT', 'DETAIL', 'download', 'month', '2023-07', '', 'All', '''jm.ko''');
select dbo.getLicenseLogQuery ('RANGE', 'LIST', 'download', 'month', '2023-07', 'All', '''jm.ko''');
select dbo.getLicenseLogQuery ('POINT', 'DEATIL', 'engchange', 'month', '2023-01', '', 'All', '''jm.ko''');

--DROP FUNCTION dbo.getLicenseLogQuery;

CREATE FUNCTION getLicenseLogQuery (			
	@QUERY_TYPE1		NVARCHAR(MAX) = '',
	@QUERY_TYPE2		NVARCHAR(MAX) = '',
	@LOG_TYPE     		NVARCHAR(MAX) = '',	
    @SEARCH_TYPE     	NVARCHAR(MAX) = '',
    @SEARCH_START_DATE  NVARCHAR(MAX) = '',    
    @SEARCH_END_DATE    NVARCHAR(MAX) = '',
    @USER_ID     		NVARCHAR(MAX) = '',
    @EXC_USER_ID     	NVARCHAR(MAX) = '')
    RETURNS NVARCHAR(MAX)
	AS BEGIN
		DECLARE @DATE_TYPE     	NVARCHAR(MAX) = ''
		DECLARE @START_DATE     NVARCHAR(MAX) = ''
		DECLARE @END_DATE     	NVARCHAR(MAX) = ''
		DECLARE @COLUMNS 		NVARCHAR(MAX) = ''
		DECLARE @SQL     		NVARCHAR(MAX) = ''
			
		-- type, startdate, enddate, columns 정의
		IF (@QUERY_TYPE1='RANGE')			
			select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
			from dbo.GetParametersForRange(@SEARCH_START_DATE, @SEARCH_END_DATE)
		ELSE
			select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
			from dbo.GetParameters(@SEARCH_TYPE, @SEARCH_START_DATE)
		
			
		IF (@COLUMNS <> '')
		BEGIN
			SET @COLUMNS = LEFT(@COLUMNS, LEN(@COLUMNS) - 1)
			
			DECLARE @FROM     		NVARCHAR(MAX) = ''							
			IF (@LOG_TYPE = 'download')
				SET @FROM = dbo.GetDownloadLogQuery(@QUERY_TYPE2, @DATE_TYPE, @START_DATE, @END_DATE, @USER_ID, @EXC_USER_ID)
			ELSE IF (@LOG_TYPE = 'newcreate')
				SET @FROM = dbo.GetNewcreateLogQuery(@QUERY_TYPE2, @DATE_TYPE, @START_DATE, @END_DATE, @USER_ID, @EXC_USER_ID)
			ELSE IF (@LOG_TYPE = 'versionup')
				SET @FROM = dbo.GetVersionupLogQuery(@QUERY_TYPE2, @DATE_TYPE, @START_DATE, @END_DATE, @USER_ID, @EXC_USER_ID)
			ELSE IF (@LOG_TYPE = 'engchange')
				SET @FROM = dbo.GetEngChangeLogQuery(@QUERY_TYPE2, @DATE_TYPE, @START_DATE, @END_DATE, @USER_ID, @EXC_USER_ID)
			
				
			IF (@QUERY_TYPE1='POINT' AND @QUERY_TYPE2 = 'LIST')
				SET @SQL = ' 
					select *
					from (' + @FROM + ') result
					PIVOT (count(CNT) FOR logDate IN (' + @COLUMNS + ')) AS pivot_result	
					order by user_name asc
				'			
			ELSE IF (@QUERY_TYPE1='RANGE' AND @QUERY_TYPE2 = 'LIST')
				SET @SQL = ' 
					select count(logDate) as cnt, user_id, user_name, department
					from (' + @FROM + ') result
					group by user_id, user_name, department	
					order by user_name asc
				'
			ELSE
				SET @SQL = @FROM
				
		END
	RETURN @SQL
END

 
			 		
-- function user list Query -------------------------------------------------------------------
SELECT dbo.GetUserListQuery('engchange', '2023-01-01 00:00:00:001', '2023-07-13 23:59:59:999', '''jm.ko''');

--DROP FUNCTION dbo.GetUserListQuery;
	
CREATE FUNCTION GetUserListQuery( @LOG_TYPE NVARCHAR(MAX), @START_DATE NVARCHAR(MAX), @END_DATE NVARCHAR(MAX), @EXC_USER_ID NVARCHAR(MAX) )
	RETURNS NVARCHAR(MAX) 	
	AS BEGIN		
		DECLARE @SQL     		NVARCHAR(MAX) = ''
		DECLARE @EXSQL     		NVARCHAR(MAX) = ''		
		
	IF (@EXC_USER_ID <> '')
		SET @EXSQL = ' and U.username not in (' + @EXC_USER_ID + ')'
	
	
	IF (@LOG_TYPE = 'download')
		SET @SQL = ' 
			select U.username as user_id, U.FullName as user_name
			from SK_QUEUE_LOG Q, users U
			where Q.USERID = U.UserID  
			  and dateadd(HOUR, 9, Q.CREDATE) between ''' + @START_DATE + ''' and ''' + @END_DATE + '''
			  ' + @EXSQL + '
			group by U.username, U.FullName				
			order by user_name
		'
	ELSE IF (@LOG_TYPE = 'newcreate')
		SET @SQL = ' 
			select U.username as user_id, U.FullName as user_name
			from revisions R, users U 
			where R.revnr = 1 and R.userid = U.UserID	
			  and dateadd(HOUR, 9, R.date) between ''' + @START_DATE + ''' and ''' + @END_DATE + '''  
			  ' + @EXSQL + '
			group by U.username, U.FullName
			order by user_name
		'
	ELSE IF (@LOG_TYPE = 'versionup')
		SET @SQL = ' 
			select U.username as user_id, U.FullName as user_name
			from revisions R, users U 
			where R.userid = U.UserID	
			  and dateadd(HOUR, 9, R.date) between ''' + @START_DATE + ''' and ''' + @END_DATE + '''
			  ' + @EXSQL + '
			group by U.username, U.FullName
			order by user_name
		'
	ELSE IF (@LOG_TYPE = 'engchange')
		SET @SQL = ' 
			SELECT u.username as user_id, u.FullName as user_name
			FROM UserRevs ur, Documents d, Users u
				WHERE d.DocumentID = ur.DocumentID 	
					AND d.ExtensionID = (SELECT ExtensionID FROM FileExtension fe WHERE Extension = ''slddrw'') --slddrw 만
					AND DATEADD(HOUR, 9, ur.Date) BETWEEN ''' + @START_DATE + ''' and ''' + @END_DATE + '''
					AND ur.UserRevID IN (
						SELECT UserRevID 
						FROM UserRevs 
						WHERE DocumentID = d.DocumentID 
							AND RevNr <> (SELECT MIN(RevNr) FROM UserRevs WHERE DocumentID = d.DocumentID)) -- 첫번째 승인 데이트는 제외
					AND u.UserID = ur.UserID	
			  ' + @EXSQL + '
			GROUP BY u.username, u.FullName
			ORDER BY user_name
		'				  
	RETURN @SQL
END
;


-- function lic list Query -------------------------------------------------------------------
SELECT dbo.GetLicListQuery('2023-01-01 00:00:00:001', '2023-07-13 23:59:59:999', '');

--DROP FUNCTION dbo.GetLicListQuery;
	
CREATE FUNCTION GetLicListQuery( @START_DATE NVARCHAR(MAX), @END_DATE NVARCHAR(MAX), @EXC_LIC_ID NVARCHAR(MAX) )
	RETURNS NVARCHAR(MAX) 	
	AS BEGIN		
		DECLARE @SQL     		NVARCHAR(MAX) = ''
		DECLARE @EXSQL     		NVARCHAR(MAX) = ''		
		
	IF (@EXC_LIC_ID <> '')
		SET @EXSQL = ' and PRODUCT not in (' + @EXC_LIC_ID + ')'
	
	SET @SQL = ' 
		select PRODUCT as lic_name, PRODUCT as lic_id
		from SK_LICENSE_TRACE slt, SK_LICENSE_TRACE_DETAIL sltd 
		where sltd.CREATE_DATE between ''' + @START_DATE + ''' and ''' + @END_DATE + '''
			and slt.ID = sltd.ID
			' + @EXSQL + '
		group by PRODUCT
		order by PRODUCT
	'
			
	RETURN @SQL
END
;

 
























	
 
	

-- function login_log_user(old) -------------------------------------------------------------------
/*
DROP FUNCTION dbo.GetParameters;

select * from dbo.GetParameters('month', '2023-06');

CREATE FUNCTION GetParameters( @SEARCH_TYPE NVARCHAR(MAX), @SEARCH_DATE NVARCHAR(MAX) )
	RETURNS @returnTable TABLE 
	(
		DATE_TYPE nvarchar(MAX),
		START_DATE nvarchar(MAX),
		END_DATE nvarchar(MAX),
		COLUMNS nvarchar(MAX)
	)
	AS BEGIN
			
	DECLARE @DATE_TYPE     	NVARCHAR(MAX) = ''
	DECLARE @START_DATE     NVARCHAR(MAX) = ''
	DECLARE @END_DATE     	NVARCHAR(MAX) = ''
	DECLARE @COLUMNS 		NVARCHAR(MAX) = ''
	
	DECLARE @i 				INT = 0
	DECLARE @LAST_COL 		INT = 0
		
	IF (@SEARCH_TYPE <> '' and @SEARCH_DATE <> '')
	BEGIN
		IF (@SEARCH_TYPE = 'day')			--일 단위
		BEGIN 
			SET @DATE_TYPE = 'HOUR'
			SET @START_DATE = @SEARCH_DATE + ' 00:00:00.001'
			SET @END_DATE = @SEARCH_DATE + ' 23:59:59.999'		
			IF (@SEARCH_DATE = CONVERT(NVARCHAR, GETDATE(), 23))
				SET @LAST_COL = DATEPART(HOUR, GETDATE()) 		
			ELSE
				SET @LAST_COL = DATEPART(HOUR, @END_DATE)
			WHILE(@i <= @LAST_COL)
			BEGIN			
				SET @COLUMNS = @COLUMNS + '[' + CONVERT(NVARCHAR(2), @i) + '],'
				SET @i = @i + 1
			END
		END
		ELSE IF (@SEARCH_TYPE = 'month')	--월 단위
		BEGIN
			SET @DATE_TYPE = 'DAY'
			SET @START_DATE = @SEARCH_DATE + '-01 00:00:00.001'
			SET @END_DATE = CONVERT(VARCHAR, EOMONTH(@START_DATE)) + ' 23:59:59.999'			
			IF (@SEARCH_DATE = LEFT(CONVERT(NVARCHAR, GETDATE(), 23), 7))
				SET @LAST_COL = DATEPART(DAY, GETDATE()) 		
			ELSE
				SET @LAST_COL = DATEPART(DAY, @END_DATE)
			WHILE(@i < @LAST_COL)
			BEGIN
				SET @i = @i + 1
				SET @COLUMNS = @COLUMNS + '[' + CONVERT(NVARCHAR(2), @i) + '],'
			END
		END
		ELSE IF (@SEARCH_TYPE = 'year')		-- 년 단위
		BEGIN
			SET @DATE_TYPE = 'MONTH'
			SET @START_DATE = @SEARCH_DATE + '-01-01 00:00:00.001'		
			SET @END_DATE = @SEARCH_DATE + '-12-31 23:59:59.999'					
			IF (@SEARCH_DATE = LEFT(CONVERT(NVARCHAR, GETDATE(), 23), 4))
				SET @LAST_COL = DATEPART(MONTH, GETDATE()) 		
			ELSE
				SET @LAST_COL = DATEPART(MONTH, @END_DATE)
			WHILE(@i < @LAST_COL)
			BEGIN
				SET @i = @i + 1
				SET @COLUMNS = @COLUMNS + '[' + CONVERT(NVARCHAR(2), @i) + '],'
			END				
		END
	END
	

	insert @returnTable (DATE_TYPE, START_DATE, END_DATE, COLUMNS)
		values (@DATE_TYPE, @START_DATE, @END_DATE, @COLUMNS);

	RETURN 

END;
*/		