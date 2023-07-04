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
  };

  const dateChange = (value) => {
    setSelectedDate(dayjs(value.$d).format('YYYY-MM-DD')); // selectedDate를 설정해줌
    PassSelectedDate(selectedDate); // selectedDate를 받는 function -> Report에서 호출할 것
    // console.log('바뀐 날짜', dayjs(value.$d).format('YYYY-MM-DD'));
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
    // console.log('setLicensename', event.target.value);
    // console.log('setLicensename222', typeof value === 'string' ? value.split(',') : value);
  };
  console.log('license', licenseName);

  const checkAll = (checked) => {
    console.log('checked: ', checked);
    if (checked) {
      setLicenseName(selected);
      console.log('yes checked: ', licenseName);
      console.log('yes length:', licenseName.filter((license) => license !== 'all').length);
    } else {
      setLicenseName([]);
      console.log('no checked: ', licenseName);
      console.log('no length:', licenseName.filter((license) => license !== 'all').length);
    }
    console.log('checked2: ', checked);
    onFilterLicense(licenseName);
    // FilterLicense(licenseName);
  };

  const checkSingle = (checked, value) => {
    if (checked) {
      setLicenseName((prev) => [...prev, value]);
      console.log(
        'licenseName yes',
        licenseName.filter((license) => license !== 'all')
      );
    } else {
      setLicenseName(licenseName.filter((el) => el !== value));
      console.log(
        'licenseName else',
        licenseName.filter((license) => license !== 'all')
      );
    }
    onFilterLicense(licenseName);
  };

  // filterLicense = licenseName;
  // console.log('filterLicense: ', filterLicense);

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
            <InputLabel id="demo-simple-select-standard-label">날짜 옵션</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={selectedOption}
              onChange={onChange}
              label="dateOption"
              defaultValue={selectedOption}
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
            label={selectedOption === 'year' ? '년 단위' : selectedOption === 'month' ? '월 단위' : '일 단위'}
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
            format={selectedOption === 'year' ? 'YYYY' : selectedOption === 'month' ? 'YYYY/MM' : 'YYYY/MM/DD'}
            value={dayjs(selectedDate)}
            onChange={dateChange}
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
            >
              <MenuItem key="all" value="all">
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
      <Box sx={{ m: 3 }}>단위 : {selectedOption === 'year' ? '월' : selectedOption === 'month' ? '일' : '시'}</Box>
    </StyledRoot>
  );
}
