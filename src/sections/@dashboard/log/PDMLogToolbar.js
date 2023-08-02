import PropTypes from 'prop-types';
import axios from 'axios';
// @mui
import { styled } from '@mui/material/styles';
import { Toolbar, FormControl, InputLabel, Select, MenuItem, Box, OutlinedInput, Button, Grid } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { CSVLink } from 'react-csv';

// ----------------------------------------------------------------------

// Table Headers
const TABLE_HEAD_YEAR = [
  { key: '1', label: '1월', alignRight: false },
  { key: '2', label: '2월', alignRight: false },
  { key: '3', label: '3월', alignRight: false },
  { key: '4', label: '4월', alignRight: false },
  { key: '5', label: '5월', alignRight: false },
  { key: '6', label: '6월', alignRight: false },
  { key: '7', label: '7월', alignRight: false },
  { key: '8', label: '8월', alignRight: false },
  { key: '9', label: '9월', alignRight: false },
  { key: '10', label: '10월', alignRight: false },
  { key: '11', label: '11월', alignRight: false },
  { key: '12', label: '12월', alignRight: false },
];

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getExcelData(logDatas) {
  const excelData = structuredClone(logDatas);
  for (let i = 0; i < excelData.length; i += 1) {
    for (let j = 1; j < excelData[0].logdata.length + 1; j += 1) {
      excelData[i][j] = excelData[i].logdata[j - 1];
    }
  }
  return excelData;
}

function getUserRealName(userid, userList) {
  let realName = '';
  if (userid === 'All') {
    return 'All';
  }
  userList.forEach((user) => {
    if (userid === user.user_id) {
      realName = user.user_name;
    }
  });
  return realName;
}

// ----------------------------------------------------------------------

function getMonthTableHead(searchDate) {
  const date = dayjs(searchDate);
  const dayInMonth = new Date(date.format('YYYY'), date.format('MM'), 0).getDate();
  const TABLE_HEAD_MONTH = new Array(dayInMonth);
  for (let i = 1; i < dayInMonth + 1; i += 1) {
    TABLE_HEAD_MONTH[i - 1] = { key: `${i}`, label: `${i}일`, alignRight: false };
  }
  return TABLE_HEAD_MONTH;
}

function getTableHead(searchType, searchDate) {
  return searchType === 'month' ? getMonthTableHead(searchDate) : TABLE_HEAD_YEAR;
}

PDMLogToolbar.propTypes = {
  sParam: PropTypes.string,
  onIsloading: PropTypes.func,
  onSearchType: PropTypes.func,
  onSearchDate: PropTypes.func,
  onSearchStartDate: PropTypes.func,
  onSearchEndDate: PropTypes.func,
  onSearchUser: PropTypes.func,
  onSearchUserName: PropTypes.func,
  onLogDatas: PropTypes.func,
  onTableHead: PropTypes.func,
  headLabel: PropTypes.array,
};

export default function PDMLogToolbar({
  sParam,
  onIsloading,
  onSearchType,
  onSearchDate,
  onSearchStartDate,
  onSearchEndDate,
  onSearchUser,
  onSearchUserName,
  onLogDatas,
  onTableHead,
  headLabel,
}) {
  const today = dayjs();
  const dateString = today.format('YYYY-MM'); // 오늘 날짜(년-월) 리턴
  const t = today.format('YYYYMMDD_HHmmss'); // 오늘 날짜(년-월) 리턴
  const [searchType, setSearchType] = useState('month');
  const [searchDate, setSearchDate] = useState(dateString);
  const [searchStartDate, setSearchStartDate] = useState(today.subtract(7, 'd'));
  const [searchEndDate, setSearchEndDate] = useState(today);
  const [searchUser, setSearchUser] = useState('All');
  const [logDatas, setLogDatas] = useState([]);
  const [userList, setUserList] = useState([]);
  const [rangeSearch, setRangeSearch] = useState(false);

  const excludeUserName = process.env.REACT_APP_EXCLUDE_USER_NAME;
  const excludeUserArray = typeof excludeUserName === 'string' ? excludeUserName.trim().split(',') : '';

  const callTableHead = async (searchType, searchDate) => {
    onTableHead(getTableHead(searchType, searchDate));
  };

  const callTableHeadForRange = async (sdate, edate) => {
    onTableHead([
      {
        key: '1',
        label: sdate.concat(' ~ ').concat(edate),
      },
    ]);
  };

  // 사용자 아이디와 이름 매칭
  const getUserName = (searchUser) => {
    let searchUserName = 'All';
    userList.forEach((user) => {
      if (searchUser === user.user_id) {
        // setSearchUserName(() => user.user_name);
        searchUserName = user.user_name;
      }
      return searchUserName;
    });
    // setSearchUserName('All');
    return searchUserName;
  };

  // ------------------------- server call start --------------------------------------
  // server에서 user List 가져오기
  const callUserList = async (searchType, searchDate) => {
    const url = `/logs/userlist`;
    const data = {
      log_type: sParam,
      search_type: searchType,
      search_date: searchDate,
      exc_user_id: excludeUserArray,
    };
    const config = { 'Content-Type': 'application/json' };
    await axios
      .post(url, data, config)
      .then((res) => {
        // success
        const users = [{ user_id: 'All', user_name: 'All' }];
        if (res.data.length === 0) {
          setUserList(users);
        } else {
          setUserList(users.concat(res.data));
        }
      })
      .catch((err) => {
        // error
        console.log(err.response.data.message); // server error message
      });
  };

  // server에서 user List 가져오기 - 기간
  const callUserListForRange = async (searchStartDate, searchEndDate) => {
    const url = `/logs/userlist/range`;
    const data = {
      log_type: sParam,
      search_start_date: searchStartDate,
      search_end_date: searchEndDate,
      exc_user_id: excludeUserArray,
    };
    const config = { 'Content-Type': 'application/json' };
    await axios
      .post(url, data, config)
      .then((res) => {
        // success
        const users = [{ user_id: 'All', user_name: 'All' }];
        if (res.data.length === 0) {
          setUserList(users);
        } else {
          setUserList(users.concat(res.data));
        }
      })
      .catch((err) => {
        // error
        console.log(err.response.data.message); // server error message
      });
  };

  // server 에서 response 데이터 가져오기
  const callLogData = async (searchType, searchDate, searchUser) => {
    const url = `/logs/${sParam}`;
    const data = {
      log_type: sParam,
      search_type: searchType,
      search_date: searchDate,
      user_id: searchUser,
      exc_user_id: excludeUserArray,
    };
    const config = { 'Content-Type': 'application/json' };
    await axios
      .post(url, data, config)
      .then((res) => {
        // success
        onIsloading(false);

        onSearchType(searchType);
        onSearchDate(searchDate);
        onSearchUser(searchUser);

        onLogDatas(res.data);
        setLogDatas(res.data);
      })
      .catch((err) => {
        // error
        console.log(err.response.data.message); // server error message
      });
  };

  // server 에서 response 데이터 가져오기 - 기간
  const callLogDataForRange = async (searchType, searchStartDate, searchEndDate, searchUser) => {
    const url = `/logs/${sParam}/range`;
    const data = {
      log_type: sParam,
      search_type: searchType,
      search_start_date: searchStartDate,
      search_end_date: searchEndDate,
      user_id: searchUser,
      exc_user_id: excludeUserArray,
    };
    const config = { 'Content-Type': 'application/json' };
    await axios
      .post(url, data, config)
      .then((res) => {
        // success
        onIsloading(false);

        onSearchType(searchType);
        onSearchStartDate(searchStartDate);
        onSearchEndDate(searchEndDate);
        onSearchUser(searchUser);

        onLogDatas(res.data);
        setLogDatas(res.data);
      })
      .catch((err) => {
        // error
        console.log(err.response.data.message); // server error message
      });
  };
  // ------------------------- server call end --------------------------------------

  // type 변경 시 type별 형식에 맞는 날짜 리턴
  const getSearchDateForChangeType = (searchType, searchDate) => {
    const date = dayjs(searchDate);
    return searchType === 'day'
      ? `${date.format('YYYY-MM-DD')}`
      : searchType === 'month'
      ? `${date.format('YYYY-MM')}`
      : `${date.format('YYYY')}`;
  };

  // 초기 화면 셋팅
  useEffect(() => {
    async function fetchData() {
      await callUserList(searchType, searchDate);
      await callLogData(searchType, searchDate, searchUser);
      await callTableHead(searchType, searchDate);
      onSearchUserName('All');
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchType = async (event) => {
    const type = event.target.value;

    if (type === 'range') {
      setRangeSearch(true);
      setSearchType(type);

      const sdate = getSearchDateForChangeType('day', searchStartDate);
      const edate = getSearchDateForChangeType('day', searchEndDate);

      await callUserListForRange(sdate, edate); // 사용자 리스트 - 기간
      await callLogDataForRange(searchType, sdate, edate, searchUser); // 로그 데이터 - 기간
      await callTableHeadForRange(sdate, edate); // 테이블 칼럼 - 기간
    } else {
      setRangeSearch(false);
      setSearchType(type);

      const date = getSearchDateForChangeType(type, searchDate);

      await callUserList(type, date);
      await callLogData(type, date, searchUser);
      await callTableHead(type, searchDate);
    }
  };

  // Search Date event
  const handleSearchDate = async (newValue) => {
    const date = getSearchDateForChangeType(searchType, newValue.$d);

    setSearchDate(date);

    await callUserList(searchType, date);
    await callLogData(searchType, date, searchUser);
    await callTableHead(searchType, date);
  };

  // Start Date event
  const handleSearchStartDate = async (newValue) => {
    const sdate = getSearchDateForChangeType('day', newValue.$d);
    const edate = getSearchDateForChangeType('day', searchEndDate);

    setSearchStartDate(sdate);

    await callUserListForRange(sdate, edate); // 사용자 리스트 - 기간
    await callLogDataForRange(searchType, sdate, edate, searchUser); // 로그 데이터 - 기간
    await callTableHeadForRange(sdate, edate); // 테이블 칼럼 - 기간
  };

  // End Date event
  const handleSearchEndDate = async (newValue) => {
    const sdate = getSearchDateForChangeType('day', searchStartDate);
    const edate = getSearchDateForChangeType('day', newValue.$d);

    setSearchEndDate(edate);

    await callUserListForRange(sdate, edate); // 사용자 리스트 - 기간
    await callLogDataForRange(searchType, sdate, edate, searchUser); // 로그 데이터 - 기간
    await callTableHeadForRange(sdate, edate); // 테이블 칼럼 - 기간
  };

  const userChange = async (event) => {
    event.preventDefault();
    try {
      const {
        target: { value },
      } = event;
      setSearchUser(value);
      onSearchUserName(getUserName(value));

      if (searchType === 'range') {
        const sdate = getSearchDateForChangeType('day', searchStartDate);
        const edate = getSearchDateForChangeType('day', searchEndDate);
        await callLogDataForRange(searchType, sdate, edate, value); // 로그 데이터 - 기간
      } else {
        const date = getSearchDateForChangeType(searchType, searchDate);
        await callLogData(searchType, date, value);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <StyledRoot>
      <FormControl sx={{ m: 2, minWidth: 120, ml: 'auto' }}>
        <InputLabel id="demo-simple-select-standard-label">검색 구분</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={searchType}
          onChange={handleSearchType}
          label="dateOption"
          defaultValue="month"
          selected={searchType}
        >
          <MenuItem value="month">월</MenuItem>
          <MenuItem value="year">연</MenuItem>
          <MenuItem value="range">기간</MenuItem>
        </Select>
      </FormControl>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        {rangeSearch ? (
          <>
            <Grid>
              <DatePicker
                sx={{ width: 180, m: 2, mr: 'auto' }}
                label="시작일"
                openTo={'day'}
                views={['year', 'month', 'day']}
                minDate={dayjs('2015-01-01')}
                maxDate={dayjs(searchEndDate)}
                format={'YYYY-MM-DD'}
                value={dayjs(searchStartDate)}
                onAccept={handleSearchStartDate}
                PopperProps={{
                  placement: 'right',
                  anchorEl: null,
                  // sx: { '&.data-popper-placement': 'bottom-start' },
                  disablePortal: true,
                  style: { yIndex: 100000000 },
                }}
              />
            </Grid>
            <Grid>
              <DatePicker
                sx={{ width: 180, m: 2 }}
                label="종료일"
                openTo={'day'}
                views={['year', 'month', 'day']}
                minDate={dayjs(searchStartDate)}
                maxDate={dayjs()}
                format={'YYYY-MM-DD'}
                value={dayjs(searchEndDate)}
                onAccept={handleSearchEndDate}
              />
            </Grid>
          </>
        ) : (
          <Grid>
            <DatePicker
              sx={{ width: 180, m: 2 }}
              label="검색 날짜"
              openTo={searchType}
              views={searchType === 'month' ? ['year', 'month'] : ['year']}
              minDate={dayjs('2015-01-01')}
              maxDate={dayjs()}
              format={searchType === 'month' ? 'YYYY-MM' : 'YYYY'}
              value={dayjs(searchDate)}
              onAccept={handleSearchDate}
            />
          </Grid>
        )}
      </LocalizationProvider>
      <Grid>
        <FormControl sx={{ m: 2, width: 300 }}>
          <InputLabel id="demo-multiple-checkbox-label">사용자</InputLabel>
          <Select
            id="searchUser"
            labelId="demo-multiple-checkbox-label"
            value={userList.length === 1 ? 'All' : searchUser}
            onChange={userChange}
            MenuProps={MenuProps}
            defaultValue="All"
            input={<OutlinedInput label="사용자" />}
          >
            {userList.map((value) => (
              <MenuItem key={value.user_id} value={value.user_id}>
                {value.user_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid container justifyContent="flex-end">
        <Button sx={{ m: 2.5, width: 50 }}>
          <CSVLink
            headers={headLabel}
            data={getExcelData(logDatas)}
            filename={sParam
              .toUpperCase()
              .concat(' 로그 기록_')
              .concat(getUserRealName(searchUser, userList))
              .concat('_')
              .concat(t)
              .concat('.csv')}
            target="_blank"
            style={{ textDecoration: 'none' }}
          >
            EXPORT
          </CSVLink>
        </Button>
      </Grid>
    </StyledRoot>
  );
}
