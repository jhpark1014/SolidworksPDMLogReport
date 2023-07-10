import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
// @mui
import { responsiveFontSizes, useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
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

// ----------------------------------------------------------------------

LicenseLoginChartPage.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  chartLabels: PropTypes.array,
  chartDatas: PropTypes.array,
};

function holdQtyArray(holdqty, data) {
  const dataLength = data.length;
  const array = new Array(dataLength).fill(holdqty);
  console.log('array', array);
  return array;
}

export default function LicenseLoginChartPage({ title, subtitle, chartLabels, chartDatas }) {
  const theme = useTheme();
  return (
    <>
      <Grid item xs={12} md={12} lg={24}>
        <AppWebsiteVisits
          title={title}
          subheader={subtitle}
          chartLabels={chartLabels.map((row) => {
            return row.label;
          })}
          chartData={chartDatas.map((row) => {
            return {
              name: row.licname,
              type: 'line',
              fill: 'solid',
              data: row.logdata,
            };
          })}
          xaxis={{
            title: {
              style: { fontSize: '12px', fontFamily: '굴림체' },
              text: subtitle[0] === '일' ? '시간 (시)' : subtitle[0] === '월' ? '날짜 (일)' : '날짜 (월)',
            },
            // axisTicks: { show: true },
          }}
          yaxis={{
            title: { text: '수량 (건)', style: { fontSize: '12px', fontFamily: '굴림체' } },
            // decimalsInFloat: 0,
            lines: { show: false },
            labels: {
              formatter: (val) => {
                return val.toFixed(0);
              },
            },
          }}
        />
      </Grid>
      <br />
      <br />
    </>
  );
}
