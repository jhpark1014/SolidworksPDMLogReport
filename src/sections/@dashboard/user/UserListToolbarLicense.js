import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Box,
  Chip,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useCallback, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
// component
import Iconify from '../../../components/iconify';
// import data
import LOGLIST from '../../../_mock/logdata';

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

// ----------------------------------------------------------------------

UserListToolbarLicense.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.array,
  onFilterName: PropTypes.func,
};

export default function UserListToolbarLicense({
  numSelected,
  // filterName,
  // onFilterName,
  setDateOption,
  // filterLicense, // 선택한 라이선스/
  onFilterLicense,
  PassSelectedDate, // 선택한 날짜 넘겨주는 function
}) {
  const [selectedOption, setSelectedOption] = useState('day');
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const onChange = (event) => {
    setSelectedOption(event.target.value);
    setDateOption(event.target.value);
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    console.log('inputs: ', inputs);
  };

  console.log('date format?: ', typeof selectedDate);

  const dateChange = (value) => {
    // setSelectedDate(dayjs(value.$d).format('YYYY-MM-DD')); // selectedDate를 설정해줌
    // PassSelectedDate(dayjs(value.$d).format('YYYY-MM-DD')); // selectedDate를 받는 function -> Report에서 호출할 것
    setSelectedDate(() => value.$d); // selectedDate를 설정해줌
    PassSelectedDate(
      // selectedOption === 'year'
      //   ? selectedDate.toString().slice(0, 3)
      //   : selectedOption === 'month'
      //   ? selectedDate.toString().slice(0, 6)
      //   : selectedDate
      value.$d
    ); // selectedDate를 받는 function -> Report에서 호출할 것
    // console.log(event.target);

    // handleChange(event);
    console.log('바뀌니?', selectedDate, value.$d);
  };

  // const [personName, setPersonName] = useState([]);
  // const nameChange = (event) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setPersonName(
  //     // On autofill we get a stringified value.
  //     typeof value === 'string' ? value.split(',') : value
  //   );
  // };

  const selected = LOGLIST.map((n) => n.name);

  // 서버 연결하기

  // License List 가져오기
  const [licenseList, setLicenseList] = useState([]);

  // 데이터 불러오기
  const [inputs, setInputs] = useState({
    search_type: 'day',
    search_date: '2023-06-30',
    lic_name: 'swepdm_cadeditorandweb',
  });
  const [err, setError] = useState(null);
  const [res, setRes] = useState([
    {
      lic_name: 'swepdm_cadeditorandweb',
      hold_qty: '13',
      log_data: [0, 0, 0, 0, 0, 0, 0, 1, 6, 7, 7, 6, 6, 6, 4, 4, 4, 5, 5, 5, 4, 2, 1, 0],
    },
  ]);

  // const handleChange = async (e) => {
  //   console.log('event', e);
  //   setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  //   e.preventDefault();
  //   try {
  //     console.log('inputs==>', inputs);

  //     const url = `/logs/loginuser?search_type=${inputs.search_type}&search_date=${inputs.search_date}&lic_name=${inputs.lic_name}`;
  //     const res = await axios.get(url, inputs);
  //     setRes(res);

  //     console.log(res.data);
  //   } catch (err) {
  //     setError(err.response.data);
  //   }
  // };

  const [licenseName, setLicenseName] = useState(selected);
  const licenseChange = (event) => {
    const {
      target: { value },
    } = event;
    // console.log('selected option', event.target.value);
    setLicenseName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    onFilterLicense(typeof value === 'string' ? value.split(',') : value);
    // console.log('setLicensename', event.target.value);
    // console.log('setLicensename222', typeof value === 'string' ? value.split(',') : value);
    console.log(event.target);
    // handleChange();
  };
  console.log('license', licenseName);

  const checkAll = (checked) => {
    console.log('checked: ', checked);
    if (checked) {
      setLicenseName(selected);
      onFilterLicense(selected);
      // handleChange();
      console.log('yes checked: ', licenseName);
      console.log('yes length:', licenseName.filter((license) => license !== 'all').length);
    } else {
      setLicenseName([]);
      onFilterLicense([]);
      // handleChange();
      console.log('no checked: ', licenseName);
      console.log('no length:', licenseName.filter((license) => license !== 'all').length);
    }
    console.log('checked2: ', checked);
    // onFilterLicense(licenseName);
  };

  const checkSingle = (checked, value) => {
    if (checked) {
      setLicenseName((prev) => [...prev, value]);
      onFilterLicense((prev) => [...prev, value]);
      // handleChange();
      console.log(inputs);
      // console.log(
      //   'licenseName yes',
      //   licenseName.filter((license) => license !== 'all')
      // );
    } else {
      setLicenseName(licenseName.filter((el) => el !== value));
      onFilterLicense(licenseName.filter((el) => el !== value));
      // handleChange();
      console.log(inputs);

      // console.log(
      //   'licenseName else',
      //   licenseName.filter((license) => license !== 'all')
      // );
    }
    // onFilterLicense(licenseName);
  };

  // filterLicense = licenseName;
  // console.log('filterLicense: ', filterLicense);
  console.log('toolbar: ', res);

  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'left' }}>
        {/* 날짜 검색 옵션 */}
        <div>
          <FormControl sx={{ m: 2, minWidth: 120, ml: 'auto' }}>
            <InputLabel id="demo-simple-select-standard-label">검색 구분</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={selectedOption}
              onChange={onChange}
              label="dateOption"
              defaultValue={selectedOption}
              name="search_type"
            >
              <MenuItem value="day">일 단위</MenuItem>
              <MenuItem value="month">월 단위</MenuItem>
              <MenuItem value="year">년 단위</MenuItem>
            </Select>
          </FormControl>
        </div>
        {/* 달력 */}
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <DatePicker
            sx={{ width: 180, m: 2 }}
            label="검색 날짜"
            openTo={selectedOption === 'year' ? 'year' : selectedOption === 'month' ? 'month' : 'day'}
            views={
              selectedOption === 'year'
                ? ['year']
                : selectedOption === 'month'
                ? ['month', 'year']
                : ['year', 'month', 'day']
            }
            minDate={dayjs('2015-01-01')}
            maxDate={dayjs()}
            // defaultValue={dayjs()}
            format={selectedOption === 'year' ? 'YYYY' : selectedOption === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD'}
            value={
              // selectedOption === 'year'
              //   ? selectedDate.slice(0, 3)
              //   : selectedOption === 'month'
              //   ? selectedDate.slice(0, 6)
              //   : selectedDate
              dayjs(selectedDate)
            }
            onChange={dateChange}
            name="search_date"
          />
        </LocalizationProvider>
        {/* 라이선스 선택 */}
        <div>
          <FormControl sx={{ m: 2, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">라이선스</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={licenseName.filter((license) => license !== 'all')}
              onChange={licenseChange}
              input={<OutlinedInput label="라이선스" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
              name="lic_name"
            >
              <MenuItem key="all" value="all" onClick={(event) => checkAll(event.target.checked)}>
                <Checkbox
                  checked={licenseName.filter((license) => license !== 'all').length === selected.length}
                  value="모두 선택"
                  onChange={(event) => checkAll(event.target.checked)}
                />
                <ListItemText primary="모두 선택" />
                {/* 모두 선택 */}
              </MenuItem>
              {selected.map((name) => (
                <MenuItem key={name} value={name} onClick={checkSingle}>
                  <Checkbox checked={licenseName.includes(name)} value={name} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Box>
      {/* <Box sx={{ m: 3 }}>
        단위 : {selectedOption === 'year' ? '월' : selectedOption === 'month' ? '일' : '시'}
        <br />
      </Box> */}
    </StyledRoot>
  );
}
