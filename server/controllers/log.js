import {db} from "../db.js"

// db query
async function getResultData(tablename, values) {  
  const pool = await db;      
  const request = await pool.request();
  
  (values).forEach((v) => request.input(v.key, v.value));
  
  const result = await request
    .execute('dbo.'.concat(tablename))
    .then((result) => {      
      const result_data = {
        //total: result.output.TOTAL,
        data: result.recordset,
      };            
      return result_data;
    })
    .catch((err) => {
      console.log('err', err);
    });                  

  return result.data;
}

// PDM 로그 공통 함수
async function getLogData(req) {
  let arr_result = [];  // 결과값 저장

  console.log("getLogData req.body==>", req.body);

  const logtype = req.body.log_type;
  const searchtype = req.body.search_type;
  const searchdate = req.body.search_date;
  const user_id = req.body.user_id;   
  const excuserid = req.body.exc_user_id;  
  
  try {   
    const values = [
      { key:'LOG_TYPE', value:logtype},
      { key:'SEARCH_TYPE', value:searchtype},
      { key:'SEARCH_DATE', value:searchdate},
      { key:'USER_ID', value:user_id},
      { key:'EXC_USER_ID', value:getExcludeData(excuserid)},
    ]

    const reault_data = await getResultData('SP_PDM_LOG', values);

    reault_data.forEach((data, idx) => {
      let logdata = new Object() ;
      
      logdata.id = idx;        
      logdata.userid = data.user_id;        
      logdata.username = data.user_name;        
      logdata.department = data.department;        
  
      // pivot 데이타에서 칼럼이 숫자이면 배열로 합침
      logdata.logdata = Object.values(JSON.parse(
        JSON.stringify(data, (key, value) => {                      
          const ret = (typeof value !== "object") ? ((isNaN(parseInt(key))) ? undefined : value) : value;
          return ret;            
        })
      ));
  
      arr_result[idx] = logdata;
    });

  } catch (err) {
    console.log(err);
  }
  console.log("getLogData arr_result==>", arr_result);
  return arr_result;
}

// PDM 로그 기간 공통 함수 - 기간
async function getLogDataForRange(req) {
  let arr_result = [];  // 결과값 저장

  const logtype = req.body.log_type;
  const searchtype = req.body.search_type;
  const searchstartdate = req.body.search_start_date;
  const searchenddate = req.body.search_end_date;
  const user_id = req.body.user_id;   
  const excuserid = req.body.exc_user_id;  
  
  try {      
    const values = [
      { key:'LOG_TYPE', value:logtype},
      { key:'SEARCH_TYPE', value:searchtype},
      { key:'SEARCH_START_DATE', value:searchstartdate},
      { key:'SEARCH_END_DATE', value:searchenddate},
      { key:'USER_ID', value:user_id},
      { key:'EXC_USER_ID', value:getExcludeData(excuserid)},
    ]

    const reault_data = await getResultData('SP_PDM_LOG_RANGE', values);
    
    reault_data.forEach((data, idx) => {
      let logdata = new Object() ;
      
      logdata.id = idx;        
      logdata.userid = data.user_id;        
      logdata.username = data.user_name;        
      logdata.department = data.department;        
      logdata.logdata = [data.cnt];        
  
      arr_result[idx] = logdata;
    });      

  } catch (err) {
    console.log(err);
  }
  console.log("getLogDataForRange arr_result==>", arr_result);
  return arr_result;
}

// 상세 PDM 로그 공통 함수
async function getDetailLogData(req) {
  let arr_result = [];  // 결과값 저장  

  const logtype = req.body.log_type;
  const searchtype = req.body.search_type;
  const searchdate = req.body.search_date;
  const user_id = req.body.user_id;   

  try {                 
    const values = [
      { key:'LOG_TYPE', value:logtype},
      { key:'SEARCH_TYPE', value:searchtype},
      { key:'SEARCH_DATE', value:searchdate},        
      { key:'USER_ID', value:user_id},        
    ]

    const reault_data = await getResultData('SP_PDM_DETAIL_LOG', values);
  
    reault_data.forEach((data, idx) => {
      arr_result[idx] = data;
    });    

  } catch (err) {
    console.log(err);
  }
  console.log("getDetailLogData arr_result==>", arr_result);
  return arr_result;
}

// 상세 PDM 로그 공통 함수 - 기간
async function getDetailLogDataForRange(req) {
  let arr_result = [];  // 결과값 저장  

  const logtype = req.body.log_type;
  const searchstartdate = req.body.search_start_date;
  const searchenddate = req.body.search_end_date;
  const user_id = req.body.user_id;   

  try {                     
    const values = [
      { key:'LOG_TYPE', value:logtype},        
      { key:'SEARCH_START_DATE', value:searchstartdate},
      { key:'SEARCH_END_DATE', value:searchenddate},
      { key:'USER_ID', value:user_id},        
    ]

    const reault_data = await getResultData('SP_PDM_DETAIL_LOG_RANGE', values);
  
    reault_data.forEach((data, idx) => {
      arr_result[idx] = data;
    });    
    
  } catch (err) {
    console.log(err);
  }
  console.log("getDetailLogDataForRange arr_result==>", arr_result);
  return arr_result;
}

// PDM 로그
export const pdmLogList = async (req,res) => {  
  res.json(await getLogData(req));
}

// PDM 로그 - 기간
export const pdmLogListForRange = async (req,res) => {  
  res.json(await getLogDataForRange(req));
}

// PDM 상세 로그
export const pdmDetailList = async (req,res) => {    
  res.json(await getDetailLogData(req));
}

// PDM 상세 로그 - 기간
export const pdmDetailListForRange = async (req,res) => {    
  res.json(await getDetailLogDataForRange(req));
}



// --------------------- login log ---------------------------------------

// 제외 대상 사용자/라이선스 정리
function getExcludeData(arr) {  
  let result = "";  
  arr.forEach((element) => {
    result = result.concat("'").concat(element).concat("',");
  })

  if (result.length !== 0) result = result.substring(0, result.length - 1);  
  return result
}

// 로그인 로그(라이선스)
export const loginlicenseList = async (req,res) => {    
  let arr_result = [];  // 결과값 저장

  console.log("loginlicenseList req.body==>", req.body);

  const searchtype = req.body.search_type;
  const searchdate = req.body.search_date;
  const lic_id = req.body.lic_id;      
  const exclicid = req.body.exc_lic_id;
  const excuserid = req.body.exc_user_id;

  try {       
    if (lic_id !== '') {
      const values = [
        { key:'SEARCH_TYPE', value:searchtype},        
        { key:'SEARCH_DATE', value:searchdate},
        { key:'LIC_ID', value:lic_id},
        { key:'EXC_LIC_ID', value:getExcludeData(exclicid)},        
        { key:'EXC_USER_ID', value:getExcludeData(excuserid)},        
      ]
  
      const reault_data = await getResultData('SP_LOGIN_LOG_LICENSE', values);         

      reault_data.forEach((data, idx) => {
        let logdata = new Object() ;
        
        logdata.id = idx;
        logdata.licid = data.lic_id;        
        logdata.licname = data.lic_name;        
        logdata.holdqty = data.hold_qty;
        logdata.logdata = Object.values(JSON.parse(
          JSON.stringify(data, (key, value) => {            
            const ret = (typeof value !== "object") ? ((isNaN(parseInt(key))) ? undefined : value) : value;
            return ret;            
          })
        ));

        arr_result[idx] = logdata;
      });      
    }    
  } catch (err) {
    console.log(err);
  }
  console.log("loginlicenseList arr_result==>", arr_result);
  res.json(arr_result);
}

// 로그인 로그(라이선스) - 기간
export const loginlicenseListForRange = async (req,res) => {    
  let arr_result = [];  // 결과값 저장

  console.log("loginlicenseListForRange req.body==>", req.body);

  const searchtype = req.body.search_type;
  const searchstartdate = req.body.search_start_date;
  const searchenddate = req.body.search_end_date;
  const lic_id = req.body.lic_id;    
  const exclicid = req.body.exc_lic_id;
  const excuserid = req.body.exc_user_id;

  try {       
    if (lic_id !== '') {
      const values = [
        { key:'SEARCH_TYPE', value:searchtype},        
        { key:'SEARCH_START_DATE', value:searchstartdate},
        { key:'SEARCH_END_DATE', value:searchenddate},
        { key:'LIC_ID', value:lic_id},
        { key:'EXC_LIC_ID', value:getExcludeData(exclicid)},        
        { key:'EXC_USER_ID', value:getExcludeData(excuserid)},        
      ]
  
      const reault_data = await getResultData('SP_LOGIN_LOG_LICENSE_RANGE', values);  

      reault_data.forEach((data, idx) => {
        let logdata = new Object() ;
        
        logdata.id = idx;
        logdata.licid = data.lic_id;        
        logdata.licname = data.lic_name;        
        logdata.holdqty = data.hold_qty;
        logdata.logdata = [data.cnt];

        arr_result[idx] = logdata;
      });      
    }    
  } catch (err) {
    console.log(err);
  }
  console.log("loginlicenseListForRange arr_result==>", arr_result);
  res.json(arr_result);
}

// 로그인 로그(사용자)
export const loginuserList = async (req,res)=>{
  let arr_result = [];  // 결과값 저장
  
  console.log("loginuserList req.body==>", req.body);

  const searchtype = req.body.search_type;
  const searchdate = req.body.search_date;
  const lic_id = req.body.lic_id;     
  const exclicid = req.body.exc_lic_id;
  const excuserid = req.body.exc_user_id;  
  
  try {          
    if (lic_id !== '') {
      const values = [
        { key:'SEARCH_TYPE', value:searchtype},        
        { key:'SEARCH_DATE', value:searchdate},
        { key:'LIC_ID', value:lic_id},
        { key:'EXC_LIC_ID', value:getExcludeData(exclicid)},        
        { key:'EXC_USER_ID', value:getExcludeData(excuserid)},        
      ]
  
      const reault_data = await getResultData('SP_LOGIN_LOG_USER', values);    

      reault_data.forEach((data, idx) => {
        let logdata = new Object() ;
        
        logdata.id = idx;
        logdata.userid = data.user_id;        
        logdata.username = data.user_name;        
        logdata.department = data.department;
        logdata.pcname = data.pc_name;
        
        logdata.logdata = Object.values(JSON.parse(
          JSON.stringify(data, (key, value) => {
            const ret = (typeof value !== "object") ? ((isNaN(parseInt(key))) ? undefined : value) : value;
            return ret;            
          })
        ));

        arr_result[idx] = logdata;
      });      
    }
    console.log("loginuserList arr_result==>", arr_result);
    res.json(arr_result);
  } catch (err) {
    console.log(err);
  }    
}

// 로그인 로그(사용자) - 기간
export const loginuserListForRange = async (req,res)=>{
  let arr_result = [];  // 결과값 저장

  console.log("loginuserListForRange req.body==>", req.body);

  const searchtype = req.body.search_type;
  const searchstartdate = req.body.search_start_date;
  const searchenddate = req.body.search_end_date;
  const lic_id = req.body.lic_id;     
  const exclicid = req.body.exc_lic_id;
  const excuserid = req.body.exc_user_id;  
  
  try {          
    if (lic_id !== '') {
      const values = [
        { key:'SEARCH_TYPE', value:searchtype},        
        { key:'SEARCH_START_DATE', value:searchstartdate},
        { key:'SEARCH_END_DATE', value:searchenddate},
        { key:'LIC_ID', value:lic_id},
        { key:'EXC_LIC_ID', value:getExcludeData(exclicid)},        
        { key:'EXC_USER_ID', value:getExcludeData(excuserid)},        
      ]
  
      const reault_data = await getResultData('SP_LOGIN_LOG_USER_RANGE', values);

      reault_data.forEach((data, idx) => {
        let logdata = new Object() ;
        
        logdata.id = idx;
        logdata.userid = data.user_id;        
        logdata.username = data.user_name;        
        logdata.department = data.department;
        logdata.pcname = data.pc_name;
        logdata.logdata = [data.cnt];

        arr_result[idx] = logdata;
      });      
    }
    console.log("loginuserListForRange arr_result==>", arr_result);
    res.json(arr_result);
  } catch (err) {
    console.log(err);
  }    
}

// 로그인 로그(라이선스) - 상세
export const loginlicenseDeatilList = async (req,res)=>{
  let arr_result = [];  // 결과값 저장

  console.log("loginlicenseDeatilList req.body==>", req.body);
  
  try {          
    const searchtype = req.body.search_type;
    let values = [];

    if (searchtype === 'range') {
      const searchstartdate = req.body.search_start_date;
      const searchenddate = req.body.search_end_date;
      const licid = req.body.lic_id;       
      const excuserid = req.body.exc_user_id;  
  
      values = [
        { key:'SEARCH_TYPE', value:searchtype},        
        { key:'SEARCH_START_DATE', value:searchstartdate},
        { key:'SEARCH_END_DATE', value:searchenddate},
        { key:'LIC_ID', value:licid},             
        { key:'EXC_USER_ID', value:getExcludeData(excuserid)},        
      ]
    } else {
      const searchdate = req.body.search_date;      
      const licid = req.body.lic_id;       
      const excuserid = req.body.exc_user_id;  
  
      values = [
        { key:'SEARCH_TYPE', value:searchtype},        
        { key:'SEARCH_START_DATE', value:searchdate},
        { key:'SEARCH_END_DATE', value:''},
        { key:'LIC_ID', value:licid},             
        { key:'EXC_USER_ID', value:getExcludeData(excuserid)},        
      ]
    }

    const reault_data = await getResultData('SP_LOGIN_LIC_DETAIL_LOG', values);            

    reault_data.forEach((data, idx) => {
      let logdata = new Object() ;
      
      logdata.id = idx;
      logdata.logdate = data.logdate;        
      logdata.userid = data.user_id;        
      logdata.username = data.user_name;        
      logdata.department = data.department;
      logdata.pcname = data.pc_name;        

      arr_result[idx] = logdata;
    });      
    console.log("loginlicenseDeatilList arr_result==>", arr_result);
    res.json(arr_result);
  } catch (err) {
    console.log(err);
  }    
}

// 로그인 로그(사용자) - 상세
export const loginuserDeatilList = async (req,res)=>{
  let arr_result = [];  // 결과값 저장

  console.log("loginuserDeatilList req.body==>", req.body);

  try {          
    const searchtype = req.body.search_type;
    let values = [];

    if (searchtype === 'range') {
      const searchstartdate = req.body.search_start_date;
      const searchenddate = req.body.search_end_date;
      const licid = req.body.lic_id;       
      const userid = req.body.user_id;   
  
      values = [
        { key:'SEARCH_TYPE', value:searchtype},        
        { key:'SEARCH_START_DATE', value:searchstartdate},
        { key:'SEARCH_END_DATE', value:searchenddate},
        { key:'LIC_ID', value:licid},             
        { key:'USER_ID', value:userid},        
      ]
    } else {
      const searchdate = req.body.search_date;      
      const licid = req.body.lic_id;       
      const userid = req.body.user_id;  
  
      values = [
        { key:'SEARCH_TYPE', value:searchtype},        
        { key:'SEARCH_START_DATE', value:searchdate},
        { key:'SEARCH_END_DATE', value:''},
        { key:'LIC_ID', value:licid},             
        { key:'USER_ID', value:userid},        
      ]
    }

    const reault_data = await getResultData('SP_LOGIN_USER_DETAIL_LOG', values);            

    reault_data.forEach((data, idx) => {
      let logdata = new Object() ;
      
      logdata.id = idx;
      logdata.logdate = data.logdate;        
      logdata.userid = data.user_id;        
      logdata.username = data.user_name;        
      logdata.department = data.department;
      logdata.pcname = data.pc_name;        

      arr_result[idx] = logdata;
    });      
    
    console.log("loginuserDeatilList arr_result==>", arr_result);
    res.json(arr_result);
  } catch (err) {
    console.log(err);
  }    
}

// ------------------- user or license list --------------------------

// 라이선스 리스트
export const licenseList = async (req,res) => {  

  console.log("licenseList req.body==>", req.body);

  const searchtype = req.body.search_type;
  const searchdate = req.body.search_date;
  const exclicid = req.body.exc_lic_id;

  try {                    
    const values = [
      { key:'SEARCH_TYPE', value:searchtype},        
      { key:'SEARCH_DATE', value:searchdate},      
      { key:'EXC_LIC_ID', value:getExcludeData(exclicid)},        
    ]

    const reault_data = await getResultData('SP_LICENSE_LIST', values);

    console.log("licenseList reault_data==>", reault_data);
    res.json(reault_data);
  } catch (err) {
    console.log(err);
  }
}

// 라이선스 리스트 - 기간
export const licenseListForRange = async (req,res) => {

  console.log("licenseListForRange req.body==>", req.body);

  const searchstartdate = req.body.search_start_date;
  const searchenddate = req.body.search_end_date;
  const exclicid = req.body.exc_lic_id;

  try {                 
    const values = [
      { key:'SEARCH_START_DATE', value:searchstartdate},        
      { key:'SEARCH_END_DATE', value:searchenddate},      
      { key:'EXC_LIC_ID', value:getExcludeData(exclicid)},        
    ]

    const reault_data = await getResultData('SP_LICENSE_LIST_RANGE', values);

    console.log("licenseListForRange reault_data==>", reault_data);
    res.json(reault_data);
  } catch (err) {
    console.log(err);
  }
}

// 사용자 리스트
export const userList = async (req,res) => {

  console.log("userList req.body==>", req.body);

  const logtype = req.body.log_type;
  const searchtype = req.body.search_type;
  const searchdate = req.body.search_date;
  const excuserid = req.body.exc_user_id;
  
  try {                           
    const values = [
      { key:'LOG_TYPE', value:logtype},        
      { key:'SEARCH_TYPE', value:searchtype},
      { key:'SEARCH_DATE', value:searchdate},
      { key:'EXC_USER_ID', value:getExcludeData(excuserid)},        
    ]

    const reault_data = await getResultData('SP_USER_LIST', values);

    console.log("userList reault_data==>", reault_data);
    res.json(reault_data);
  } catch (err) {
    console.log(err);
  }
}

// 사용자 리스트 - 기간
export const userListForRange = async (req,res) => {

  console.log("userListForRange req.body==>", req.body);

  const logtype = req.body.log_type;  
  const searchstartdate = req.body.search_start_date;
  const searchenddate = req.body.search_end_date;
  const excuserid = req.body.exc_user_id;

  try {                 
    const values = [
      { key:'LOG_TYPE', value:logtype},        
      { key:'SEARCH_START_DATE', value:searchstartdate},
      { key:'SEARCH_END_DATE', value:searchenddate},
      { key:'EXC_USER_ID', value:getExcludeData(excuserid)},        
    ]

    const reault_data = await getResultData('SP_USER_LIST_RANGE', values);

    console.log("userListForRange reault_data==>", reault_data);
    res.json(reault_data);
  } catch (err) {
    console.log(err);
  }
}

