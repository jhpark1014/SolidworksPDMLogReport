import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import {
  Link,
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
} from '@mui/material';
import dayjs from 'dayjs';
// components
import Scrollbar from '../components/scrollbar';
// sections
import { PDMLogToolbar, LogListHead } from '../sections/@dashboard/log';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: '사용자', alignRight: false },
  { id: 'department', label: '부서', alignRight: false },
];

// ----------------------------------------------------------------------

PDMLogTablePage.propTypes = {
  sParam: PropTypes.string,
  onSearchType: PropTypes.func,
  onSearchDate: PropTypes.func,
  onSearchUser: PropTypes.func,
  onLogDatas: PropTypes.func,
  onTableHead: PropTypes.func,
};

export default function PDMLogTablePage({ sParam, onSearchType, onSearchDate, onSearchUser, onLogDatas, onTableHead }) {
  const today = dayjs();
  const dateString = today.format('YYYY-MM'); // 오늘 날짜(년-월) 리턴

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchType, setSearchType] = useState('month'); // 검색 구분
  const [searchDate, setSearchDate] = useState(''); // 검색 날짜
  const [searchUser, setSearchUser] = useState(''); // 검색 사용자
  const [logDatas, setLogDatas] = useState([]); // server 처리 결과
  const [tableHead, setTableHead] = useState([]); // server 처리 결과
  const [isloading, setIsloading] = useState(true); // server 처리 결과

  console.log('searchDateTable', searchDate);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - logDatas.length) : 0;

  // const tableHead = getTableHead(searchType, searchDate);
  // const tableHeadAll = TABLE_HEAD.concat(tableHead);

  // console.log('tableheadall', tableHeadAll);

  const isNotFound = !logDatas.length;

  onSearchType(searchType);
  onSearchDate(searchDate);
  onSearchUser(searchUser);
  onLogDatas(logDatas);
  onTableHead(tableHead);

  const tableHeadAll = TABLE_HEAD.concat(tableHead);

  console.log('tablehead', tableHead);

  return (
    <Container maxWidth="false" disableGutters>
      <Card>
        <PDMLogToolbar
          sParam={sParam}
          onIsloading={setIsloading}
          onSearchType={setSearchType}
          onSearchDate={setSearchDate}
          onSearchUser={setSearchUser}
          onLogDatas={setLogDatas}
          onTableHead={setTableHead}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <LogListHead headLabel={tableHeadAll} />
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
                    <TableCell colSpan={tableHeadAll.length} />
                  </TableRow>
                )}
              </TableBody>

              {isNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={tableHeadAll.length} sx={{ py: 3 }}>
                      <Paper sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" paragraph>
                          {isloading ? 'loading...' : '데이터가 없습니다. 검색 조건을 다시 입력해 주세요.'}
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
  );
}
