import PropTypes from 'prop-types';
import { useState } from 'react';
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
} from '@mui/material';

// components
import Scrollbar from '../components/scrollbar';
// sections
import { PDMLogToolbar, LogListHead } from '../sections/@dashboard/log';
import PDMDetailLogPage from './PDMDetailLogPage';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { key: 'name', label: '사용자', alignRight: false },
  { key: 'department', label: '부서', alignRight: false },
];

// ----------------------------------------------------------------------

PDMLogTablePage.propTypes = {
  sParam: PropTypes.string,
  onSearchType: PropTypes.func,
  onSearchDate: PropTypes.func,
  onSearchUser: PropTypes.func,
  onSearchUserName: PropTypes.func,
  onLogDatas: PropTypes.func,
  onTableHead: PropTypes.func,
  onSearchStartDate: PropTypes.func,
  onSearchEndDate: PropTypes.func,
};

export default function PDMLogTablePage({
  sParam,
  onSearchType,
  onSearchDate,
  onSearchUser,
  onSearchUserName,
  onLogDatas,
  onTableHead,
  onSearchStartDate,
  onSearchEndDate,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchType, setSearchType] = useState(''); // 검색 구분
  const [searchDate, setSearchDate] = useState(''); // 검색 날짜
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [searchUser, setSearchUser] = useState(''); // 검색 사용자
  const [searchUserName, setSearchUserName] = useState(''); // 검색 사용자 이름
  const [logDatas, setLogDatas] = useState([]); // server 처리 결과
  const [tableHead, setTableHead] = useState([]); // 테이블 컬럼
  const [isloading, setIsloading] = useState(true); // 로딩

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - logDatas.length) : 0;

  const isNotFound = !logDatas.length;

  const tableHeadAll = TABLE_HEAD.concat(tableHead);

  onSearchType(searchType);
  onSearchDate(searchDate);
  onSearchUser(searchUser);
  onSearchUserName(searchUserName);
  onLogDatas(logDatas);
  onTableHead(tableHead);
  onSearchStartDate(searchStartDate);
  onSearchEndDate(searchEndDate);

  return (
    <Container maxWidth="false" disableGutters>
      <Card>
        <PDMLogToolbar
          sParam={sParam}
          onIsloading={setIsloading}
          onSearchType={setSearchType}
          onSearchDate={setSearchDate}
          onSearchStartDate={setSearchStartDate}
          onSearchEndDate={setSearchEndDate}
          onSearchUser={setSearchUser}
          onSearchUserName={setSearchUserName}
          onLogDatas={setLogDatas}
          onTableHead={setTableHead}
          headLabel={tableHeadAll}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <LogListHead headLabel={tableHeadAll} />
              <TableBody>
                {logDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { userid, username, department, logdata } = row;

                  return (
                    <TableRow hover key={userid} tabIndex={-1}>
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
                          {data === 0 ? (
                            '-'
                          ) : (
                            <PDMDetailLogPage
                              isDividers
                              logusername={username}
                              logdata={data}
                              sParam={sParam}
                              searchType={
                                searchType === 'range' ? searchType : searchType === 'month' ? 'day' : 'month'
                              }
                              searchDate={searchDate.concat('-').concat(idx + 1)}
                              searchStartDate={searchStartDate}
                              searchEndDate={searchEndDate}
                              searchUser={userid}
                            />
                          )}
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
                          {isloading ? 'Loading...' : '데이터가 없습니다. 검색 조건을 다시 입력해 주세요.'}
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
