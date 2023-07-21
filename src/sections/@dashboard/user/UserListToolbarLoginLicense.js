import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {
  Toolbar,
  OutlinedInput,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Box,
  Button,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CSVLink } from 'react-csv';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import axios from 'axios';
import licnames from '../../../_mock/licnames';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
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
  autoFocus: false,
};

const excludeLicName = process.env.REACT_APP_EXCLUDE_LIC_NAME;
const excludeLicArray = typeof excludeLicName === 'string' ? excludeLicName.trim().split(',') : '';

// ----------------------------------------------------------------------

UserListToolbarLoginLicense.propTypes = {
  onIsLoading: PropTypes.func,
  onSearchOption: PropTypes.func,
  onDateOption: PropTypes.func,
  onLicenseOption: PropTypes.func,
};

export default function UserListToolbarLoginLicense({
  onIsLoading,
  onSearchOption,
  onDateOption,
  onLicenseOption,
  onLogDatas,
}) {
  const today = dayjs();
  const todayString = today.format('YYYY-MM-DD'); // 오늘 날짜(년-월) 리턴
  const [selectedOption, setSelectedSearch] = useState('day'); // 날짜 검색 옵션
  const [selectedDate, setSelectedDate] = useState(todayString); // 검색할 날짜
  const [selectedStartDate, setSelectedStartDate] = useState(todayString); // 검색할 날짜
  const [selectedEndDate, setSelectedEndDate] = useState(todayString); // 검색할 날짜
  const [licenseList, setLicenseList] = useState([]); // 선택 날짜에서의 License List 목록
  const [selectedLicense, setSelectedLicense] = useState('All'); // select에 보여질 license 이름
  const [rangeSearch, setRangeSearch] = useState(false);

  // server에서 License List 가져오기
  const callLicenseList = async (searchType, searchDate) => {
    const lics = [{ lic_id: 'All', lic_name: 'All' }];

    const url = `/logs/licenselist`;
    const data = {
      search_type: searchType,
      search_date: searchDate,
      exc_lic_id: excludeLicArray,
    };
    const config = { 'Content-Type': 'application/json' };

    await axios
      .post(url, data, config)
      .then((res) => {
        // success
        onIsLoading(false);
        res.data.map((row) => {
          return licnames.forEach((lic) => {
            if (row.lic_id === lic.lic_id) {
              row.lic_name = lic.lic_name;
            }
          });
        });

        onSearchOption(searchType);
        onDateOption(searchDate);

        setLicenseList(lics.concat(res.data));
      })
      .catch((err) => {
        // error
        console.log(err.response.data.message); // server error message
      });
  };

  // server 에서 response 데이터 가져오기
  const callLogData = async (searchType, searchDate, selectedLicense) => {
    const url = `/logs/loginlicense`;
    const data = {
      search_type: searchType,
      search_date: searchDate,
      lic_id: selectedLicense,
      exc_lic_id: excludeLicArray,
    };
    const config = { 'Content-Type': 'application/json' };

    await axios
      .post(url, data, config)
      .then((res) => {
        // success
        onIsLoading(false);

        onSearchOption(searchType);
        onDateOption(searchDate);
        onLicenseOption(selectedLicense);

        onLogDatas(res.data);
      })
      .catch((err) => {
        // error
        console.log(err.response.data.message); // server error message
      });

    onIsLoading(false);

    onSearchOption(searchType);
    onDateOption(searchDate);
    onLicenseOption(selectedLicense);

    return res.data;
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

  useEffect(() => {
    callLicenseList(selectedOption, selectedDate); // selectedEndDate
    callLogData(selectedOption, selectedDate, selectedLicense); // selectedEndDate
  }, []);

  // 날짜 검색 옵션 바꿀 시
  const optionChange = async (e) => {
    e.preventDefault();
    try {
      const type = e.target.value;

      if (type === 'range') {
        setRangeSearch(true);
      } else {
        setRangeSearch(false);
      }

      setSelectedSearch(type);
      const searchDate = getSearchDateForChangeType(type, selectedDate);
      // const searchEndDate = getSearchDateForChangeType(type, selectedEndDate);

      callLicenseList(type, searchDate);
      callLogData(type, searchDate, selectedLicense);
    } catch (err) {
      console.log(err);
    }
  };

  // 검색할 날짜를 바꿀 시
  const dateChange = async (value) => {
    try {
      const searchDate = getSearchDateForChangeType(selectedOption, value.$d);
      setSelectedDate(() => searchDate); // selectedDate를 설정해줌

      callLicenseList(selectedOption, searchDate);
      callLogData(selectedOption, searchDate, selectedLicense);
    } catch (err) {
      console.log(err);
    }
  };

  const startDateChange = async (value) => {
    try {
      const startDate = getSearchDateForChangeType('day', value.$d);
      setSelectedStartDate(() => startDate);
      console.log('startDateChange', selectedStartDate);
    } catch (err) {
      console.log(err);
    }
  };

  const endDateChange = async (value) => {
    try {
      const endDate = getSearchDateForChangeType('day', value.$d);
      setSelectedEndDate(() => endDate);
      console.log('endDateChange', selectedEndDate);
      // callLogData(selectedOption, selectedDate, selectedLicense);
    } catch (err) {
      console.log(err);
    }
  };

  // 검색할 라이선스를 바꿀 시
  const licenseChange = async (e) => {
    e.preventDefault();
    try {
      const license = e.target.value;
      setSelectedLicense(license);
      const searchDate = getSearchDateForChangeType(selectedOption, selectedDate);
      callLogData(selectedOption, searchDate, license);
    } catch (err) {
      console.log(err);
    }
    // MULTIPLE SELECT일 시
    // setLicenseName(
    //   // On autofill we get a stringified value.
    //   typeof value === 'string' ? value.split(',') : value
    // );
  };

  // MULTIPLE SELECT일 때 쓰는 함수들
  // const checkAll = (checked) => {
  //   if (checked) {
  //     setLicenseName(licenseName);
  //     // handleChange();
  //     // console.log('yes checked: ', licenseName);
  //     // console.log('yes length:', licenseName.filter((license) => license !== 'all').length);
  //   } else {
  //     setLicenseName([]);
  //     // handleChange();
  //     // console.log('no checked: ', licenseName);
  //     // console.log('no length:', licenseName.filter((license) => license !== 'all').length);
  //   }
  //   // onFilterLicense(licenseName);
  // };

  // const checkSingle = (checked, value) => {
  //   if (checked) {
  //     setLicenseName((prev) => [...prev, value]);
  //     // handleChange();
  //     // console.log(inputs);
  //   } else {
  //     setLicenseName(licenseName.filter((el) => el !== value));
  //     // handleChange();
  //     // console.log(inputs);
  //   }
  // };

  const checkSingle = (event) => {
    setSelectedLicense(event.target.value);
  };

  return (
    <StyledRoot>
      <Box sx={{ display: 'flex', justifyContent: 'left' }}>
        {/* 날짜 검색 옵션 */}
        <div>
          <FormControl sx={{ m: 2.5, minWidth: 120, ml: 'auto' }}>
            <InputLabel id="demo-simple-select-standard-label">검색 구분</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={selectedOption}
              onChange={optionChange}
              label="dateOption"
              defaultValue={selectedOption}
              name="search_type"
            >
              <MenuItem value="day">일</MenuItem>
              <MenuItem value="month">월</MenuItem>
              <MenuItem value="year">연</MenuItem>
              <MenuItem value="range">기간</MenuItem>
            </Select>
          </FormControl>
        </div>
        {/* 달력 */}
        {rangeSearch ? (
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DatePicker
              sx={{ width: 180, my: 2.5, ml: 2.5, mr: 1.5 }}
              label="시작 날짜"
              openTo={'day'}
              views={['year', 'month', 'day']}
              minDate={dayjs('2015-01-01')}
              maxDate={dayjs(selectedEndDate)}
              format={'YYYY-MM-DD'}
              value={dayjs(selectedStartDate)}
              onAccept={startDateChange}
            />
            <DatePicker
              sx={{ width: 180, my: 2.5, mr: 2.5 }}
              label="종료 날짜"
              openTo="day"
              views={['year', 'month', 'day']}
              minDate={dayjs(selectedStartDate)}
              maxDate={dayjs()}
              // defaultValue={dayjs()}
              format={'YYYY-MM-DD'}
              value={dayjs(selectedEndDate)}
              onAccept={endDateChange}
            />
          </LocalizationProvider>
        ) : (
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DatePicker
              sx={{ width: 180, my: 2.5, ml: 2.5, mr: 1.5 }}
              label="검색 날짜"
              openTo={selectedOption === 'year' ? 'year' : selectedOption === 'month' ? 'month' : 'day'}
              views={
                selectedOption === 'year'
                  ? ['year']
                  : selectedOption === 'month'
                  ? ['year', 'month']
                  : ['year', 'month', 'day']
              }
              minDate={dayjs('2015-01-01')}
              maxDate={dayjs()}
              format={selectedOption === 'year' ? 'YYYY' : selectedOption === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD'}
              value={dayjs(selectedDate)}
              onAccept={dateChange}
            />
          </LocalizationProvider>
        )}
        {/* 라이선스 선택 */}
        <div>
          <FormControl sx={{ m: 2.5, width: 420 }}>
            <InputLabel id="demo-multiple-checkbox-label">라이선스</InputLabel>
            <Select
              sx={{ height: 56 }}
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              // multiple
              value={licenseList.length === 1 ? 'All' : selectedLicense}
              onChange={licenseChange}
              input={<OutlinedInput label="라이선스" />}
              MenuProps={MenuProps}
              defaultValue="All"
            >
              {licenseList.map((value) => (
                <MenuItem key={value.lic_id} value={value.lic_id}>
                  {value.lic_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Button>
          <CSVLink
            headers={[]}
            data={callLogData(selectedOption, selectedDate, selectedLicense)}
            filename={'라이선스 로그인 기록'.concat('_').concat(selectedLicense).concat('.csv')}
            target="_blank"
          >
            EXPORT
          </CSVLink>
        </Button>
      </Box>
    </StyledRoot>
  );
}
