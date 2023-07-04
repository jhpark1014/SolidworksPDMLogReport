import express from "express"
import {downloadList, newcreateList, versionupList, loginuserList, loginlicenseList, userList, licenseList} from "../controllers/log.js"

const router = express.Router();

router.get("/download", downloadList);
router.get("/newcreate", newcreateList);
router.get("/versionup", versionupList);
router.get("/loginuser", loginuserList);
router.get("/loginlicense", loginlicenseList);
router.get("/userlist", userList);
router.get("/licenselist", licenseList);

export default router