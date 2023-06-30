import express from "express"
import {downloadList, newcreateList, versionupList, loginuserList, loginlicenseList} from "../controllers/log.js"

const router = express.Router();

router.get("/download", downloadList);
router.get("/newcreate", newcreateList);
router.get("/versionup", versionupList);
router.get("/loginuser", loginuserList);
router.get("/loginlicense", loginlicenseList);

export default router