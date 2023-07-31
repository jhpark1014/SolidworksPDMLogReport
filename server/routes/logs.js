import express from "express"
import {
    pdmLogList, pdmLogListForRange, 
    pdmDetailList, pdmDetailListForRange,
    loginuserList, loginlicenseList, 
    loginuserListForRange, loginlicenseListForRange,     
    userList, licenseList,
    userListForRange, licenseListForRange,
    loginlicenseDeatilList, loginuserDeatilList
    } from "../controllers/log.js"

const router = express.Router();

router.post("/download", pdmLogList);
router.post("/download/detail", pdmDetailList);
router.post("/download/range", pdmLogListForRange);
router.post("/download/range/detail", pdmDetailListForRange);
router.post("/newcreate", pdmLogList);
router.post("/newcreate/detail", pdmDetailList);
router.post("/newcreate/range", pdmLogListForRange);
router.post("/newcreate/range/detail", pdmDetailListForRange);
router.post("/versionup", pdmLogList);
router.post("/versionup/detail", pdmDetailList);
router.post("/versionup/range", pdmLogListForRange);
router.post("/versionup/range/detail", pdmDetailListForRange);
router.post("/engchange", pdmLogList);
router.post("/engchange/detail", pdmDetailList);
router.post("/engchange/range", pdmLogListForRange);
router.post("/engchange/range/detail", pdmDetailListForRange);

router.post("/loginlicense", loginlicenseList);
router.post("/loginlicense/range", loginlicenseListForRange);
router.post("/loginlicense/detail", loginlicenseDeatilList);
router.post("/loginuser", loginuserList);
router.post("/loginuser/range", loginuserListForRange);
router.post("/loginuser/detail", loginuserDeatilList);

router.post("/userlist", userList);
router.post("/userlist/range", userListForRange);
router.post("/licenselist", licenseList);
router.post("/licenselist/range", licenseListForRange);

export default router