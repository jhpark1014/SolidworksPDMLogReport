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
  { label: '로그일자', key: 'datetime' },
  { label: '파일명', key: 'filename' },
  { label: '버전', key: 'version' },
  { label: '파일사이즈', key: 'filesize' },
];
// ----------------------------------------------------------------------

PDMDetailLogPage.propTypes = {
  isDividers: PropTypes.bool,
  logusername: PropTypes.string,
  logdata: PropTypes.number,
  sParam: PropTypes.string,
  searchType: PropTypes.string,
  searchDate: PropTypes.string,
  searchStartDate: PropTypes.string,
  searchEndDate: PropTypes.string,
  searchUser: PropTypes.string,
};

export default function PDMDetailLogPage({ isDividers, logusername, logdata, sParam, searchType, searchDate, searchStartDate, searchEndDate, searchUser }) {
  const [isLoading, setIsLoading] = useState(true); // loding
  const [open, setOpen] = useState(false); // dialog open
  const [detailLogData, setDetailLogData] = useState([]); // detail log data
  
  const callLogData = async (sParam, searchType, searchDate, searchUser) => {
    const url = `/logs/${sParam}/detail`;
    const data = {
      log_type : sParam,
      search_type: searchType,
      search_date: searchDate,
      user_id: searchUser,
    };
    const config = { 'Content-Type': 'application/json' };

    await axios
      .post(url, data, config)
      .then((res) => {
        // success
        setIsLoading(false);
        setDetailLogData(res.data);
      })
      .catch((err) => {
        // error
        console.log(err.response.data.message); // server error message
      });
  };

  const callLogDataForRange = async (sParam, searchStartDate, searchEndDate, searchUser) => {
    const url = `/logs/${sParam}/range/detail`;
    const data = {
      log_type : sParam,
      search_start_date: searchStartDate,
      search_end_date: searchEndDate,
      user_id: searchUser,
    };

    const config = { 'Content-Type': 'application/json' };

    await axios
      .post(url, data, config)
      .then((res) => {
        // success
        setIsLoading(false);
        setDetailLogData(res.data);        
      })
      .catch((err) => {
        // error
        console.log(err.response.data.message); // server error message
      });
  };

  const handleClickOpen = () => () => {
    setOpen(true);
    if (searchType === 'range')
      callLogDataForRange(sParam, searchStartDate, searchEndDate, searchUser);
    else
      callLogData(sParam, searchType, searchDate, searchUser);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const today = dayjs();
  const t = today.format('YYYYMMDD_HHmmss'); // 오늘 날짜(년-월) 리턴

  return (
    <>
      <Link component="button" onClick={handleClickOpen()}>
        {logdata}
      </Link>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="lg"
      >
        <DialogTitle id="scroll-dialog-title">상세 로그 리스트</DialogTitle>
        <DialogContent dividers={isDividers}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left" colSpan={2} sx={{ padding: 1, backgroundColor: 'white' }}>
                    <Typography variant="subtitle1" noWrap>
                      {sParam.toUpperCase()}, {logusername}, {detailLogData.length} 건
                    </Typography>
                  </TableCell>
                  <TableCell align="right" colSpan={2} sx={{ padding: 1, backgroundColor: 'white' }}>
                    <Button>
                      <CSVLink
                        headers={DETAIL_HEAD}
                        data={detailLogData}
                        filename={sParam
                          .toUpperCase()
                          .concat('_')
                          .concat(logusername)
                          .concat('_')
                          .concat(t)
                          .concat('.csv')}
                        target="_blank"
                      >
                        EXPORT
                      </CSVLink>
                    </Button>
                  </TableCell>
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
                  ? 'Loding...'
                  : detailLogData.map((row, idx) => {
                      const { datetime, filename, version, filesize } = row;

                      return (
                        <TableRow hover key={idx} tabIndex={-1}>
                          <TableCell align="left">{datetime}</TableCell>
                          <TableCell align="left">{filename}</TableCell>
                          <TableCell align="left">{version}</TableCell>
                          <TableCell align="left">{filesize}</TableCell>
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
