import PropTypes from 'prop-types';
import axios from 'axios';
// @mui
import { styled } from '@mui/material/styles';
import { Toolbar, FormControl, InputLabel, Select, MenuItem, Box, OutlinedInput } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

// ----------------------------------------------------------------------

// Table Headers
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
  return searchType === 'month' ? getMonthTableHead(searchDate) : TABLE_HEAD_YEAR;
}

PDMLogToolbar.propTypes = {
  sParam: PropTypes.string,
  onIsloading: PropTypes.func,
  onSearchType: PropTypes.func,
  onSearchDate: PropTypes.func,
  onSearchUser: PropTypes.func,
  onLogDatas: PropTypes.func,
  onTableHead: PropTypes.func,
};

export default function PDMLogToolbar({
  sParam,
  onIsloading,
  onSearchType,
  onSearchDate,
  onSearchUser,
  onLogDatas,
  onTableHead,
}) {
  const today = dayjs();
  const dateString = today.format('YYYY-MM'); // 오늘 날짜(년-월) 리턴

  const [searchType, setSearchType] = useState('month');
  const [searchDate, setSearchDate] = useState(dateString);
  const [searchUser, setSearchUser] = useState('All');
  const [userList, setUserList] = useState([]);
  
  const excludeUserName = process.env.REACT_APP_EXCLUDE_USER_NAME;
  const excludeUserArray = typeof excludeUserName === 'string' ? excludeUserName.trim().split(',') : '';

  const callTableHead = async (searchType, searchDate) => {
    onTableHead(getTableHead(searchType, searchDate));
  };

  // server에서 user List 가져오기
  const callUserList = async (searchType, searchDate) => {
    const url = `/logs/userlist`;
    const data = {
        'log_type' : sParam,
        'search_type' : searchType,
        'search_date' : searchDate,
        'exc_user_id' : excludeUserArray,
    };
    const config = {"Content-Type": 'application/json'};
    await axios.post(url, data, config)
        .then(res => {
            // success
            const users = [{ user_id: 'All', user_name: 'All' }];
            if (res.data.length === 0) {
              setUserList(users);
            } else {
              setUserList(users.concat(res.data));
            }
        }).catch(err => {
            // error
            console.log(err.response.data.message); // server error message
        });  
  };

  // server 에서 response 데이터 가져오기
  const callLogData = async (searchType, searchDate, searchUser) => {
    const url = `/logs/${sParam}`;
    const data = {
        'search_type' : searchType,
        'search_date' : searchDate,
        'user_id' : searchUser,
        'exc_user_id' : excludeUserArray,
    };
    const config = {"Content-Type": 'application/json'};

    await axios.post(url, data, config)
        .then(res => {
            // success
            onIsloading(false);

            onSearchType(searchType);
            onSearchDate(searchDate);
            onSearchUser(searchUser);
        
            onLogDatas(res.data);
        }).catch(err => {
            // error
            console.log(err.response.data.message); // server error message
        });  
  };

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
    callUserList(searchType, searchDate);
    callLogData(searchType, searchDate, searchUser);
    callTableHead(searchType, searchDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchType = async (event) => {
    const type = event.target.value;
    const date = getSearchDateForChangeType(type, searchDate);

    setSearchType(type);
    callTableHead(type, searchDate);

    callUserList(type, date);
    callLogData(type, date, searchUser);
  };

  const handleSearchDate = async (newValue) => {
    const date = getSearchDateForChangeType(searchType, newValue.$d);

    setSearchDate(date);
    callTableHead(searchType, date);

    callUserList(searchType, date);
    callLogData(searchType, date, searchUser);
  };

  const userChange = (event) => {
    // console.log('event.target', event.target);
    event.preventDefault();
    try {
      const {
        target: { value },
      } = event;
      setSearchUser(value);

      const date = getSearchDateForChangeType(searchType, searchDate);
      callLogData(searchType, date, value);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <StyledRoot>
      <Box sx={{ display: 'flex', justifyContent: 'left' }}>
        <div>
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
            </Select>
          </FormControl>
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <DatePicker
            sx={{ width: 180, m: 2 }}
            label="검색 날짜"
            openTo={searchType === 'month' ? 'month' : 'year'}
            views={searchType === 'month' ? ['year', 'month'] : ['year']}
            minDate={dayjs('2015-01-01')}
            maxDate={dayjs()}
            format={searchType === 'month' ? 'YYYY-MM' : 'YYYY'}
            // defaultValue={dayjs()}
            value={dayjs(searchDate)}
            onAccept={handleSearchDate}
          />
        </LocalizationProvider>
        <div>
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
        </div>
      </Box>
    </StyledRoot>
  );
}
