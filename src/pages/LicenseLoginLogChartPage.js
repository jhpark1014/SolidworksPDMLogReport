import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
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

export default function LicenseLoginChartPage({ title, subtitle, chartLabels, chartDatas }) {
  const theme = useTheme();
  return (
    <>
      <Typography variant="h4" sx={{ mb: 5 }}>
        {/* Solidworks PDM Log Report */}
        로그인 로그 (라이선스)
      </Typography>
      <Grid item xs={12} md={12} lg={24}>
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
        />
      </Grid>
      <br />
      <br />
    </>
  );
}
