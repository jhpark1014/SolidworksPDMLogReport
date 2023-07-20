import {db} from "../db.js"

// 다운로드, 신규등록, 버전업 공통 함수
async function getLogData(tableName, req) {
  let arr_result = [];  // 결과값 저장
  const searchtype = req.body.search_type;
  const searchdate = req.body.search_date;
  const user_id = req.body.user_id;   
  const excuserid = req.body.exc_user_id;
  
  try {                 
    if (user_id !== '') {        
      const pool = await db;      
      const result = await pool
        .request()                  
        .input('SEARCH_TYPE', searchtype)
        .input('SEARCH_DATE', searchdate)
        .input('USER_ID', user_id)
        .input('EXC_USER_ID', getExcludeData(excuserid))
        //.output('TOTAL', 0)
        .execute('dbo.' + tableName)
        .then((result) => {
          const result_data = {
            //total: result.output.TOTAL,
            result: result.recordset,
          };            
          return result_data;
        })
        .catch((err) => {
          console.log('err', err);
        });                  

      const reault_data = result.result; 

      reault_data.forEach((data, idx) => {
        let logdata = new Object() ;
        
        logdata.id = idx;        
        logdata.userid = data.user_id;        
        logdata.username = data.user_name;        
        logdata.department = data.department;        

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
  console.log("arr_result==>", arr_result);
  return arr_result;
}


// 상세 다운로드, 신규등록, 버전업 공통 함수
async function getDetailLogData(tableName, req) {
  let arr_result = [];  // 결과값 저장  

  const searchtype = req.body.search_type;
  const searchdate = req.body.search_date;
  const user_id = req.body.user_id;   

  try {                 
    if (user_id !== '') {        
      const pool = await db;      
      const result = await pool
        .request()                          
        .input('SEARCH_TYPE', searchtype)
        .input('SEARCH_DATE', searchdate)
        .input('USER_ID', user_id)
        //.output('TOTAL', 0)
        .execute('dbo.' + tableName)
        .then((result) => {
          const result_data = {
            //total: result.output.TOTAL,
            result: result.recordset,
          };            
          return result_data;
        })
        .catch((err) => {
          console.log('err', err);
        });                  

      const reault_data = result.result; 
    
      reault_data.forEach((data, idx) => {
        arr_result[idx] = data;
      });    
    }   
  } catch (err) {
    console.log(err);
  }
  console.log("arr_result==>", arr_result);
  return arr_result;
}

// 다운로드 로그
export const downloadList = async (req,res) => {  
  res.json(await getLogData("SP_DOWNLOAD_LOG", req));
}

// 상세 다운로드 로그
export const downloadDetailList = async (req,res) => {    
  res.json(await getDetailLogData("SP_DOWNLOAD_DETAIL_LOG", req));
}

// 신규 등록 로그
export const newcreateList = async (req,res)=>{
    //res.json("newcreateList from controller");
    res.json(await getLogData("SP_NEWCREATE_LOG", req));
}

// 상세 신규 등록 로그
export const newcreateDetailList = async (req,res) => {  
  res.json(await getDetailLogData("SP_NEWCREATE_DETAIL_LOG", req));
}

// 버전업 로그
export const versionupList = async (req,res)=>{
    //res.json("versionupList from controller");
    res.json(await getLogData("SP_VERSIONUP_LOG", req));
}

// 상세 버전업 로그
export const versionupDetailList = async (req,res) => {  
  res.json(await getDetailLogData("SP_VERSIONUP_DETAIL_LOG", req));
}

// 로그인 로그(사용자)
export const loginuserList = async (req,res)=>{
  let arr_result = [];  // 결과값 저장
  const searchtype = req.body.search_type;
  const searchdate = req.body.search_date;
  const lic_id = req.body.lic_id;     
  const excuserid = req.body.exc_user_id;  
  
  try {          
    if (lic_id !== '') {

      const pool = await db;      
      const result = await pool
        .request()                  
        .input('SEARCH_TYPE', searchtype)
        .input('SEARCH_DATE', searchdate)
        .input('LIC_ID', lic_id)         
        .input('EXC_USER_ID', getExcludeData(excuserid))      
        //.output('TOTAL', 0)
        .execute('dbo.SP_LOGIN_LOG_USER')
        .then((result) => {
          const result_data = {
            //total: result.output.TOTAL,
            result: result.recordset,
          };            
          return result_data;
        })
        .catch((err) => {
          console.log('err', err);
        });                  

      const reault_data = result.result;                

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
    console.log("arr_result==>", arr_result);
    res.json(arr_result);
  } catch (err) {
    console.log(err);
  }    
}

// 로그인 로그(라이선스), /logs/loginlicense
export const loginlicenseList = async (req,res) => {    
  let arr_result = [];  // 결과값 저장
  const searchtype = req.body.search_type;
  const searchdate = req.body.search_date;
  const lic_id = req.body.lic_id;    
  const exclicid = req.body.exc_lic_id;

  try {       
    if (lic_id !== '') {

      const pool = await db;      
      const result = await pool
        .request()                  
        .input('SEARCH_TYPE', searchtype)
        .input('SEARCH_DATE', searchdate)
        .input('LIC_ID', lic_id)
        .input('EXC_LIC_ID', getExcludeData(exclicid))      
        //.output('TOTAL', 0)
        .execute('dbo.SP_LOGIN_LOG_LICENSE')
        .then((result) => {
          const result_data = {
            //total: result.output.TOTAL,
            result: result.recordset,
          };            
          return result_data;
        })
        .catch((err) => {
          console.log('err', err);
        });                  
      
      const reault_data = result.result;                

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
    console.log("arr_result==>", arr_result);
    res.json(arr_result);
  } catch (err) {
    console.log(err);
  }
}

function getExcludeData(arr) {  
  let result = "";  
  arr.forEach((element) => {
    result = result.concat("'").concat(element).concat("',");
  })

  if (result.length !== 0) result = result.substring(0, result.length - 1);  
  return result
}


// 라이선스 리스트
export const licenseList = async (req,res) => {
  //res.json("licenseList from controller");
  const searchtype = req.body.search_type;
  const searchdate = req.body.search_date;
  const exclicid = req.body.exc_lic_id;

  try {                 
    const pool = await db;      
    const result = await pool
      .request()                  
      .input('SEARCH_TYPE', searchtype)
      .input('SEARCH_DATE', searchdate)      
      .input('EXC_LIC_ID', getExcludeData(exclicid))      
      //.output('TOTAL', 0)
      .execute('dbo.SP_LICENSE_LIST')
      .then((result) => {
        const result_data = {
          //total: result.output.TOTAL,
          result: result.recordset,
        };            
        return result_data;
      })
      .catch((err) => {
        console.log('err', err);
      });                  

    const reault_data = result.result;                
    console.log("reault_data==>", reault_data);
    res.json(reault_data);
  } catch (err) {
    console.log(err);
  }
}


// 사용자 리스트
export const userList = async (req,res) => {
  //res.json("userList from controller");
  const logtype = req.body.log_type;
  const searchtype = req.body.search_type;
  const searchdate = req.body.search_date;
  const excuserid = req.body.exc_user_id;
  
  try {                 
    const pool = await db;      
    const result = await pool
      .request()                  
      .input('LOG_TYPE', logtype)
      .input('SEARCH_TYPE', searchtype)
      .input('SEARCH_DATE', searchdate)      
      .input('EXC_USER_ID', getExcludeData(excuserid))      
      //.output('TOTAL', 0)
      .execute('dbo.SP_USER_LIST')
      .then((result) => {
        const result_data = {
          //total: result.output.TOTAL,
          result: result.recordset,
        };            
        return result_data;
      })
      .catch((err) => {
        console.log('err', err);
      });                  

    const reault_data = result.result;                
    console.log("reault_data==>", reault_data);
    res.json(reault_data);
  } catch (err) {
    console.log(err);
  }
}

