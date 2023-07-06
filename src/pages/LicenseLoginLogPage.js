import { spacing } from '@mui/system';
import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
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
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { koKR } from '@mui/material/locale';
import dayjs from 'dayjs';
// components
// import Label from '../components/label';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHeadNotSort, UserListToolbarLoginLog } from '../sections/@dashboard/user';
import LicenseLoginChartPage from './LicenseLoginLogChartPage';
// mock
import LOGLIST from '../_mock/logdata';

// ----------------------------------------------------------------------

// Table Headers
const TABLE_HEAD = [
  { id: 'licenseName', label: '라이선스', alignRight: false },
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

// Search Filtering
// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function applySortFilter(array, comparator, query) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   if (query) {
//     return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
//   }
//   return stabilizedThis.map((el) => el[0]);
// }

// function applyLicenseFilter(datas, licenseList) {
//   return datas.filter((data) => licenseList.includes(data.name));
// }

// applySortFilter(LOGLIST, getComparator(order, orderBy), filterLicense);

function getTableHead(searchType) {
  return searchType === 'day' ? TABLE_HEAD_DAY : searchType === 'month' ? TABLE_HEAD_MONTH : TABLE_HEAD_YEAR;
}

export default function LicenseLoginLogPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);

  const [searchType, setSearchType] = useState('day'); // 검색 구분
  const [searchDate, setSearchDate] = useState(''); // 검색 날짜
  const [searchLicense, setSearchLicense] = useState(''); // 검색 사용자
  const [logDatas, setLogDatas] = useState([]);
  // const [filterLicense, setFilterLicense] = useState(res.map((n) => n.lic_name));

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

  // const handleFilterByName = (event) => {
  //   setPage(0);
  //   setFilterName(event.target.value);
  // };
  // const handleFilterByLicense = (event) => {
  // const handleFilterByLicense = () => {
  //   setPage(0);
  //   setFilterLicense(filterLicense);
  //   console.log('뭔데', filterLicense);
  // };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - LOGLIST.length) : 0;
  const isNotFound = !logDatas.length && !!logDatas;

  // 한국어 Grid
  const theme = useTheme();
  const themeWithLocale = useMemo(() => createTheme(theme, koKR), [koKR, theme]);

  // Toolbar에서 날짜 검색 옵션 불러오기
  const [searchOption, setSearchOption] = useState('day');
  const [selectedDate, PassSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  // console.log('searchType', searchType);
  // console.log('selected date', selectedDate);
  // console.log('report filter license', filterLicense);

  console.log('logDatas==>', logDatas);
  console.log('log report page', searchOption, selectedDate, logDatas);

  // 필터링 된 그리드에 보여질 새 데이터
  // const newData = applyLicenseFilter(LOGLIST, filterLicense);
  // const newData = applyLicenseFilter(res, filterLicense);

  // console.log('newdata: ', newData);

  return (
    <>
      <Container maxWidth="false" disableGutters>
        <LicenseLoginChartPage
          title={'로그인 로그 (라이선스)'}
          subtitle={`${
            searchType === 'day' ? '일' : searchType === 'month' ? '월' : '연'
          }, ${searchDate}, ${searchLicense}`}
          chartDatas={logDatas}
          chartLabels={getTableHead(searchType)}
        />
        <Helmet>
          <title> Log Report | Minimal UI </title>
        </Helmet>

        <ThemeProvider theme={themeWithLocale}>
          <Container maxWidth="false" disableGutters>
            <Card>
              <UserListToolbarLoginLog
                numSelected={selected.length}
                pageType="license"
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
                      {/* {filteredLicense.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => { */}
                      {logDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        // const { id, name, department, logdata } = row;
                        const { id, licname, holdqty, logdata } = row;

                        const selectedLicense = selected.indexOf(licname) !== -1;

                        return (
                          <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedLicense}>
                            <TableCell align="left">
                              <Typography variant="subtitle2" noWrap>
                                {licname}
                              </Typography>
                            </TableCell>

                            <TableCell align="left">
                              <Typography variant="subtitle2" noWrap>
                                {holdqty}
                              </Typography>
                            </TableCell>

                            {logdata.map((data, idx) => (
                              <TableCell key={idx} align="center" value={data}>
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
                            <Paper
                              sx={{
                                textAlign: 'center',
                              }}
                            >
                              <Typography variant="h6" paragraph>
                                Not found
                              </Typography>

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
                count={LOGLIST.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Container>
        </ThemeProvider>
      </Container>
    </>
  );
}
