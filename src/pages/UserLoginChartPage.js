import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { useState } from 'react';
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

// Log Report
import UserLoginReport from './UserLoginLogPage';

// ----------------------------------------------------------------------

export default function UserLoginLogChartPage({ title, subtitle, chartLabels, chartDatas }) {
  const theme = useTheme();
  console.log('무한루프차트');
  return (
    <>
      <Container maxWidth="false" disableGutters>
        {/* <Typography variant="h4" sx={{ mb: 5 }}>
          Solidworks PDM Log Report
        </Typography> */}
        <Grid item xs={12} md={6} lg={12}>
          <AppWebsiteVisits
            title={title}
            subheader={subtitle}
            chartLabels={chartLabels.map((row) => {
              return row.label;
            })}
            chartData={chartDatas.map((row) => {
              return {
                name: row.username,
                type: 'line',
                fill: 'solid',
                data: row.logdata,
              };
            })}
            xaxis={{
              title: { text: subtitle[0] === '일' ? '시간(시)' : subtitle[0] === '월' ? '날짜(일)' : '날짜(월)' },
            }}
            yaxis={{ title: { text: '횟수' } }}
          />
        </Grid>
        <br />
        <br />
      </Container>
    </>
  );
}
