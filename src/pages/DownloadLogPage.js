// import { spacing } from '@mui/system';
import { Helmet } from 'react-helmet-async';
// import { filter } from 'lodash';
// import { sentenceCase } from 'change-case';
import { useMemo, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Paper,
  TableRow,
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
import Scrollbar from '../components/scrollbar';
// sections
import { DownloadLogToolbar, UserListHeadNotSort } from '../sections/@dashboard/user';
import DownloadLogChartPage from './DownloadLogChartPage';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: '사용자', alignRight: false },
  { id: 'department', label: '부서', alignRight: false },
];

const TABLE_HEAD_YEAR = [
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

// ----------------------------------------------------------------------

function getTableHead(searchType) {
  return searchType === 'month' ? TABLE_HEAD_MONTH : TABLE_HEAD_YEAR;
}

export default function DefaultLogReport() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchType, setSearchType] = useState('month'); // 검색 구분
  const [searchDate, setSearchDate] = useState(''); // 검색 날짜
  const [searchUser, setSearchUser] = useState(''); // 검색 사용자
  const [logDatas, setLogDatas] = useState([]); // server 처리 결과

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - logDatas.length) : 0;

  const theme = useTheme();
  const themeWithLocale = useMemo(() => createTheme(theme, koKR), [koKR, theme]);

  const isNotFound = !logDatas.length;

  return (
    <>
      <Helmet>
        <title>다운로드 로그</title>
      </Helmet>

      {/* <Typography variant="h4" sx={{ mb: 5 }}>다운로드 로그</Typography> */}

      <DownloadLogChartPage
        title={`다운로드 로그`}
        subTitle={`${searchType === 'month' ? '월' : '연'}, ${searchDate}, ${searchUser}`}
        chartDatas={logDatas}
        chartLabels={getTableHead(searchType)}
      />
      <br />
      <ThemeProvider theme={themeWithLocale}>
        <Container maxWidth="false" disableGutters>
          <Card>
            <DownloadLogToolbar
              onSearchType={setSearchType}
              onSearchDate={setSearchDate}
              onSearchUser={setSearchUser}
              onLogDatas={setLogDatas}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHeadNotSort headLabel={TABLE_HEAD.concat(getTableHead(searchType))} />
                  <TableBody>
                    {logDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, username, department, logdata } = row;

                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <TableCell align="left">
                            <Typography variant="subtitle2" noWrap>
                              {username}
                            </Typography>
                          </TableCell>

                          <TableCell align="left">
                            <Typography variant="subtitle2" noWrap>
                              {department}
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
