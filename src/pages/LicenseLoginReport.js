import { spacing } from '@mui/system';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
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
import axios from 'axios';
// components
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbarLicense } from '../sections/@dashboard/user';
import LicenseLoginLogPage from './LicenseLoginLogPage';
// mock
import LOGLIST from '../_mock/logdata';

// ----------------------------------------------------------------------

// Table Headers
const TABLE_HEAD_YEAR = [
  { id: 'name', label: '사용자', alignRight: false },
  { id: 'department', label: '부서', alignRight: false },
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
  { id: 'name', label: '사용자', alignRight: false },
  { id: 'department', label: '부서', alignRight: false },
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
  { id: 'name', label: '사용자', alignRight: false },
  { id: 'department', label: '부서', alignRight: false },
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
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

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

function applyLicenseFilter(datas, licenseList) {
  return datas.filter((data) => licenseList.includes(data.name));
}

// applySortFilter(LOGLIST, getComparator(order, orderBy), filterLicense);

export default function LicenseLoginReport({ setTableHead }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  // const [filterName, setFilterName] = useState('');
  const [filterLicense, setFilterLicense] = useState(LOGLIST.map((n) => n.name));
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = LOGLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
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
  const handleFilterByLicense = () => {
    setPage(0);
    setFilterLicense(filterLicense);
    console.log('뭔데', filterLicense);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - LOGLIST.length) : 0;

  // const filteredUsers = applySortFilter(LOGLIST, getComparator(order, orderBy), filterName);

  // const isNotFound = !filteredUsers.length && !!filterName;
  const isNotFound = !filterLicense.length && !!filterLicense;

  // 한국어 Grid
  const theme = useTheme();
  const themeWithLocale = useMemo(() => createTheme(theme, koKR), [koKR, theme]);

  // Toolbar에서 날짜 검색 옵션 불러오기
  const [dateOption, setDateOption] = useState('day');
  const [selectedDate, PassSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  // useMemo(() => {
  //   PassSelectedDate(selectedDate);
  //   // setPassSelectedDate(selectedDate);
  // }, [selectedDate]);
  console.log('dateOption', dateOption);
  // console.log('selected date', selectedDate);
  console.log('report filter license', filterLicense);

  // 필터링 된 그리드에 보여질 새 데이터
  const newData = applyLicenseFilter(LOGLIST, filterLicense);

  // 서버 연결하기
  const [inputs, setInputs] = useState({
    search_type: '',
    search_date: '',
    lic_name: '',
  });
  const [err, setError] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // setInputs((prev) => ({ ...prev, [search_type]: dateOption }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('inputs==>', inputs);

      const url = `/logs/loginuser?search_type=${inputs.search_type}&search_date=${inputs.search_date}&lic_name=${inputs.lic_name}`;
      const res = await axios.get(url, inputs);

      console.log(res.data);
    } catch (err) {
      setError(err.response.data);
    }
  };

  console.log('passdate', selectedDate);

  return (
    <>
      <div className="auth">
        <form>
          <input required type="text" placeholder="검색 구분" name="search_type" onChange={handleChange} />
          <br />
          <input required type="text" placeholder="검색 날짜" name="search_date" onChange={handleChange} />
          <br />
          <input required type="text" placeholder="lic_name" name="lic_name" onChange={handleChange} />
          <br />
          <button onClick={handleSubmit}>submit</button>
          {err && <p>{err}</p>}
        </form>
      </div>
      <LicenseLoginLogPage selectedDate={selectedDate} />
      <Helmet>
        <title> Log Report | Minimal UI </title>
      </Helmet>

      <ThemeProvider theme={themeWithLocale}>
        <Container maxWidth="false" disableGutters>
          {/* <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Log Report
          </Typography>
        </Stack> */}

          <Card>
            <UserListToolbarLicense
              numSelected={selected.length}
              // filterName={filterName}
              // onFilterName={handleFilterByName}
              setDateOption={setDateOption}
              // filterLicense={filterLicense}
              onFilterLicense={setFilterLicense}
              PassSelectedDate={PassSelectedDate}
            />

            <Scrollbar>
              <TableContainer>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={
                      dateOption === 'day'
                        ? TABLE_HEAD_DAY
                        : dateOption === 'month'
                        ? TABLE_HEAD_MONTH
                        : TABLE_HEAD_YEAR
                    }
                    rowCount={LOGLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    // onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {/* {filteredLicense.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => { */}
                    {newData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, department, logdata } = row;
                      const selectedUser = selected.indexOf(name) !== -1;

                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell align="left">
                            <Typography variant="subtitle2" noWrap>
                              {name.slice(0, 6)}
                            </Typography>
                          </TableCell>

                          <TableCell align="left">{department}</TableCell>

                          {logdata.map((data) => (
                            <TableCell align="left" value={data}>
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

                            <Typography variant="body2">
                              No results found for &nbsp;
                              {/* <strong>&quot;{filterName}&quot;</strong>. */}
                              <strong>&quot;{filterLicense}&quot;</strong>.
                              <br /> Try checking for typos or using complete words.
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
    </>
  );
}
