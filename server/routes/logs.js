import express from "express"
import {downloadList, downloadDetailList, 
    newcreateList, newcreateDetailList, 
    versionupList, versionupDetailList, 
    loginuserList, loginlicenseList, 
    userList, licenseList} from "../controllers/log.js"

const router = express.Router();

router.post("/download", downloadList);
router.post("/download/detail", downloadDetailList);
router.post("/newcreate", newcreateList);
router.post("/newcreate/detail", newcreateDetailList);
router.post("/versionup", versionupList);
router.post("/versionup/detail", versionupDetailList);
router.get("/loginuser", loginuserList);
router.get("/loginlicense", loginlicenseList);
router.get("/userlist", userList);
router.get("/licenselist", licenseList);

export default router