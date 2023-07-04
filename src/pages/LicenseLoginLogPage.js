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

export default function LicenseLoginLogPage(dateOption, selectedDate) {
  const theme = useTheme();
  // const [passSelectedDate, setPassSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  // useMemo(() => {
  //   setPassSelectedDate(passSelectedDate);
  // }, [passSelectedDate]);
  // console.log('으으', passSelectedDate);

  // if (selectedDatePass.length > 4) {
  //   selectedDatePass.split('/');
  // }
  console.log('grid selected date', JSON.stringify(selectedDate));

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="false" disableGutters>
        {/* <Typography variant="h4" sx={{ mb: 5 }}>
          Solidworks PDM Log Report
        </Typography> */}

        <Grid container>
          <Grid item xs={12} md={12} lg={12}>
            <AppWebsiteVisits
              title="로그인 로그 (라이선스)"
              subheader={String(selectedDate)}
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
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
