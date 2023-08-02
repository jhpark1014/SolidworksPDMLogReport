import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
// @mui
import {
  Button,
  Link,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
// components
import { CSVLink } from 'react-csv';
// sections
// import { LogListHead } from '../sections/@dashboard/log';

// ----------------------------------------------------------------------
const DETAIL_HEAD = [
  { label: '접속계정', key: 'userid' },
  { label: '접속장치', key: 'pcname' },
  { label: '사용자(PDM)', key: 'username' },
  { label: '부서(PDM)', key: 'department' },
];

const DETAIL_HEAD_RANGE = [
  { label: '접속일', key: 'logdate' },
  { label: '접속계정', key: 'userid' },
  { label: '접속장치', key: 'pcname' },
  { label: '사용자(PDM)', key: 'username' },
  { label: '부서(PDM)', key: 'department' },
];
// ----------------------------------------------------------------------

const excludeLicName = process.env.REACT_APP_EXCLUDE_LIC_NAME;
const excludeLicArray = typeof excludeLicName === 'string' ? excludeLicName.trim().split(',') : '';

const excludeUserName = process.env.REACT_APP_EXCLUDE_USER_NAME;
const excludeUserArray = typeof excludeUserName === 'string' ? excludeUserName.trim().split(',') : '';

LicenseLoginDetailLogPage.propTypes = {
  data: PropTypes.object,
  searchType: PropTypes.string,
  searchLicense: PropTypes.string,
  searchDate: PropTypes.string,
  searchStartDate: PropTypes.string,
  searchEndDate: PropTypes.string,
};

export default function LicenseLoginDetailLogPage({
  data,
  searchType,
  searchLicense,
  searchDate,
  searchStartDate,
  searchEndDate,
}) {
  const [isLoading, setIsLoading] = useState(true); // loading
  const [open, setOpen] = useState(false); // dialog open
  const [detailLogData, setDetailLogData] = useState([]); // detail log data
  // const [filteredLogData, setFilteredLogData] = useState([]); // filtered detail log data

  const callLogData = async (searchType, searchDate, searchLicense) => {
    const url = `/logs/loginlicense/detail`;
    const data = {
      search_type: searchType,
      search_date: searchDate,
      lic_id: searchLicense,
      exc_user_id: excludeUserArray,
    };
    const config = { 'Content-Type': 'application/json' };

    await axios
      .post(url, data, config)
      .then((res) => {
        // success
        setDetailLogData(res.data);
        console.log('consolee', res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        // error
        console.log(err.response.data.message); // server error message
      });
  };

  const callLogRangeData = async (searchType, searchStartDate, searchEndDate, searchLicense) => {
    const url = `/logs/loginlicense/detail`;
    const data = {
      search_type: searchType,
      search_start_date: searchStartDate,
      search_end_date: searchEndDate,
      lic_id: searchLicense,
      exc_user_id: excludeUserArray,
    };
    const config = { 'Content-Type': 'application/json' };

    await axios
      .post(url, data, config)
      .then((res) => {
        // success
        setDetailLogData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        // error
        console.log(err.response.data.message); // server error message
      });
  };

  const handleClickOpen = () => () => {
    setOpen(true);
    if (searchType !== 'range') {
      callLogData(searchType, searchDate, searchLicense);
    } else {
      callLogRangeData(searchType, searchStartDate, searchEndDate, searchLicense); // searchDate는 searchStartDate
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const today = dayjs();
  const t = today.format('YYYYMMDD_HHmmss'); // 오늘 날짜(년-월) 리턴

  return (
    <>
      <Link component="button" onClick={handleClickOpen()}>
        {data.logdata}
      </Link>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="lg"
      >
        <DialogTitle id="scroll-dialog-title">상세 로그인 리스트</DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left" colSpan={2} sx={{ padding: 1, backgroundColor: 'white' }}>
                    <Typography variant="subtitle1" noWrap>
                      {data.loglicensename}, {detailLogData.length} 건
                    </Typography>
                  </TableCell>
                  {searchType === 'range' ? <TableCell sx={{ backgroundColor: 'white' }} /> : ''}
                  <TableCell sx={{ backgroundColor: 'white' }} />
                  <TableCell align="right" sx={{ padding: 1, backgroundColor: 'white' }}>
                    <Button>
                      <CSVLink
                        headers={searchType === 'range' ? DETAIL_HEAD_RANGE : DETAIL_HEAD}
                        data={detailLogData}
                        filename={'라이선스 로그인 상세'
                          .concat('_')
                          .concat(data.loglicensename)
                          .concat('_')
                          .concat(t)
                          .concat('.csv')}
                        target="_blank"
                        style={{ textDecoration: 'none' }}
                      >
                        EXPORT
                      </CSVLink>
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  {searchType === 'range'
                    ? DETAIL_HEAD_RANGE.map((headCell) => (
                        <TableCell key={headCell.key} align={headCell.alignRight ? 'right' : 'left'}>
                          <Typography variant="subtitle2" noWrap>
                            {headCell.label}
                          </Typography>
                        </TableCell>
                      ))
                    : DETAIL_HEAD.map((headCell) => (
                        <TableCell key={headCell.key} align={headCell.alignRight ? 'right' : 'left'}>
                          <Typography variant="subtitle2" noWrap>
                            {headCell.label}
                          </Typography>
                        </TableCell>
                      ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {searchType === 'range'
                  ? isLoading
                    ? 'Loading...'
                    : detailLogData.map((row, idx) => {
                        const { logdate, userid, pcname, username, department } = row;
                        return (
                          <TableRow hover key={idx} tabIndex={-1}>
                            <TableCell align="left">{logdate}</TableCell>
                            <TableCell align="left">{userid}</TableCell>
                            <TableCell align="left">{pcname}</TableCell>
                            <TableCell align="left">{username}</TableCell>
                            <TableCell align="left">{department}</TableCell>
                          </TableRow>
                        );
                      })
                  : isLoading
                  ? 'Loading...'
                  : detailLogData.map((row, idx) => {
                      const { userid, pcname, username, department } = row;
                      return (
                        <TableRow hover key={idx} tabIndex={-1}>
                          <TableCell align="left">{userid}</TableCell>
                          <TableCell align="left">{pcname}</TableCell>
                          <TableCell align="left">{username}</TableCell>
                          <TableCell align="left">{department}</TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
