import express from "express"
import dotenv from "dotenv"
import logRoutes from "./routes/logs.js"

const app = express();

dotenv.config();

app.use(express.json());
app.use("/logs", logRoutes);

app.listen(9900, async ()=>{
    console.log("Connected~!===========================================================");
})