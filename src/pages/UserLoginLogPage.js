import { spacing } from '@mui/system';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
import { useTheme } from '@emotion/react';
import { koKR } from '@mui/material/locale';
import { useState, useMemo, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Paper,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
// components
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHeadNotSort, UserListToolbarLoginUser } from '../sections/@dashboard/user';
import LoginChartPage from './LoginChartPage';

// ----------------------------------------------------------------------

// Table Headers
const TABLE_HEAD = [
  { id: 'userName', label: '사용자', alignRight: false },
  { id: 'department', label: '부서', alignRight: false },
];

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

const userPCName = process.env.REACT_APP_USER_PC_NAME;

// ----------------------------------------------------------------------

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

export default function UserLoginLogPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchType, setSearchType] = useState('day'); // 검색 구분
  const [searchDate, setSearchDate] = useState(dayjs().format('YYYY-MM-DD')); // 검색 날짜
  const [searchLicense, setSearchLicense] = useState('All'); // 검색 사용자
  const [logDatas, setLogDatas] = useState([]);
  const [chartDatas, setChartDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - logDatas.length) : 0;
  const isNotFound = !logDatas.length && !!logDatas;

  const tableHead = getTableHead(searchType, searchDate);
  const tableHeadAll = TABLE_HEAD.concat(tableHead);

  // 한국어 Grid
  const theme = useTheme();
  const themeWithLocale = useMemo(() => createTheme(theme, koKR), [koKR, theme]);

  // console.log('logDatas==>', logDatas);
  // console.log('chartDatas==>', chartDatas);

  return (
    <>
      <Helmet>
        <title>로그인 로그 (사용자)</title>
      </Helmet>

      <LoginChartPage
        title={'로그인 로그 (사용자)'}
        subtitle={`${
          searchType === 'day' ? '일' : searchType === 'month' ? '월' : '연'
        }, ${searchDate}, ${searchLicense}`}
        chartDatas={chartDatas}
        chartLabels={getTableHead(searchType, searchDate)}
      />

      <ThemeProvider theme={themeWithLocale}>
        <Container maxWidth="false" disableGutters>
          <Card>
            <UserListToolbarLoginUser
              onIsLoading={setIsLoading}
              onSearchOption={setSearchType}
              onDateOption={setSearchDate}
              onLicenseOption={setSearchLicense}
              onLogDatas={setLogDatas}
              onChartDatas={setChartDatas}
            />

            <Scrollbar>
              <TableContainer>
                <Table>
                  <UserListHeadNotSort headLabel={TABLE_HEAD.concat(getTableHead(searchType, searchDate))} />
                  <TableBody>
                    {logDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, username, holdqty, logdata } = row;

                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <TableCell align="left">
                            <Typography variant="subtitle2" noWrap>
                              {/* {userPCName === 'TRUE' ? pcName : username} */}
                              {username}
                            </Typography>
                          </TableCell>

                          <TableCell align="left">
                            <Typography variant="subtitle2" noWrap>
                              {holdqty}
                            </Typography>
                          </TableCell>

                          {logdata.map((data, idx) => (
                            <TableCell key={idx} align="left" value={data}>
                              {data}
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
              count={logDatas.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="max row"
            />
          </Card>
        </Container>
      </ThemeProvider>
    </>
  );
}
