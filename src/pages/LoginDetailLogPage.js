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
  { label: '사용자', key: 'username' },
  { label: '장치명', key: 'pcname' },
];
// ----------------------------------------------------------------------

const excludeLicName = process.env.REACT_APP_EXCLUDE_LIC_NAME;
const excludeLicArray = typeof excludeLicName === 'string' ? excludeLicName.trim().split(',') : '';

const excludeUserName = process.env.REACT_APP_EXCLUDE_USER_NAME;
const excludeUserArray = typeof excludeUserName === 'string' ? excludeUserName.trim().split(',') : '';

LoginDetailLogPage.propTypes = {
  data: PropTypes.string,
  searchType: PropTypes.string,
  searchDate: PropTypes.string,
  searchLicense: PropTypes.string,
};

export default function LoginDetailLogPage({ data, searchType, searchDate, searchLicense, time }) {
  const [isLoading, setIsLoading] = useState(true); // loding
  const [open, setOpen] = useState(false); // dialog open
  // const [detailLogData, setDetailLogData] = useState([]); // detail log data
  const [filteredLogData, setFilteredLogData] = useState([]); // filtered detail log data

  const callLogData = async (searchType, searchDate, searchLicense) => {
    const url = `/logs/loginuser`;
    const data = {
      search_type: searchType,
      search_date: searchDate,
      lic_id: searchLicense,
      exc_lic_id: excludeLicArray,
      exc_user_id: excludeUserArray,
    };
    const config = { 'Content-Type': 'application/json' };
    let detailLogData = [];

    await axios
      .post(url, data, config)
      .then((res) => {
        // success
        // setDetailLogData(res.data);
        res.data.forEach((row) => {
          if (row.logdata[time] !== 0) {
            detailLogData = detailLogData.concat({
              username: row.username,
              pcname: row.pcname,
            });
          }
        });
        setFilteredLogData(detailLogData);
        setIsLoading(false);
      })
      .catch((err) => {
        // error
        console.log(err.response.data.message); // server error message
      });
  };

  const handleClickOpen = () => () => {
    setOpen(true);
    callLogData(searchType, searchDate, searchLicense);
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
                      {data.loglicensename}, {filteredLogData.length} 건
                    </Typography>
                  </TableCell>
                  {/* <TableCell align="right" sx={{ padding: 1, backgroundColor: 'white' }}>
                    <Button>
                      <CSVLink
                        headers={DETAIL_HEAD}
                        data={detailLogData}
                        filename={sParam
                          .toUpperCase()
                          .concat('_')
                          .concat(data.logusername)
                          .concat('_')
                          .concat(t)
                          .concat('.csv')}
                        target="_blank"
                      >
                        EXPORT
                      </CSVLink>
                    </Button>
                  </TableCell> */}
                </TableRow>
                <TableRow>
                  {DETAIL_HEAD.map((headCell) => (
                    <TableCell key={headCell.key} align={headCell.alignRight ? 'right' : 'left'}>
                      <Typography variant="subtitle2" noWrap>
                        {headCell.label}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading
                  ? 'Loading...'
                  : filteredLogData.map((row, idx) => {
                      const { username, pcname } = row;
                      return (
                        <TableRow hover key={idx} tabIndex={-1}>
                          <TableCell align="left">{username}</TableCell>
                          <TableCell align="left">{pcname}</TableCell>
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
