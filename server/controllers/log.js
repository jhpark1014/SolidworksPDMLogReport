import {db} from "../db.js"

// 다운로드, 신규등록, 버전업 공통 함수
async function getLogData(tableName, req) {
  let arr_result = [];  // 결과값 저장
  const searchtype = req.query.search_type;
  const searchdate = req.query.search_date;
  const user_id = req.query.user_id;   

  try {                 
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
      let logdata = new Object() ;
      
      logdata.id = idx;        
      logdata.userid = data.user_id;        
      logdata.username = data.user_name;        
      logdata.department = data.department;
      //console.log("data==>", data);

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
  console.log("arr_result==>", arr_result);
  return arr_result;
}

// 다운로드 로그
export const downloadList = async (req,res) => {
  //res.json("downloadList from controller");
  res.json(await getLogData("SP_DOWNLOAD_LOG", req));
}

// 신규 등록 로그
export const newcreateList = async (req,res)=>{
    //res.json("newcreateList from controller");
    res.json(await getLogData("SP_NEWCREATE_LOG", req));
}

// 버전업 로그
export const versionupList = async (req,res)=>{
    //res.json("versionupList from controller");
    res.json(await getLogData("SP_VERSIONUP_LOG", req));
}

// 로그인 로그(사용자)
export const loginuserList = async (req,res)=>{
  const searchtype = req.query.search_type;
  const searchdate = req.query.search_date;
  const lic_id = req.query.lic_id;    
  try {          
    let arr_result = [];  // 결과값 저장

    if (lic_id !== '') {
      const pool = await db;      
      const result = await pool
        .request()                  
        .input('SEARCH_TYPE', searchtype)
        .input('SEARCH_DATE', searchdate)
        .input('LIC_ID', lic_id)
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
        // console.log("data==>", data);
        logdata.logdata = Object.values(JSON.parse(
          JSON.stringify(data, (key, value) => {
            // pivot 데이터를 배열에 담기

            // 6/28 string이 아닌 값만 배열에 담기
            // 만약 원하는 결과가 나오지 않으면 로직 다시 고민 필요...
            // if (typeof value === "string") {
            //   return undefined;
            // }
            // return value;

            // 6/30 이렇게 변경
            // 칼럼명이 숫자로 되어 있으면 배열에 담기
            // 왜...?? 인지는 모르겠지만... 처음에 한번 value 가 전제 data 값을(object) 가져옴. 그 이후는 data의 개별 값 가져옴.
            // 그래서 value가 "object" 일때 skip 함. console.log("value==>", value); // 이거 찍어보면 알수 있음.
            // 원인을 찾으면 입력하기로 함
            const ret = (typeof value !== "object") ? ((isNaN(parseInt(key))) ? undefined : value) : value;
            return ret;            
          })
        ));

        arr_result[idx] = logdata;
      });      
    }
    res.json(arr_result);
  } catch (err) {
    console.log(err);
  }    
}

// 로그인 로그(라이선스), /logs/loginlicense
export const loginlicenseList = async (req,res) => {
  //res.json("loginlicenseList from controller");
  const searchtype = req.query.search_type;
  const searchdate = req.query.search_date;
  const lic_id = req.query.lic_id;    
  try {       
    let arr_result = [];  // 결과값 저장

    if (lic_id !== '') {
      const pool = await db;      
      const result = await pool
        .request()                  
        .input('SEARCH_TYPE', searchtype)
        .input('SEARCH_DATE', searchdate)
        .input('LIC_ID', lic_id)
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

    res.json(arr_result);
  } catch (err) {
    console.log(err);
  }
}

// 라이선스 리스트
export const licenseList = async (req,res) => {
  //res.json("licenseList from controller");
  const searchtype = req.query.search_type;
  const searchdate = req.query.search_date;
      
  try {                 
    const pool = await db;      
    const result = await pool
      .request()                  
      .input('SEARCH_TYPE', searchtype)
      .input('SEARCH_DATE', searchdate)      
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
     
    res.json(reault_data);
  } catch (err) {
    console.log(err);
  }
}

// 사용자 리스트
export const userList = async (req,res) => {
  //res.json("userList from controller");
  const searchtype = req.query.search_type;
  const searchdate = req.query.search_date;
      
  try {                 
    const pool = await db;      
    const result = await pool
      .request()                  
      .input('SEARCH_TYPE', searchtype)
      .input('SEARCH_DATE', searchdate)      
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
    
    res.json(reault_data);
  } catch (err) {
    console.log(err);
  }
}

