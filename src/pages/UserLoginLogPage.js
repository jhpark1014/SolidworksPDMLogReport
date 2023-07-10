import { spacing } from '@mui/system';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
import { useTheme } from '@emotion/react';
import { koKR } from '@mui/material/locale';
import { useState, useMemo } from 'react';
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
// components
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHeadNotSort, UserListToolbarLoginUser } from '../sections/@dashboard/user';
import UserLoginChartPage from './UserLoginChartPage';
// mock
import LOGLIST from '../_mock/logdata';

// ----------------------------------------------------------------------

// Table Headers
const TABLE_HEAD = [
  { id: 'userName', label: '사용자', alignRight: false },
  { id: 'holdQty', label: '보유 수량', alignRight: false },
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

const TABLE_HEAD_MONTH = [
  { id: '1', label: '1', alignRight: false },
  { id: '2', label: '2', alignRight: false },
  { id: '3', label: '3', alignRight: false },
  { id: '4', label: '4', alignRight: false },
  { id: '5', label: '5', alignRight: false },
  { id: '6', label: '6', alignRight: false },
  { id: '7', label: '7', alignRight: false },
  { id: '8', label: '8', alignRight: false },
  { id: '9', label: '9', alignRight: false },
  { id: '10', label: '10', alignRight: false },
  { id: '11', label: '11', alignRight: false },
  { id: '12', label: '12', alignRight: false },
  { id: '13', label: '13', alignRight: false },
  { id: '14', label: '14', alignRight: false },
  { id: '15', label: '15', alignRight: false },
  { id: '16', label: '16', alignRight: false },
  { id: '17', label: '17', alignRight: false },
  { id: '18', label: '18', alignRight: false },
  { id: '19', label: '19', alignRight: false },
  { id: '20', label: '20', alignRight: false },
  { id: '21', label: '21', alignRight: false },
  { id: '22', label: '22', alignRight: false },
  { id: '23', label: '23', alignRight: false },
  { id: '24', label: '24', alignRight: false },
  { id: '25', label: '25', alignRight: false },
  { id: '26', label: '26', alignRight: false },
  { id: '27', label: '27', alignRight: false },
  { id: '28', label: '28', alignRight: false },
  { id: '29', label: '29', alignRight: false },
  { id: '30', label: '30', alignRight: false },
  { id: '31', label: '31', alignRight: false },
];

const TABLE_HEAD_DAY = [
  { id: '1', label: '1', alignRight: false },
  { id: '2', label: '2', alignRight: false },
  { id: '3', label: '3', alignRight: false },
  { id: '4', label: '4', alignRight: false },
  { id: '5', label: '5', alignRight: false },
  { id: '6', label: '6', alignRight: false },
  { id: '7', label: '7', alignRight: false },
  { id: '8', label: '8', alignRight: false },
  { id: '9', label: '9', alignRight: false },
  { id: '10', label: '10', alignRight: false },
  { id: '11', label: '11', alignRight: false },
  { id: '12', label: '12', alignRight: false },
  { id: '13', label: '13', alignRight: false },
  { id: '14', label: '14', alignRight: false },
  { id: '15', label: '15', alignRight: false },
  { id: '16', label: '16', alignRight: false },
  { id: '17', label: '17', alignRight: false },
  { id: '18', label: '18', alignRight: false },
  { id: '19', label: '19', alignRight: false },
  { id: '20', label: '20', alignRight: false },
  { id: '21', label: '21', alignRight: false },
  { id: '22', label: '22', alignRight: false },
  { id: '23', label: '23', alignRight: false },
  { id: '24', label: '24', alignRight: false },
];

// ----------------------------------------------------------------------

function getTableHead(searchType) {
  return searchType === 'day' ? TABLE_HEAD_DAY : searchType === 'month' ? TABLE_HEAD_MONTH : TABLE_HEAD_YEAR;
}

export default function UserLoginLogPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchType, setSearchType] = useState('day'); // 검색 구분
  const [searchDate, setSearchDate] = useState(''); // 검색 날짜
  const [searchLicense, setSearchLicense] = useState(''); // 검색 사용자
  const [logDatas, setLogDatas] = useState([]);

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

  // 한국어 Grid
  const theme = useTheme();
  const themeWithLocale = useMemo(() => createTheme(theme, koKR), [koKR, theme]);

  console.log('logDatas==>', logDatas);

  return (
    <>
      <Helmet>
        <title>로그인 로그 (사용자)</title>
      </Helmet>

      <UserLoginChartPage
        title={'로그인 로그 (사용자)'}
        subtitle={`${
          searchType === 'day' ? '일' : searchType === 'month' ? '월' : '연'
        }, ${searchDate}, ${searchLicense}`}
        chartDatas={logDatas}
        chartLabels={getTableHead(searchType)}
      />

      <ThemeProvider theme={themeWithLocale}>
        <Container maxWidth="false" disableGutters>
          <Card>
            <UserListToolbarLoginUser
              // pageType="user"
              onSearchOption={setSearchType}
              onDateOption={setSearchDate}
              onLicenseOption={setSearchLicense}
              onLogDatas={setLogDatas}
            />

            <Scrollbar>
              <TableContainer>
                <Table>
                  <UserListHeadNotSort headLabel={TABLE_HEAD.concat(getTableHead(searchType))} />
                  <TableBody>
                    {logDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, username, holdqty, logdata } = row;

                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <TableCell align="left">
                            <Typography variant="subtitle2" noWrap>
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
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" paragraph>
                              데이터가 없습니다.
                              <br />
                              검색 조건을 다시 입력해 주세요.
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
            />
          </Card>
        </Container>
      </ThemeProvider>
    </>
  );
}
