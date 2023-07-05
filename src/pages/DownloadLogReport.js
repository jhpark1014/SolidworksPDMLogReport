import { spacing } from '@mui/system';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
import { useMemo, useState } from 'react';
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
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { koKR } from '@mui/material/locale';
// components
// import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbarDefault } from '../sections/@dashboard/user';
import DownloadLogPage from './DownloadLogPage';
// mock
import LOGLIST from '../_mock/logdata';

// ----------------------------------------------------------------------

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
  { id: 'sum', label: '합계', alignRight: false },
];

const TABLE_HEAD_MONTH = [
  { id: 'name', label: '사용자', alignRight: false },
  { id: 'department', label: '부서', alignRight: false },
  { id: '1', label: '1일', alignRight: false },
  { id: '2', label: '2일', alignRight: false },
  { id: '3', label: '3일', alignRight: false },
  { id: '4', label: '4일', alignRight: false },
  { id: '5', label: '5일', alignRight: false },
  { id: '6', label: '6일', alignRight: false },
  { id: '7', label: '7일', alignRight: false },
  { id: '8', label: '8일', alignRight: false },
  { id: '9', label: '9일', alignRight: false },
  { id: '10', label: '10일', alignRight: false },
  { id: '11', label: '11일', alignRight: false },
  { id: '12', label: '12일', alignRight: false },
  { id: '13', label: '13일', alignRight: false },
  { id: '14', label: '14일', alignRight: false },
  { id: '15', label: '15일', alignRight: false },
  { id: '16', label: '16일', alignRight: false },
  { id: '17', label: '17일', alignRight: false },
  { id: '18', label: '18일', alignRight: false },
  { id: '19', label: '19일', alignRight: false },
  { id: '20', label: '20일', alignRight: false },
  { id: '21', label: '21일', alignRight: false },
  { id: '22', label: '22일', alignRight: false },
  { id: '23', label: '23일', alignRight: false },
  { id: '24', label: '24일', alignRight: false },
  { id: '25', label: '25일', alignRight: false },
  { id: '26', label: '26일', alignRight: false },
  { id: '27', label: '27일', alignRight: false },
  { id: '28', label: '28일', alignRight: false },
  { id: '29', label: '29일', alignRight: false },
  { id: '30', label: '30일', alignRight: false },
  { id: '31', label: '31일', alignRight: false },
  { id: 'sum', label: '합계', alignRight: false },
];

// ----------------------------------------------------------------------

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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function DefaultLogReport() {
  // const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  // const handleOpenMenu = (event) => {
  //   setOpen(event.currentTarget);
  // };

  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };

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

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - LOGLIST.length) : 0;

  const filteredUsers = applySortFilter(LOGLIST, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;

  const theme = useTheme();
  const themeWithLocale = useMemo(() => createTheme(theme, koKR), [koKR, theme]);

  const [dateOption, setDateOption] = useState('month');

  return (
    <>
      <Helmet>
        <title> Log Report | Minimal UI </title>
      </Helmet>

      <DownloadLogPage />

      <ThemeProvider theme={themeWithLocale}>
        <Container maxWidth="false" disableGutters>
          <Card>
            <UserListToolbarDefault
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              setDateOption={setDateOption}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={dateOption === 'month' ? TABLE_HEAD_MONTH : TABLE_HEAD_YEAR}
                    rowCount={LOGLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, department, logdata } = row;
                      const selectedUser = selected.indexOf(name) !== -1;
                      const datas = LOGLIST.map((n) => n.logdata);
                      // console.log(datas);

                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          {/* <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                          </TableCell> */}

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
                              <strong>&quot;{filterName}&quot;</strong>.
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

      {/* <Popover
        // open={Boolean(open)}
        // anchorEl={open}
        // onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover> */}
    </>
  );
}
