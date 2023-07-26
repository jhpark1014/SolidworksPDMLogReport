import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import dayjs from 'dayjs';
// components
// import Label from '../components/label';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHeadNotSort, UserListToolbarLoginLicense } from '../sections/@dashboard/user';
import LoginChartPage from './LoginChartPage';
// 라이선스 이름 매핑 데이터
import licnames from '../_mock/licnames';
import LoginDetailLogPage from './LoginDetailLogPage';

// ----------------------------------------------------------------------

// Table Headers
function getTableHeadForRange (sdate, edate) {
  return ([{
    id : 1,
    label : sdate.concat(' ~ ').concat(edate),      
  }]);
}

const TABLE_HEAD_HOLDQTY = [
  { id: 'licenseName', label: '라이선스', alignRight: false },
  { id: 'holdQty', label: '보유 수량', alignRight: false },
];

const TABLE_HEAD = [{ id: 'licenseName', label: '라이선스', alignRight: false }];

const TABLE_HEAD_YEAR = [
  { id: '1', label: '1월', alignRight: false },
  { id: '2', label: '2월', alignRight: false },
  { id: '3', label: '3월', alignRight: false },
  { id: '4', label: '4월', alignRight: false },
  { id: '5', label: '5월', alignRight: false },
  { id: '6', label: '6월', alignRight: false },
  { id: '7', label: '7월', alignRight: false },
  { id: '8', label: '8월', alignRight: false },
  { id: '9', label: '9월', alignRight: false },
  { id: '10', label: '10월', alignRight: false },
  { id: '11', label: '11월', alignRight: false },
  { id: '12', label: '12월', alignRight: false },
];

const TABLE_HEAD_DAY = [
  { id: '1', label: '1시', alignRight: false },
  { id: '2', label: '2시', alignRight: false },
  { id: '3', label: '3시', alignRight: false },
  { id: '4', label: '4시', alignRight: false },
  { id: '5', label: '5시', alignRight: false },
  { id: '6', label: '6시', alignRight: false },
  { id: '7', label: '7시', alignRight: false },
  { id: '8', label: '8시', alignRight: false },
  { id: '9', label: '9시', alignRight: false },
  { id: '10', label: '10시', alignRight: false },
  { id: '11', label: '11시', alignRight: false },
  { id: '12', label: '12시', alignRight: false },
  { id: '13', label: '13시', alignRight: false },
  { id: '14', label: '14시', alignRight: false },
  { id: '15', label: '15시', alignRight: false },
  { id: '16', label: '16시', alignRight: false },
  { id: '17', label: '17시', alignRight: false },
  { id: '18', label: '18시', alignRight: false },
  { id: '19', label: '19시', alignRight: false },
  { id: '20', label: '20시', alignRight: false },
  { id: '21', label: '21시', alignRight: false },
  { id: '22', label: '22시', alignRight: false },
  { id: '23', label: '23시', alignRight: false },
  { id: '24', label: '24시', alignRight: false },
];

// ----------------------------------------------------------------------
const showHoldQty = process.env.REACT_APP_LIC_HOLD_QTY;
const excludeLicName = process.env.REACT_APP_EXCLUDE_LIC_NAME;
const excludeLicArray = typeof excludeLicName === 'string' ? excludeLicName.trim().split(',') : '';

function getMonthTableHead(searchDate) {
  const date = dayjs(searchDate);
  const dayInMonth = new Date(date.format('YYYY'), date.format('MM'), 0).getDate();
  const TABLE_HEAD_MONTH = new Array(dayInMonth);
  for (let i = 1; i < dayInMonth + 1; i += 1) {
    TABLE_HEAD_MONTH[i - 1] = { id: i, label: `${i}일`, alignRight: false };
  }
  return TABLE_HEAD_MONTH;
}

function getTableHead(searchType, searchDate) {
  return searchType === 'day'
    ? TABLE_HEAD_DAY
    : searchType === 'month'
    ? getMonthTableHead(searchDate)
    : TABLE_HEAD_YEAR;
}

export default function LicenseLoginLogPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchType, setSearchType] = useState('day'); // 검색 구분
  const [searchDate, setSearchDate] = useState(''); // 검색 날짜
  const [searchLicense, setSearchLicense] = useState(''); // 검색 사용자
  const [logDatas, setLogDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchStartDate, setSearchStartDate] = useState(''); // 시작일
  const [searchEndDate, setSearchEndDate] = useState(''); // 종료일

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - logDatas.length) : 0;
  const isNotFound = !logDatas.length && !!logDatas;

  const tableHead = searchType === 'range' ? getTableHeadForRange(searchStartDate, searchEndDate) : getTableHead(searchType, searchDate);
  const tableHeadAll = showHoldQty === 'TRUE' ? TABLE_HEAD_HOLDQTY.concat(tableHead) : TABLE_HEAD.concat(tableHead);

  // 예외 필터링 후 라이선스 실제 이름이 매칭된 로그데이터
  const newLogDatas = (logDatas) => {
    const licNameArray = logDatas.map((lic) => lic.licid);
    excludeLicArray.forEach((data) => {
      if (licNameArray.indexOf(data) !== -1) {
        logDatas.splice(licNameArray.indexOf(data), 1);
      }
    });
    logDatas.map((row) => (
      licnames.forEach((lic) => {
        if (row.licid === lic.lic_id) {
          row.licname = lic.lic_name;
        }
      })
    ));
    console.log('asd', logDatas);
    return logDatas;
  };


  return (
    <>
      <Helmet>
        <title>로그인 로그 (라이선스)</title>
      </Helmet>

      <LoginChartPage
        title={'로그인 로그 (라이선스)'}
        subtitle={`${
          searchType === 'day' ? '일' : searchType === 'month' ? '월' : '연'
        }, ${searchDate}, ${searchLicense}`}
        chartDatas={logDatas}
        chartLabels={getTableHead(searchType, searchDate)}
      />      
      <Card>
        <UserListToolbarLoginLicense
          onIsLoading={setIsLoading}
          onSearchOption={setSearchType}
          onDateOption={setSearchDate}
          onLicenseOption={setSearchLicense}
          onLogDatas={setLogDatas}
          onStartDateOption={setSearchStartDate}
          onEndDateOption={setSearchEndDate}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHeadNotSort headLabel={tableHeadAll} />
              <TableBody>
                {newLogDatas(logDatas)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { id, licid, licname, holdqty, logdata } = row;

                    return (
                      <TableRow hover key={id} tabIndex={-1}>
                        <TableCell align="left">
                          <Typography variant="subtitle2" noWrap>
                            {licname}
                          </Typography>
                        </TableCell>

                        {showHoldQty === 'TRUE' ? (
                          <TableCell align="left">
                            <Typography variant="subtitle2" noWrap>
                              {holdqty}
                            </Typography>
                          </TableCell>
                        ) : (
                          ''
                        )}

                        {logdata.map((data, idx) => (
                          <TableCell key={idx} align="left" value={data}>
                            {data === 0 ? (
                              '-'
                            ) : (
                              <LoginDetailLogPage
                                data={{
                                  loglicensename: licname,
                                  logdata: data,
                                }}
                                searchType={searchType}
                                searchDate={searchDate}
                                searchLicense={licid}
                                time={idx}
                              />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              {isNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={tableHeadAll.length} sx={{ py: 3 }}>
                      <Paper sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" paragraph>
                          {isLoading ? 'Loading...' : '데이터가 없습니다. 검색 조건을 다시 입력해 주세요.'}
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={newLogDatas(logDatas).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="max row"
        />
      </Card>
    </>
  );
}
