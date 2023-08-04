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
  Button,
  Tooltip,
  Grid,
  Typography,
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
  height: 85,
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

const excludeUserName = process.env.REACT_APP_EXCLUDE_USER_NAME;
const excludeUserArray = typeof excludeUserName === 'string' ? excludeUserName.trim().split(',') : '';

// ----------------------------------------------------------------------

function getExcelData(logDatas) {
  const excelData = structuredClone(logDatas);
  for (let i = 0; i < excelData.length; i += 1) {
    for (let j = 1; j < excelData[0].logdata.length + 1; j += 1) {
      excelData[i][j] = excelData[i].logdata[j - 1];
    }
  }
  return excelData;
}

function getLicRealName(licid) {
  let realName = '';
  if (licid === 'All') {
    return 'All';
  }
  licnames.forEach((lic) => {
    if (licid === lic.lic_id) {
      realName = lic.lic_name;
    }
  });
  return realName;
}

// ----------------------------------------------------------------------

UserListToolbarLoginLicense.propTypes = {
  onIsLoading: PropTypes.func,
  onSearchOption: PropTypes.func,
  onDateOption: PropTypes.func,
  onLicenseOption: PropTypes.func,
  onLogDatas: PropTypes.func,
  onStartDateOption: PropTypes.func,
  onEndDateOption: PropTypes.func,
  headLabel: PropTypes.array,
};

export default function UserListToolbarLoginLicense({
  onIsLoading,
  onSearchOption,
  onDateOption,
  onLicenseOption,
  onLogDatas,
  onStartDateOption,
  onEndDateOption,
  headLabel,
}) {
  const today = dayjs();
  const todayDate = today.format('YYYYMMDD');
  const todayString = today.format('YYYY-MM-DD'); // 오늘 날짜(년-월) 리턴
  const [selectedOption, setSelectedSearch] = useState('day'); // 날짜 검색 옵션
  const [selectedDate, setSelectedDate] = useState(todayString); // 검색할 날짜
  const [searchDate, setSearchDate] = useState(''); // 검색할 날짜 포맷 변경
  const [selectedStartDate, setSelectedStartDate] = useState(today.subtract(7, 'd').format('YYYY-MM-DD')); // 시작일
  const [selectedEndDate, setSelectedEndDate] = useState(todayString); // 종료일
  const [licenseList, setLicenseList] = useState([]); // 선택 날짜에서의 License List 목록
  const [selectedLicense, setSelectedLicense] = useState('All'); // select에 보여질 license 이름
  const [logDatas, setLogDatas] = useState([]);
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
        res.data.map((row) =>
          licnames.forEach((lic) => {
            if (row.lic_id === lic.lic_id) {
              row.lic_name = lic.lic_name;
            }
          })
        );

        onSearchOption(searchType);
        onDateOption(searchDate);
        setSearchDate(searchDate);

        setLicenseList(lics.concat(res.data));
      })
      .catch((err) => {
        // error
        console.log(err.response.data.message); // server error message
      });
  };

  // server에서 License List 가져오기 - 기간
  const callLicenseListForRange = async (searchStartDate, searchEndDate) => {
    const lics = [{ lic_id: 'All', lic_name: 'All' }];

    const url = `/logs/licenselist/range`;
    const data = {
      search_start_date: searchStartDate,
      search_end_date: searchEndDate,
      exc_lic_id: excludeLicArray,
    };
    const config = { 'Content-Type': 'application/json' };

    await axios
      .post(url, data, config)
      .then((res) => {
        // success
        onIsLoading(false);
        res.data.map((row) =>
          licnames.forEach((lic) => {
            if (row.lic_id === lic.lic_id) {
              row.lic_name = lic.lic_name;
            }
          })
        );
        setLicenseList(lics.concat(res.data));
      })
      .catch((err) => {
        // error
        console.log(err.response.data.message); // server error message
      });
  };

  // 기존 라이선스가 있는지 확인, 없으면 신규 라이선스로 대체
  function getExistLicense(lics, selectedLicense) {
    let existLic = '';

    if (lics.length === 0) {
      setSelectedLicense('All');
      existLic = 'All';
      return existLic;
    }

    if (selectedLicense !== '') {
      lics.map((value) => {
        if (selectedLicense === value.lic_id) {
          existLic = value.lic_id;
        }
        return value.lic_id;
      });
    }

    if (existLic === '') {
      existLic = 'All';
      setSelectedLicense('All');
    }

    return existLic;
  }

  // server 에서 response 데이터 가져오기
  const callLogData = async (searchType, searchDate, selectedLicense) => {
    const sLic = getExistLicense(licenseList, selectedLicense);

    const url = `/logs/loginlicense`;
    const data = {
      search_type: searchType,
      search_date: searchDate,
      lic_id: sLic,
      exc_lic_id: excludeLicArray,
      exc_user_id: excludeUserArray,
    };
    const config = { 'Content-Type': 'application/json' };

    const datas = await axios
      .post(url, data, config)
      .then((res) => {
        // success
        onIsLoading(false);

        onSearchOption(searchType);
        onDateOption(searchDate);
        setSearchDate(searchDate);
        onLicenseOption(sLic);

        onLogDatas(res.data);
        setLogDatas(res.data);
      })
      .catch((err) => {
        // error
        console.log(err.response.data.message); // server error message
      });
    return datas;
  };

  // server 에서 response 데이터 가져오기 - 기간
  const callLogDataForRange = async (searchType, selectedLicense, searchStartDate, searchEndDate) => {
    const sLic = getExistLicense(licenseList, selectedLicense);

    const url = `/logs/loginlicense/range`;
    const data = {
      search_type: searchType,
      search_start_date: searchStartDate,
      search_end_date: searchEndDate,
      lic_id: sLic,
      exc_lic_id: excludeLicArray,
      exc_user_id: excludeUserArray,
    };
    const config = { 'Content-Type': 'application/json' };

    const datas = await axios
      .post(url, data, config)
      .then((res) => {
        // success
        onIsLoading(false);

        onSearchOption(searchType);
        onStartDateOption(searchStartDate);
        onEndDateOption(searchEndDate);
        onLicenseOption(sLic);

        onLogDatas(res.data);
        setLogDatas(res.data);
      })
      .catch((err) => {
        // error
        console.log(err.response.data.message); // server error message
      });
    return datas;
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

  // 기간 검색 시 파일 명
  const getRangeDateFileName = (selectedStartDate, selectedEndDate) => {
    const filename = '';
    return filename
      .concat(getSearchDateForChangeType('day', selectedStartDate))
      .concat('~')
      .concat(getSearchDateForChangeType('day', selectedEndDate));
  };

  useEffect(() => {
    async function fetchData() {
      await callLicenseList(selectedOption, selectedDate); // license list
      await callLogData(selectedOption, selectedDate, selectedLicense); // log data
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 날짜 검색 옵션 바꿀 시
  const optionChange = async (e) => {
    e.preventDefault();
    try {
      const type = e.target.value;
      setSelectedSearch(type);

      if (type === 'range') {
        setRangeSearch(true);
        const sDate = getSearchDateForChangeType('day', selectedStartDate);
        const eDate = getSearchDateForChangeType('day', selectedEndDate);
        await callLicenseListForRange(sDate, eDate);
        await callLogDataForRange(type, selectedLicense, sDate, eDate);
      } else {
        setRangeSearch(false);
        const searchDate = getSearchDateForChangeType(type, selectedDate);
        await callLicenseList(type, searchDate);
        await callLogData(type, searchDate, selectedLicense);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 검색할 날짜를 바꿀 시
  const dateChange = async (value) => {
    try {
      const searchDate = getSearchDateForChangeType(selectedOption, value.$d);
      setSelectedDate(() => searchDate); // selectedDate를 설정해줌

      await callLicenseList(selectedOption, searchDate);
      await callLogData(selectedOption, searchDate, selectedLicense);
    } catch (err) {
      console.log(err);
    }
  };

  const startDateChange = async (value) => {
    try {
      const sDate = getSearchDateForChangeType('day', value.$d);
      const eDate = getSearchDateForChangeType('day', selectedEndDate);

      setSelectedStartDate(sDate);

      await callLicenseListForRange(sDate, eDate);
      await callLogDataForRange(selectedOption, selectedLicense, sDate, eDate);
    } catch (err) {
      console.log(err);
    }
  };

  const endDateChange = async (value) => {
    try {
      const sDate = getSearchDateForChangeType('day', selectedStartDate);
      const eDate = getSearchDateForChangeType('day', value.$d);

      setSelectedEndDate(eDate);

      await callLicenseListForRange(sDate, eDate);
      await callLogDataForRange(selectedOption, selectedLicense, sDate, eDate);
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

      if (selectedOption === 'range') {
        const sDate = getSearchDateForChangeType('day', selectedStartDate);
        const eDate = getSearchDateForChangeType('day', selectedEndDate);
        await callLogDataForRange(selectedOption, license, sDate, eDate);
      } else {
        const searchDate = getSearchDateForChangeType(selectedOption, selectedDate);
        await callLogData(selectedOption, searchDate, license);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <StyledRoot>
      {/* 날짜 검색 옵션 */}
      <FormControl sx={{ m: 2.5, ml: 'auto', minWidth: 120 }}>
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
      {/* 달력 */}
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        {rangeSearch ? (
          <>
            <Grid>
              <DatePicker
                sx={{ width: 180, my: 2.5, ml: 2.5, mr: 1.5 }}
                label="시작일"
                openTo={'day'}
                views={['year', 'month', 'day']}
                minDate={dayjs('2015-01-01')}
                maxDate={dayjs(selectedEndDate)}
                format={'YYYY-MM-DD'}
                value={dayjs(selectedStartDate)}
                onAccept={startDateChange}
              />
            </Grid>
            <Grid>
              <DatePicker
                sx={{ width: 180, height: 52, my: 2.5, mr: 2.5 }}
                label="종료일"
                openTo={'day'}
                views={['year', 'month', 'day']}
                minDate={dayjs(selectedStartDate)}
                maxDate={dayjs()}
                format={'YYYY-MM-DD'}
                value={dayjs(selectedEndDate)}
                onAccept={endDateChange}
              />
            </Grid>
          </>
        ) : (
          <Grid>
            <DatePicker
              sx={{ width: 180, my: 2.5, ml: 2.5, mr: 1.5 }}
              label="검색 날짜"
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
              onChange={dateChange}
            />
          </Grid>
        )}
      </LocalizationProvider>
      {/* 라이선스 선택 */}
      <Grid>
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
                <Tooltip arrow placement="right" title={value.lic_name}>
                  <Typography noWrap>{value.lic_name}</Typography>
                </Tooltip>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid container justifyContent="flex-end">
        <Button sx={{ m: 2.5 }}>
          <CSVLink
            headers={headLabel}
            data={getExcelData(logDatas)}
            filename={'라이선스 로그'
              .concat('_')
              .concat(
                selectedOption === 'range'
                  ? getRangeDateFileName(selectedStartDate, selectedEndDate)
                  : getSearchDateForChangeType(selectedOption, selectedDate)
              )
              .concat('_')
              .concat(getLicRealName(selectedLicense))
              .concat('_')
              .concat(todayDate)
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
