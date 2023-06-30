import {db} from "../db.js"

export const downloadList = (req,res)=>{
    res.json("downloadList from controller");
    const q = "";
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
    // res.json("loginuserList from controller");
    // console.log("req==>", req);
    // console.log("req.body==>", req.body);
    console.log("req.query==>", req.query);
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
          //console.log(result);          
          return result_data;
        })
        .catch((err) => {
          console.log('err', err);
        });
            
      console.log("result==>", result);

      const reault_data = result.result;
      const count = result.result.length;            
            
      let arr_icon = [];

      reault_data.forEach((data, idx) => {
        let logdata = new Object() ;
        
        logdata.user_name = data.USER_NAME;        
        logdata.department = '';

        logdata.log_data = Object.values(JSON.parse(
          JSON.stringify(data, (key, value) => {
            if (typeof value === "string") {
              return undefined;
            }
            return value;
          })
        ));
        //logdata.log_data = Object.values(JSON.parse(temp));

        arr_icon[idx] = logdata;
      });
      
      //  console.log("arr_icon==>", arr_icon);

      res.json(arr_icon);
    } catch (err) {
      console.log(err);
    }
    
}

export const loginlicenseList = (req,res)=>{
    res.json("loginlicenseList from controller");
}