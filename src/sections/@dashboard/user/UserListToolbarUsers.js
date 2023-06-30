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
import { useState } from 'react';
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
};

// ----------------------------------------------------------------------

UserListToolbarUsers.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function UserListToolbarUsers({ numSelected, filterName, onFilterName, setDateOption }) {
  // const [dateOption, setDateOption] = useState(true);
  const [selectedOption, setSelectedOption] = useState('day');
  const onChange = (event) => {
    setSelectedOption(event.target.value);
    setDateOption(event.target.value);
  };
  const [personName, setPersonName] = useState([]);
  const nameChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const selected = LOGLIST.map((n) => n.name);

  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      <div>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">날짜 검색</InputLabel>
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
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <DatePicker
          label={selectedOption === 'year' ? '년 단위' : selectedOption === 'month' ? '월 단위' : '일 단위'}
          openTo={selectedOption === 'year' ? 'year' : selectedOption === 'month' ? 'month' : 'day'}
          views={
            selectedOption === 'year'
              ? ['year']
              : selectedOption === 'month'
              ? ['month', 'year']
              : ['year', 'month', 'day']
          }
          sx={{ width: 180, ml: 2 }}
          minDate={dayjs('2015-01-01')}
          maxDate={dayjs()}
          defaultValue={dayjs()}
          format={selectedOption === 'year' ? 'YYYY' : selectedOption === 'month' ? 'YYYY/MM' : 'YYYY/MM/DD'}
        />
      </LocalizationProvider>
      <div>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-checkbox-label">사용자</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            // multiple
            value={personName}
            onChange={nameChange}
            input={<OutlinedInput label="사용자" />}
            // renderValue={(selected) => (
            //   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            //     {selected.map((value) => (
            //       <Chip key={value} label={value} />
            //     ))}
            //   </Box>
            // )}
            MenuProps={MenuProps}
          >
            {selected.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
                {/* <Checkbox checked={personName.indexOf(name) > -1} />
                <ListItemText primary={name} /> */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <StyledSearch
        value={filterName}
        onChange={onFilterName}
        placeholder="Search user..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
          </InputAdornment>
        }
        sx={{
          ml: 'auto',
        }}
      />
    </StyledRoot>
  );
}
