import {db} from "../db.js"

export const downloadList = async (req,res)=>{
    //res.json("downloadList from controller");
    const searchtype = req.query.search_type;
    const searchdate = req.query.search_date;
    const user_name = req.query.user_name;    
    try {                 
      const pool = await db;      
      const result = await pool
        .request()                  
        .input('SEARCH_TYPE', searchtype)
        .input('SEARCH_DATE', searchdate)
        .input('USER_NAME', user_name)
        //.output('TOTAL', 0)
        .execute('dbo.SP_DOWNLOAD_LOG')
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
            
      let arr_result = [];  // 결과값 저장

      reault_data.forEach((data, idx) => {
        let logdata = new Object() ;
        
        logdata.user_name = data.user_name;        
        logdata.department = data.department;
        //console.log("data==>", data);
        logdata.log_data = Object.values(JSON.parse(
          JSON.stringify(data, (key, value) => {            
            // 6/30 이렇게 변경            
            const ret = (typeof value !== "object") ? ((isNaN(parseInt(key))) ? undefined : value) : value;
            return ret;            
          })
        ));

        arr_result[idx] = logdata;
      });      

      res.json(arr_result);
    } catch (err) {
      console.log(err);
    }
}
export const newcreateList = (req,res)=>{
    res.json("newcreateList from controller");
}
export const versionupList = (req,res)=>{
    res.json("versionupList from controller");
}

// function replacer(key, value) {
//   if (typeof value === "string") {
//     return undefined;
//   }
//   return value;
// }

export const loginuserList = async (req,res)=>{
    const searchtype = req.query.search_type;
    const searchdate = req.query.search_date;
    const lic_name = req.query.lic_name;    
    try {                 
      const pool = await db;      
      const result = await pool
        .request()                  
        .input('SEARCH_TYPE', searchtype)
        .input('SEARCH_DATE', searchdate)
        .input('LIC_NAME', lic_name)
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
            
      let arr_result = [];  // 결과값 저장

      reault_data.forEach((data, idx) => {
        let logdata = new Object() ;
        
        logdata.user_name = data.user_name;        
        logdata.department = '';
        // console.log("data==>", data);
        logdata.log_data = Object.values(JSON.parse(
          JSON.stringify(data, (key, value) => {
            // 6/28 string이 아닌 값만 리턴
            // 만약 원하는 결과가 나오지 않으면 로직 다시 고민 필요...
            // if (typeof value === "string") {
            //   return undefined;
            // }
            // return value;

            // 6/30 이렇게 변경
            // 칼럼명이 숫자로 되어 있으면 OK
            // 왜...?? 인지는 모르겠지만... 처음에 한번 value 가 data 값을 전제(object) 가져옴. 그 이후는 data의 개별 값 가져옴.
            // 그래서 value가 "object" 일때 skip 함
            // console.log("value==>", value); // 이거 찍어보면 알수 있음.
            // 원인을 찾으면 입력하기로 함
            const ret = (typeof value !== "object") ? ((isNaN(parseInt(key))) ? undefined : value) : value;
            return ret;            
          })
        ));

        arr_result[idx] = logdata;
      });      

      res.json(arr_result);
    } catch (err) {
      console.log(err);
    }    
}

export const loginlicenseList = async (req,res) => {
    //res.json("loginlicenseList from controller");
    const searchtype = req.query.search_type;
    const searchdate = req.query.search_date;
    const lic_name = req.query.lic_name;    
    try {                 
      const pool = await db;      
      const result = await pool
        .request()                  
        .input('SEARCH_TYPE', searchtype)
        .input('SEARCH_DATE', searchdate)
        .input('LIC_NAME', lic_name)
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
            
      let arr_result = [];  // 결과값 저장

      reault_data.forEach((data, idx) => {
        let logdata = new Object() ;
        
        logdata.lic_name = data.lic_name;        
        logdata.hold_qty = data.hold_qty;
        //console.log("data==>", data);
        logdata.log_data = Object.values(JSON.parse(
          JSON.stringify(data, (key, value) => {            
            // 6/30 이렇게 변경            
            const ret = (typeof value !== "object") ? ((isNaN(parseInt(key))) ? undefined : value) : value;
            return ret;            
          })
        ));

        arr_result[idx] = logdata;
      });      

      res.json(arr_result);
    } catch (err) {
      console.log(err);
    }
}