import express from "express"
import sql from "mssql"
import dotenv from "dotenv"
import logRoutes from "./routes/logs.js"

const app = express();

dotenv.config();


app.use(express.json());
app.use("/logs", logRoutes);

app.listen(9900, async ()=>{
    console.log("Connected~!============================================================================================");
    // try {
    //     // make sure that any items are correctly URL encoded in the connection string
    //     await sql.connect(sqlConfig)
    //     const result = await sql.query`EXEC dbo.SP_LOGIN_LOG_USER '2023-06-26 00:00:00.000', '2023-06-26 23:59:59.999', 'solidworks'`
    //     console.dir(result)
    //    } catch (err) {
    //     // ... error checks
    //     console.log(err)
    // }
})