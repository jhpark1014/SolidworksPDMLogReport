import express from "express"
import {
    pdmLogList, pdmLogListForRange, 
    pdmDetailList, pdmDetailListForRange,
    loginuserList, loginlicenseList, 
    loginuserListForRange, loginlicenseListForRange, 
    userList, licenseList,
    userListForRange, licenseListForRange,
    } from "../controllers/log.js"

const router = express.Router();

router.post("/download", pdmLogList);
router.post("/download/range", pdmLogListForRange);
router.post("/download/detail", pdmDetailList);
router.post("/download/detail/range", pdmDetailListForRange);
router.post("/newcreate", pdmLogList);
router.post("/newcreate/range", pdmLogListForRange);
router.post("/newcreate/detail", pdmDetailList);
router.post("/newcreate/detail/range", pdmDetailListForRange);
router.post("/versionup", pdmLogList);
router.post("/versionup/range", pdmLogListForRange);
router.post("/versionup/detail", pdmDetailList);
router.post("/versionup/detail/range", pdmDetailListForRange);
router.post("/loginlicense", loginlicenseList);
router.post("/loginlicense/range", loginlicenseListForRange);
router.post("/loginuser", loginuserList);
router.post("/loginuser/range", loginuserListForRange);
router.post("/userlist", userList);
router.post("/userlist/range", userListForRange);
router.post("/licenselist", licenseList);
router.post("/licenselist/range", licenseListForRange);

export default router