--------------------- SOLDWORKS LOG REPORT -----------------------------------------------------------------------------------------------

-- procedure pdm log -------------------------------------------------------------------
-- argument 'logType' 'searchType' 'serachDate' 'serachEndDate' 'serachUser' 'excludeUser'
EXEC dbo.SP_PDM_LOG 'LIST', 'download', 'month', '2023-07', 'All', '''admin''';	
EXEC dbo.SP_PDM_LOG 'LIST', 'newcreate', 'month', '2023-07', 'All', '''admin''';
EXEC dbo.SP_PDM_LOG 'LIST', 'versionup', 'month', '2023-07', 'All', '''admin''';
EXEC dbo.SP_PDM_LOG 'LIST', 'engchange', 'month', '2023-01', 'All', '''admin''';
EXEC dbo.SP_PDM_LOG 'DETAIL', 'download', 'day', '2023-07-02', 'jm.ko', '''admin''';
EXEC dbo.SP_PDM_LOG 'DETAIL', 'newcreate', 'day', '2023-07-01', 'jm.ko', '''admin''';
EXEC dbo.SP_PDM_LOG 'DETAIL', 'versionup', 'day', '2023-07-01', 'jm.ko', '''admin''';
EXEC dbo.SP_PDM_LOG 'DETAIL', 'engchange', 'day', '2023-01-31', 'hdg6291', '''admin''';

--DROP PROCEDURE [dbo].[SP_PDM_LOG];

CREATE PROCEDURE [dbo].[SP_PDM_LOG]
	@QUERY_TYPE     	NVARCHAR(MAX) = '',
	@LOG_TYPE     		NVARCHAR(MAX) = '',
	@SEARCH_TYPE     	NVARCHAR(MAX) = '',
    @SEARCH_DATE     	NVARCHAR(MAX) = '',        
    @USER_ID     		NVARCHAR(MAX) = '',
    @EXC_USER_ID     	NVARCHAR(MAX) = ''
AS
BEGIN
	DECLARE @SQL     		NVARCHAR(MAX) = ''
	SET @SQL = dbo.getPDMLogQuery('POINT', @QUERY_TYPE, @LOG_TYPE, @SEARCH_TYPE, @SEARCH_DATE, '', @USER_ID, @EXC_USER_ID)
	EXEC (@SQL)	
END


-- procedure pdm log range -------------------------------------------------------------------
-- argument 'logType' 'searchType' 'serachDate' 'serachEndDate' 'serachUser' 'excludeUser'
EXEC dbo.SP_PDM_LOG_RANGE 'LIST', 'download', 'month', '2023-07-01', '2023-07-31', 'All', '''admin''';	
EXEC dbo.SP_PDM_LOG_RANGE 'LIST', 'newcreate', 'month', '2023-07-01', '2023-07-31', 'All', '''admin''';
EXEC dbo.SP_PDM_LOG_RANGE 'LIST', 'versionup', 'month', '2023-07-01', '2023-07-31', 'All', '''admin''';
EXEC dbo.SP_PDM_LOG_RANGE 'DETAIL', 'download', 'month', '2023-07-01', '2023-07-31', 'jm.ko', '''admin''';
EXEC dbo.SP_PDM_LOG_RANGE 'DETAIL', 'newcreate', 'month', '2023-07-01', '2023-07-31', 'jm.ko', '''admin''';
EXEC dbo.SP_PDM_LOG_RANGE 'DETAIL', 'versionup', 'month', '2023-07-01', '2023-07-31', 'jm.ko', '''admin''';

--DROP PROCEDURE [dbo].[SP_PDM_LOG_RANGE];

CREATE PROCEDURE [dbo].[SP_PDM_LOG_RANGE]
	@QUERY_TYPE     	NVARCHAR(MAX) = '',
	@LOG_TYPE     		NVARCHAR(MAX) = '',
	@SEARCH_TYPE     	NVARCHAR(MAX) = '',
    @SEARCH_START_DATE  NVARCHAR(MAX) = '',        
    @SEARCH_END_DATE    NVARCHAR(MAX) = '',
    @USER_ID     		NVARCHAR(MAX) = '',
    @EXC_USER_ID     	NVARCHAR(MAX) = ''
AS
BEGIN
	DECLARE @SQL     		NVARCHAR(MAX) = ''
	SET @SQL = dbo.getPDMLogQuery('RANGE', @QUERY_TYPE, @LOG_TYPE, @SEARCH_TYPE, @SEARCH_START_DATE, @SEARCH_END_DATE, @USER_ID, @EXC_USER_ID)
	EXEC (@SQL)	
END














------------------ log in log ----------------------------------------------------------------

-- procedure login_log_lic -------------------------------------------------------------------
EXEC dbo.SP_LOGIN_LOG_LICENSE 'year', '2023', 'swepdm_cadeditorandweb', '', '''admin'',''convert pc'',''convert pc2''';

--DROP PROCEDURE [dbo].[SP_LOGIN_LOG_LICENSE];

CREATE PROCEDURE [dbo].[SP_LOGIN_LOG_LICENSE]		
    @SEARCH_TYPE     	NVARCHAR(MAX) = '',
    @SEARCH_DATE     	NVARCHAR(MAX) = '',
    @LIC_ID     	 	NVARCHAR(MAX) = '',
    @EXC_LIC_ID      	NVARCHAR(MAX) = '',
    @EXC_USER_ID      	NVARCHAR(MAX) = ''
AS
BEGIN
	DECLARE @DATE_TYPE     	NVARCHAR(MAX) = ''
	DECLARE @START_DATE     NVARCHAR(MAX) = ''
	DECLARE @END_DATE     	NVARCHAR(MAX) = ''
	DECLARE @COLUMNS 		NVARCHAR(MAX) = ''
	DECLARE @SQL     		NVARCHAR(MAX) = ''
	
	IF (@SEARCH_TYPE <> '' and @SEARCH_DATE <> '' and @LIC_ID <> '')
		select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
		from dbo.GetParameters(@SEARCH_TYPE, @SEARCH_DATE)
	
	IF (@COLUMNS <> '')
	BEGIN
		SET @COLUMNS = LEFT(@COLUMNS, LEN(@COLUMNS) - 1)		
		
		DECLARE @EXSQL     		NVARCHAR(MAX) = ''
		IF (@LIC_ID <> 'All')
			SET @EXSQL = ' AND slt.PRODUCT=''' + @LIC_ID + ''''			
		IF (@EXC_LIC_ID <> '')
			SET @EXSQL = @EXSQL + ' AND slt.PRODUCT not in (' + @EXC_LIC_ID + ')'	
		IF (@EXC_USER_ID <> '')
			SET @EXSQL = @EXSQL + ' AND sltd.USER_NAME not in (' + @EXC_USER_ID + ')'
			
		SET @SQL = ' 
			SELECT *
			FROM (
				SELECT *
				FROM (		
					SELECT FORMAT(DATEPART('+ @DATE_TYPE +', sltd.CREATE_DATE), ''0'') AS date, slt.PRODUCT as lic_id, slt.PRODUCT as lic_name
					FROM SK_LICENSE_TRACE slt
						LEFT JOIN SK_LICENSE_TRACE_DETAIL sltd
						ON slt.id = sltd.id
					WHERE sltd.CREATE_DATE BETWEEN ''' + @START_DATE + ''' AND ''' + @END_DATE + '''
						' + @EXSQL + '
					GROUP BY DATEPART('+ @DATE_TYPE +', sltd.CREATE_DATE), sltd.USER_NAME, slt.PRODUCT, sltd.DISPLAY				
				) result
				PIVOT (count(date) FOR date IN (' + @COLUMNS + ')) AS pivot_result
			) data
			LEFT JOIN ( 
				select a.PRODUCT, a.TOTAL_SUM as hold_qty
				from SK_LICENSE_TRACE a
				inner join	(
					select PRODUCT, max(CREATE_DATE) as CREATE_DATE 
					from SK_LICENSE_TRACE
					where CREATE_DATE BETWEEN ''' + @START_DATE + ''' AND ''' + @END_DATE + '''
					group by PRODUCT
					) b
				on a.PRODUCT = b.PRODUCT and a.CREATE_DATE = b.CREATE_DATE
			) lic
			ON data.lic_id = lic.PRODUCT
			ORDER BY lic_name
		'
		EXEC(@SQL)
	END	
END


-- procedure login_log_lic - range -------------------------------------------------------------------
EXEC dbo.SP_LOGIN_LOG_LICENSE_RANGE 'range', '2023-01-01', '2023-07-31', 'All', '', '';

--DROP PROCEDURE [dbo].[SP_LOGIN_LOG_LICENSE_RANGE];

CREATE PROCEDURE [dbo].[SP_LOGIN_LOG_LICENSE_RANGE]		
    @SEARCH_TYPE      		NVARCHAR(MAX) = '',
    @SEARCH_START_DATE  	NVARCHAR(MAX) = '',
    @SEARCH_END_DATE    	NVARCHAR(MAX) = '',
	@LIC_ID     	 		NVARCHAR(MAX) = '',
    @EXC_LIC_ID      		NVARCHAR(MAX) = '',
    @EXC_USER_ID      		NVARCHAR(MAX) = ''
AS
BEGIN
	DECLARE @DATE_TYPE     	NVARCHAR(MAX) = ''
	DECLARE @START_DATE     NVARCHAR(MAX) = ''
	DECLARE @END_DATE     	NVARCHAR(MAX) = ''
	DECLARE @COLUMNS 		NVARCHAR(MAX) = ''
	DECLARE @SQL     		NVARCHAR(MAX) = ''
		
	select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
	from dbo.GetParametersForRange(@SEARCH_START_DATE, @SEARCH_END_DATE)
	
	IF (@COLUMNS <> '')
	BEGIN				
		DECLARE @EXSQL     		NVARCHAR(MAX) = ''
		IF (@LIC_ID <> 'All')
			SET @EXSQL = ' AND slt.PRODUCT=''' + @LIC_ID + ''''			
		IF (@EXC_LIC_ID <> '')
			SET @EXSQL = @EXSQL + ' AND slt.PRODUCT not in (' + @EXC_LIC_ID + ')'	
		IF (@EXC_USER_ID <> '')
			SET @EXSQL = @EXSQL + ' AND sltd.USER_NAME not in (' + @EXC_USER_ID + ')'	
			
		SET @SQL = ' 
			SELECT *
			FROM (
				SELECT COUNT(date) AS cnt, lic_id, lic_name
				FROM (		
					SELECT CONVERT(VARCHAR, sltd.CREATE_DATE, 23) AS date, slt.PRODUCT as lic_id, slt.PRODUCT as lic_name, sltd.USER_NAME as user_name
					FROM SK_LICENSE_TRACE slt
						LEFT JOIN SK_LICENSE_TRACE_DETAIL sltd
						ON slt.id = sltd.id
					WHERE sltd.CREATE_DATE BETWEEN ''' + @START_DATE + ''' AND ''' + @END_DATE + '''
						' + @EXSQL + '
					GROUP BY CONVERT(VARCHAR, sltd.CREATE_DATE, 23), sltd.USER_NAME, slt.PRODUCT, sltd.DISPLAY				
				) result
				GROUP BY lic_id, lic_name
			) data
			LEFT JOIN ( 
				select a.PRODUCT, a.TOTAL_SUM as hold_qty
				from SK_LICENSE_TRACE a
				inner join	(
					select PRODUCT, max(CREATE_DATE) as CREATE_DATE 
					from SK_LICENSE_TRACE
					where CREATE_DATE BETWEEN ''' + @START_DATE + ''' AND ''' + @END_DATE + '''
					group by PRODUCT
					) b
				on a.PRODUCT = b.PRODUCT and a.CREATE_DATE = b.CREATE_DATE
			) lic
			ON data.lic_id = lic.PRODUCT
			ORDER BY lic_name
		'
		EXEC(@SQL)
	END	
END



-- procedure login_log_user -------------------------------------------------------------------
EXEC dbo.SP_LOGIN_LOG_USER 'year', '2023', 'swepdm_cadeditorandweb', '', '''admin'',''convert pc'',''convert pc2''';  --''admin'',''ch.jung''  --swepdm_cadeditorandweb

--DROP PROCEDURE [dbo].[SP_LOGIN_LOG_USER];

CREATE PROCEDURE [dbo].[SP_LOGIN_LOG_USER]		
    @SEARCH_TYPE     	NVARCHAR(MAX) = '',
    @SEARCH_DATE     	NVARCHAR(MAX) = '',
    @LIC_ID     		NVARCHAR(MAX) = '',    
    @EXC_LIC_ID      	NVARCHAR(MAX) = '',
    @EXC_USER_ID      	NVARCHAR(MAX) = ''
AS
BEGIN
	DECLARE @DATE_TYPE     	NVARCHAR(MAX) = ''
	DECLARE @START_DATE     NVARCHAR(MAX) = ''
	DECLARE @END_DATE     	NVARCHAR(MAX) = ''
	DECLARE @COLUMNS 		NVARCHAR(MAX) = ''
	DECLARE @SQL     		NVARCHAR(MAX) = ''
	
	select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
	from dbo.GetParameters(@SEARCH_TYPE, @SEARCH_DATE)
	
	IF (@COLUMNS <> '')
	BEGIN
		SET @COLUMNS = LEFT(@COLUMNS, LEN(@COLUMNS) - 1)
		
		DECLARE @EXSQL     		NVARCHAR(MAX) = ''		
		IF (@EXC_LIC_ID <> '')
			SET @EXSQL = @EXSQL + ' AND slt.PRODUCT not in (' + @EXC_LIC_ID + ')'	
		IF (@EXC_USER_ID <> '')
			SET @EXSQL = @EXSQL + ' AND sltd.USER_NAME not in (' + @EXC_USER_ID + ')'
			
		SET @SQL = ' 
			SELECT *, dbo.getUsername(user_id) as user_name, dbo.GetDepartment(user_id) as department
			FROM
			(
				SELECT FORMAT(DATEPART('+ @DATE_TYPE +', sltd.CREATE_DATE), ''0'') AS date, sltd.USER_NAME as user_id, sltd.DISPLAY as pc_name				
				FROM SK_LICENSE_TRACE_DETAIL sltd, SK_LICENSE_TRACE slt with(nolock)
				WHERE sltd.CREATE_DATE BETWEEN ''' + @START_DATE + ''' AND ''' + @END_DATE + '''
					AND slt.id = sltd.id AND slt.PRODUCT = ''' + @LIC_ID + '''
					' + @EXSQL + '
				GROUP BY DATEPART('+ @DATE_TYPE +', sltd.CREATE_DATE), sltd.USER_NAME, sltd.DISPLAY
			) data
			PIVOT (COUNT(date) FOR date IN (' + @COLUMNS + ')) AS pivot_result
			ORDER BY user_name
		'
			
		EXEC(@SQL)
	END	
END


-- procedure login_log_user - range -------------------------------------------------------------------
EXEC dbo.SP_LOGIN_LOG_USER_RANGE 'range', '2023-07-01', '2023-07-31', 'swepdm_cadeditorandweb', '';  --''admin'',''ch.jung''  --swepdm_cadeditorandweb

--DROP PROCEDURE [dbo].[SP_LOGIN_LOG_USER_RANGE];

CREATE PROCEDURE [dbo].[SP_LOGIN_LOG_USER_RANGE]		
    @SEARCH_TYPE     	NVARCHAR(MAX) = '',
    @SEARCH_START_DATE  NVARCHAR(MAX) = '',
    @SEARCH_END_DATE    NVARCHAR(MAX) = '',
    @LIC_ID     	 	NVARCHAR(MAX) = '',    
    @EXC_LIC_ID      	NVARCHAR(MAX) = '',
    @EXC_USER_ID      	NVARCHAR(MAX) = ''
AS
BEGIN
	DECLARE @DATE_TYPE     	NVARCHAR(MAX) = ''
	DECLARE @START_DATE     NVARCHAR(MAX) = ''
	DECLARE @END_DATE     	NVARCHAR(MAX) = ''
	DECLARE @COLUMNS 		NVARCHAR(MAX) = ''
	DECLARE @SQL     		NVARCHAR(MAX) = ''

	select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
	from dbo.GetParametersForRange(@SEARCH_START_DATE, @SEARCH_END_DATE)
	
	IF (@COLUMNS <> '')
	BEGIN				
		DECLARE @EXSQL     		NVARCHAR(MAX) = ''		
		IF (@EXC_LIC_ID <> '')
			SET @EXSQL = @EXSQL + ' AND slt.PRODUCT not in (' + @EXC_LIC_ID + ')'	
		IF (@EXC_USER_ID <> '')
			SET @EXSQL = @EXSQL + ' AND sltd.USER_NAME not in (' + @EXC_USER_ID + ')'
			
		SET @SQL = ' 
			SELECT count(date) as cnt, pc_name, user_id, dbo.getUsername(user_id) as user_name, dbo.GetDepartment(user_id) as department
			FROM
			(
				SELECT CONVERT(VARCHAR, sltd.CREATE_DATE, 23) AS date, sltd.USER_NAME as user_id, sltd.DISPLAY as pc_name				
				FROM SK_LICENSE_TRACE_DETAIL sltd, SK_LICENSE_TRACE slt with(nolock)
				WHERE sltd.CREATE_DATE BETWEEN ''' + @START_DATE + ''' AND ''' + @END_DATE + '''
					AND slt.id = sltd.id AND slt.PRODUCT = ''' + @LIC_ID + '''
					' + @EXSQL + '
				GROUP BY CONVERT(VARCHAR, sltd.CREATE_DATE, 23), sltd.USER_NAME, sltd.DISPLAY
			) data
			GROUP BY user_id, pc_name
			ORDER BY user_name
		'
			
		EXEC(@SQL)
	END	
END


-- procedure login_lic_detail_log -------------------------------------------------------------------
EXEC dbo.SP_LOGIN_LIC_DETAIL_LOG 'range', '2023-07-01', '2023-07-31', 'swepdm_cadeditorandweb', '''Convert PC'', ''Convert PC2'', ''Admin''';
EXEC dbo.SP_LOGIN_LIC_DETAIL_LOG 'month', '2023-07', '', 'swepdm_cadeditorandweb', '''Convert PC'', ''Convert PC2'', ''Admin''';
EXEC dbo.SP_LOGIN_LIC_DETAIL_LOG 'day', '2023-07-01', '', 'swepdm_cadeditorandweb', '''Convert PC'', ''Convert PC2'', ''Admin''';
EXEC dbo.SP_LOGIN_LIC_DETAIL_LOG 'time', '2023-07-01 12', '', 'swepdm_cadeditorandweb', '''Convert PC'', ''Convert PC2'', ''Admin''';

--DROP PROCEDURE [dbo].[SP_LOGIN_LIC_DETAIL_LOG];

CREATE PROCEDURE [dbo].[SP_LOGIN_LIC_DETAIL_LOG]		
    @SEARCH_TYPE     	NVARCHAR(MAX) = '',
    @SEARCH_START_DATE  NVARCHAR(MAX) = '',
    @SEARCH_END_DATE    NVARCHAR(MAX) = '',
    @LIC_ID     	 	NVARCHAR(MAX) = '',    
    @EXC_USER_ID      	NVARCHAR(MAX) = ''
AS
BEGIN
	DECLARE @DATE_TYPE     	NVARCHAR(MAX) = ''
	DECLARE @START_DATE     NVARCHAR(MAX) = ''
	DECLARE @END_DATE     	NVARCHAR(MAX) = ''
	DECLARE @COLUMNS 		NVARCHAR(MAX) = ''
	DECLARE @SQL     		NVARCHAR(MAX) = ''
	DECLARE @RANGE_SELECT   NVARCHAR(MAX) = ''

	IF (@SEARCH_TYPE = 'range')	
		select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
		from dbo.GetParametersForRange(@SEARCH_START_DATE, @SEARCH_END_DATE)
	ELSE
		select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
		from dbo.GetParameters(@SEARCH_TYPE, @SEARCH_START_DATE)
				
	DECLARE @EXSQL     		NVARCHAR(MAX) = ''			
	IF (@EXC_USER_ID <> '')
		SET @EXSQL = @EXSQL + ' AND sltd.USER_NAME not in (' + @EXC_USER_ID + ')'
	
	IF (@SEARCH_TYPE = 'range')	
		SET @SQL = ' 
			SELECT logdate, user_id, pc_name, dbo.getUsername(user_id) as user_name, dbo.GetDepartment(user_id) as department
			FROM
			(
				SELECT CONVERT(VARCHAR, sltd.CREATE_DATE, 23) AS logdate, sltd.USER_NAME as user_id, sltd.DISPLAY as pc_name				
				FROM SK_LICENSE_TRACE_DETAIL sltd, SK_LICENSE_TRACE slt with(nolock)
				WHERE sltd.CREATE_DATE BETWEEN ''' + @START_DATE + ''' AND ''' + @END_DATE + '''
					AND slt.id = sltd.id AND slt.PRODUCT = ''' + @LIC_ID + '''
					' + @EXSQL + '
				GROUP BY CONVERT(VARCHAR, sltd.CREATE_DATE, 23), sltd.USER_NAME, sltd.DISPLAY
			) data
			ORDER BY logdate, user_name
		'
	ELSE
		SET @SQL = ' 
			SELECT user_id, pc_name, dbo.getUsername(user_id) as user_name, dbo.GetDepartment(user_id) as department
			FROM
			(
				SELECT sltd.USER_NAME as user_id, sltd.DISPLAY as pc_name				
				FROM SK_LICENSE_TRACE_DETAIL sltd, SK_LICENSE_TRACE slt with(nolock)
				WHERE sltd.CREATE_DATE BETWEEN ''' + @START_DATE + ''' AND ''' + @END_DATE + '''
					AND slt.id = sltd.id AND slt.PRODUCT = ''' + @LIC_ID + '''
					' + @EXSQL + '
				GROUP BY sltd.USER_NAME, sltd.DISPLAY
			) data
			ORDER BY user_name
		'
		
	EXEC(@SQL)
		
END


-- procedure login_user_detail_log -------------------------------------------------------------------
EXEC dbo.SP_LOGIN_USER_DETAIL_LOG 'range', '2023-07-01', '2023-07-31', 'swepdm_cadeditorandweb', 'jm.ko';
EXEC dbo.SP_LOGIN_USER_DETAIL_LOG 'day', '2023-07-01', '', 'swepdm_cadeditorandweb', 'jm.ko';

--DROP PROCEDURE [dbo].[SP_LOGIN_USER_DETAIL_LOG];

CREATE PROCEDURE [dbo].[SP_LOGIN_USER_DETAIL_LOG]		
    @SEARCH_TYPE     	NVARCHAR(MAX) = '',
    @SEARCH_START_DATE  NVARCHAR(MAX) = '',
    @SEARCH_END_DATE    NVARCHAR(MAX) = '',
    @LIC_ID     	 	NVARCHAR(MAX) = '',    
    @USER_ID      		NVARCHAR(MAX) = ''
AS
BEGIN
	DECLARE @DATE_TYPE     	NVARCHAR(MAX) = ''
	DECLARE @START_DATE     NVARCHAR(MAX) = ''
	DECLARE @END_DATE     	NVARCHAR(MAX) = ''
	DECLARE @COLUMNS 		NVARCHAR(MAX) = ''
	DECLARE @SQL     		NVARCHAR(MAX) = ''

	IF (@SEARCH_TYPE = 'range')	
		select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
		from dbo.GetParametersForRange(@SEARCH_START_DATE, @SEARCH_END_DATE)
	ELSE
		select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
		from dbo.GetParameters(@SEARCH_TYPE, @SEARCH_START_DATE)
						
	IF (@SEARCH_TYPE = 'range')
		SET @SQL = ' 
			SELECT logdate, user_id, pc_name, dbo.getUsername(user_id) as user_name, dbo.GetDepartment(user_id) as department
			FROM
			(
				SELECT CONVERT(VARCHAR, sltd.CREATE_DATE, 23) AS logdate, sltd.USER_NAME as user_id, sltd.DISPLAY as pc_name				
				FROM SK_LICENSE_TRACE_DETAIL sltd, SK_LICENSE_TRACE slt with(nolock)
				WHERE sltd.CREATE_DATE BETWEEN ''' + @START_DATE + ''' AND ''' + @END_DATE + '''
					AND slt.id = sltd.id AND slt.PRODUCT = ''' + @LIC_ID + '''
					AND sltd.USER_NAME = ''' + @USER_ID + '''
				GROUP BY CONVERT(VARCHAR, sltd.CREATE_DATE, 23), sltd.USER_NAME, sltd.DISPLAY
			) data
			ORDER BY logdate, user_name
		'
	ELSE
		SET @SQL = ' 
			SELECT user_id, pc_name, dbo.getUsername(user_id) as user_name, dbo.GetDepartment(user_id) as department
			FROM
			(
				SELECT sltd.USER_NAME as user_id, sltd.DISPLAY as pc_name				
				FROM SK_LICENSE_TRACE_DETAIL sltd, SK_LICENSE_TRACE slt with(nolock)
				WHERE sltd.CREATE_DATE BETWEEN ''' + @START_DATE + ''' AND ''' + @END_DATE + '''
					AND slt.id = sltd.id AND slt.PRODUCT = ''' + @LIC_ID + '''
					AND sltd.USER_NAME = ''' + @USER_ID + '''
				GROUP BY sltd.USER_NAME, sltd.DISPLAY
			) data
			ORDER BY user_name
		'
					
	EXEC(@SQL)
END




----------- lic & user list --------------------------------------------------------------------------

-- procedure license list -------------------------------------------------------------------
EXEC dbo.SP_LICENSE_LIST 'year', '2023', '''swepdm_viewer''';

--DROP PROCEDURE [dbo].[SP_LICENSE_LIST];

CREATE PROCEDURE [dbo].[SP_LICENSE_LIST]		
    @SEARCH_TYPE     NVARCHAR(MAX) = '',
    @SEARCH_DATE     NVARCHAR(MAX) = '',    
    @EXC_LIC_ID      NVARCHAR(MAX) = ''
AS
BEGIN
	DECLARE @DATE_TYPE     	NVARCHAR(MAX) = ''
	DECLARE @START_DATE     NVARCHAR(MAX) = ''
	DECLARE @END_DATE     	NVARCHAR(MAX) = ''
	DECLARE @COLUMNS 		NVARCHAR(MAX) = ''
	DECLARE @SQL     		NVARCHAR(MAX) = ''
	DECLARE @EXSQL     		NVARCHAR(MAX) = ''	
	
	select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
	from dbo.GetParameters(@SEARCH_TYPE, @SEARCH_DATE)
		
	IF (@COLUMNS <> '')
	BEGIN					
		SET @SQL = dbo.GetLicListQuery(@START_DATE, @END_DATE, @EXC_LIC_ID)
		
		EXEC(@SQL)
	END	
END
;


-- procedure license list - range -------------------------------------------------------------------
EXEC dbo.SP_LICENSE_LIST_RANGE '2023-07-01', '2023-07-13', '';

--DROP PROCEDURE [dbo].[SP_LICENSE_LIST_RANGE];

CREATE PROCEDURE [dbo].[SP_LICENSE_LIST_RANGE]		
    @SEARCH_START_DATE  NVARCHAR(MAX) = '',
    @SEARCH_END_DATE    NVARCHAR(MAX) = '',    
    @EXC_LIC_ID      	NVARCHAR(MAX) = ''
AS
BEGIN
	DECLARE @DATE_TYPE     	NVARCHAR(MAX) = ''
	DECLARE @START_DATE     NVARCHAR(MAX) = ''
	DECLARE @END_DATE     	NVARCHAR(MAX) = ''
	DECLARE @COLUMNS 		NVARCHAR(MAX) = ''
	DECLARE @SQL     		NVARCHAR(MAX) = ''
	DECLARE @EXSQL     		NVARCHAR(MAX) = ''
		
	select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
	from dbo.GetParametersForRange(@SEARCH_START_DATE, @SEARCH_END_DATE)

	IF (@COLUMNS <> '')
	BEGIN					
		SET @SQL = dbo.GetLicListQuery(@START_DATE, @END_DATE, @EXC_LIC_ID)
		
		EXEC(@SQL)
	END	
END
;


-- procedure user list -------------------------------------------------------------------
EXEC dbo.SP_USER_LIST 'download', 'month', '2023-07', '''jm.ko'', ''mk.kim''';

--DROP PROCEDURE [dbo].[SP_USER_LIST];

CREATE PROCEDURE [dbo].[SP_USER_LIST]
	@LOG_TYPE     		NVARCHAR(MAX) = '',
    @SEARCH_TYPE     	NVARCHAR(MAX) = '',
    @SEARCH_DATE     	NVARCHAR(MAX) = '',
    @EXC_USER_ID     	NVARCHAR(MAX) = ''
AS
BEGIN
	DECLARE @DATE_TYPE     	NVARCHAR(MAX) = ''
	DECLARE @START_DATE     NVARCHAR(MAX) = ''
	DECLARE @END_DATE     	NVARCHAR(MAX) = ''
	DECLARE @COLUMNS 		NVARCHAR(MAX) = ''
	DECLARE @SQL     		NVARCHAR(MAX) = ''
	DECLARE @EXSQL     		NVARCHAR(MAX) = ''
	
	select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
	from dbo.GetParameters(@SEARCH_TYPE, @SEARCH_DATE)
		
	IF (@COLUMNS <> '')	
	BEGIN				
		SET @SQL = dbo.GetUserListQuery(@LOG_TYPE, @START_DATE, @END_DATE, @EXC_USER_ID)
		
		EXEC(@SQL)
	END	
END
;   


-- procedure user list - range -------------------------------------------------------------------
EXEC dbo.SP_USER_LIST_RANGE 'download', '2023-07-01', '2023-07-31', '';

--DROP PROCEDURE [dbo].[SP_USER_LIST_RANGE];

CREATE PROCEDURE [dbo].[SP_USER_LIST_RANGE]
	@LOG_TYPE     		NVARCHAR(MAX) = '',
    @SEARCH_START_DATE  NVARCHAR(MAX) = '',
    @SEARCH_END_DATE    NVARCHAR(MAX) = '',
    @EXC_USER_ID     	NVARCHAR(MAX) = ''
AS
BEGIN
	DECLARE @DATE_TYPE     	NVARCHAR(MAX) = ''
	DECLARE @START_DATE     NVARCHAR(MAX) = ''
	DECLARE @END_DATE     	NVARCHAR(MAX) = ''
	DECLARE @COLUMNS 		NVARCHAR(MAX) = ''
	DECLARE @SQL     		NVARCHAR(MAX) = ''
	DECLARE @EXSQL     		NVARCHAR(MAX) = ''
	
	select @DATE_TYPE=DATE_TYPE, @START_DATE=START_DATE, @END_DATE=END_DATE, @COLUMNS=COLUMNS 
	from dbo.GetParametersForRange(@SEARCH_START_DATE, @SEARCH_END_DATE)
	
	IF (@COLUMNS <> '')	
	BEGIN				
		SET @SQL = dbo.GetUserListQuery(@LOG_TYPE, @START_DATE, @END_DATE, @EXC_USER_ID)
		
		EXEC(@SQL)
	END	
END
;   

