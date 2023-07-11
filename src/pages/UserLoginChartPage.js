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
  const generateRandomColor = () => {
    const randomNumber = Math.floor(Math.random() * 0xcccccc);
    // console.log(randomNumber.toString(16));
    return `#${randomNumber.toString(16).padEnd(6, 'c')}`;
  };
  function generateRandomColorArray(data) {
    const colors = new Array(data.length);
    return Array.from(colors, () => generateRandomColor());
  }
  const randomColors = generateRandomColorArray(chartDatas);

  const holdQtyList = chartDatas.map((row) => row.holdqty);
  const maxHoldQty = Math.max(...holdQtyList) + 3;

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
                color: randomColors[row.id],
              };
            })}
            xaxis={{
              style: { fontSize: '12px', fontFamily: '굴림체' },
              title: { text: subtitle[0] === '일' ? '시간 (시)' : subtitle[0] === '월' ? '날짜 (일)' : '날짜 (월)' },
            }}
            yaxis={{
              title: { text: '수량 (건)', style: { fontSize: '12px', fontFamily: '굴림체' } },
              labels: {
                formatter: (val) => {
                  return val.toFixed(0);
                },
              },
              max: maxHoldQty,
            }}
          />
        </Grid>
        <br />
        <br />
      </Container>
    </>
  );
}
