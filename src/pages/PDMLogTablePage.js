import PropTypes from 'prop-types';
import { useState } from 'react';
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
// components
import Scrollbar from '../components/scrollbar';
// sections
import { PDMLogToolbar, LogListHead } from '../sections/@dashboard/log';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: '사용자', alignRight: false },
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

const TABLE_HEAD_MONTH = [  
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
];

// ----------------------------------------------------------------------

function getTableHead(searchType) {
  return (searchType === "month" ? TABLE_HEAD_MONTH : TABLE_HEAD_YEAR);
}

PDMLogTablePage.propTypes = {
  sParam: PropTypes.string,
  onSearchType: PropTypes.func,
  onSearchDate: PropTypes.func,
  onSearchUser: PropTypes.func,
  onLogDatas: PropTypes.func,  
  onTableHead: PropTypes.func,  
};

export default function PDMLogTablePage({ sParam, onSearchType, onSearchDate, onSearchUser, onLogDatas, onTableHead }) {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchType, setSearchType] = useState('month');  // 검색 구분
  const [searchDate, setSearchDate] = useState('');       // 검색 날짜
  const [searchUser, setSearchUser] = useState('');       // 검색 사용자
  const [logDatas, setLogDatas] = useState([]);           // server 처리 결과
  const [isLoding, setIsLoding] = useState(true);           // server 처리 결과

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - logDatas.length) : 0;

  const tableHead = getTableHead(searchType);
  const tableHeadAll = TABLE_HEAD.concat(tableHead);
  
  const isNotFound = !logDatas.length;

  onSearchType(searchType);
  onSearchDate(searchDate);
  onSearchUser(searchUser);
  onLogDatas(logDatas);
  onTableHead(tableHead);
  
  return (    
    <Container maxWidth="false" disableGutters>
      <Card>
        <PDMLogToolbar
          sParam={sParam}
          onIsLoding={setIsLoding}
          onSearchType={setSearchType}
          onSearchDate={setSearchDate}
          onSearchUser={setSearchUser}
          onLogDatas={setLogDatas}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <LogListHead
                headLabel={tableHeadAll}                                                                         
              />
              <TableBody>
                {logDatas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { id, username, department, logdata } = row;
                  
                  return (
                    <TableRow hover key={id} tabIndex={-1}>
                      <TableCell align="left">
                        <Typography variant="subtitle2" noWrap>
                          <Link to="/downloadlog">{username}</Link>
                        </Typography>
                      </TableCell>

                      <TableCell align="left">
                        <Typography variant="subtitle2" noWrap>{department}</Typography>
                      </TableCell>

                      {logdata.map((data, idx) => (
                        <TableCell key={idx} align="left" value={data}>{data}</TableCell>
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
                      <Paper sx={{textAlign: 'center',}}>
                        <Typography variant="h6" paragraph>
                          {isLoding ? 'Loding...' : '데이터가 없습니다. 검색 조건을 다시 입력해 주세요.'}                            
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
