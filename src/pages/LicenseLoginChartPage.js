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

export default function LicenseLoginChartPage({ title, subtitle, chartLabels, chartDatas }) {
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
              color: randomColors[row.id],
            };
          })}
          annotations2={chartDatas.map((row) => {
            return {
              y: row.holdqty,
              borderColor: randomColors[row.id],
              strokeDashArray: 5,
              label: {
                borderColor: randomColors[row.id],
                style: {
                  color: '#fff',
                  background: randomColors[row.id],
                },
                text: `${row.licname} 보유 수량`,
              },
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
    </>
  );
}
