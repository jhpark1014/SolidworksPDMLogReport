import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
// sections
// import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// Log Report
import LogPage from './DefaultLogReport';
import LicenseLoginLogReport from './LicenseLoginReport';

// ----------------------------------------------------------------------

const CHART_LABEL_DAY = [
  '1시',
  '2시',
  '3시',
  '4시',
  '5시',
  '6시',
  '7시',
  '8시',
  '9시',
  '10시',
  '11시',
  '12시',
  '13시',
  '14시',
  '15시',
  '16시',
  '17시',
  '18시',
  '19시',
  '20시',
  '21시',
  '22시',
  '23시',
  '24시',
];

const CHART_LABEL_MONTH = [
  '1일',
  '2일',
  '3일',
  '4일',
  '5일',
  '6일',
  '7일',
  '8일',
  '9일',
  '10일',
  '11일',
  '12일',
  '13일',
  '14일',
  '15일',
  '16일',
  '17일',
  '18일',
  '19일',
  '20일',
  '21일',
  '22일',
  '23일',
  '24일',
  '24일',
  '25일',
  '26일',
  '27일',
  '28일',
  '29일',
  '30일',
  '31일',
];

const CHART_LABEL_YEAR = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export default function LicenseLoginLogPage({ dateOption, selectedDate }) {
  const theme = useTheme();
  // const [passSelectedDate, setPassSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  // useMemo(() => {
  //   setPassSelectedDate(passSelectedDate);
  // }, [passSelectedDate]);
  // console.log('으으', passSelectedDate);

  // if (selectedDatePass.length > 4) {
  //   selectedDatePass.split('/');
  // }
  // console.log('grid selected date', JSON.stringify(dateOption));
  // console.log('typeof', typeof CHART_LABEL_YEAR);

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="false" disableGutters>
        <Typography variant="h4" sx={{ mb: 5 }}>
          {/* Solidworks PDM Log Report */}
          로그인 로그 (라이선스)
        </Typography>

        <Grid container>
          <Grid item xs={12} md={12} lg={24}>
            <AppWebsiteVisits
              title="로그인 로그 (라이선스)"
              subheader={
                // JSON.stringify(dateOption) === '"year"'
                //   ? JSON.stringify(selectedDate).split(/["-]/)[1]
                //   : JSON.stringify(dateOption) === '"month"'
                //   ? JSON.stringify(selectedDate).slice(0, -4).split('"')
                //   : JSON.stringify(selectedDate).split('"')
                JSON.stringify(selectedDate)
              }
              chartLabels={
                JSON.stringify(dateOption) === '"year"'
                  ? CHART_LABEL_YEAR
                  : JSON.stringify(dateOption) === '"month"'
                  ? CHART_LABEL_MONTH
                  : CHART_LABEL_DAY
              }
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>
        </Grid>
        <br />
        <br />
        {/* <LicenseLoginLogReport setPassSelectedDate={setPassSelectedDate} /> */}
      </Container>
    </>
  );
}
