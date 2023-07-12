import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
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

export default function UserLoginLogChartPage({ title, subtitle, chartLabels }) {
  const [chartData, setChartData] = useState([]);
  const theme = useTheme();

  const callChartData = async (subtitle) => {
    const searchType = subtitle[0] === '일' ? 'day' : subtitle[0] === '월' ? 'month' : 'year';
    const url = `/logs/loginlicense?search_type=${searchType}&search_date=${subtitle
      .split(',')[1]
      .slice(1)}&lic_id=${subtitle.split(',')[2].slice(1)}`;
    console.log('chart data url_user', url);
    const res = await axios.get(url);
    if (res.data.length !== 0) {
      setChartData(res.data);
    } else {
      setChartData([]);
    }
    console.log('callchartdata', chartData, subtitle, subtitle.split(','));
  };

  useEffect(() => {
    // console.log('subtitle', subtitle[0], subtitle.split(',')[1].slice(1), subtitle.split(',')[2].slice(1));
    callChartData(subtitle);
  }, [subtitle]);

  const generateRandomColor = () => {
    const randomNumber = Math.floor(Math.random() * 0xcccccc);
    // console.log(randomNumber.toString(16));
    return `#${randomNumber.toString(16).padEnd(6, 'c')}`;
  };
  // function generateRandomColorArray(data) {
  //   const colors = new Array(data.length);
  //   return Array.from(colors, () => generateRandomColor());
  // }
  const randomColor = generateRandomColor();

  const holdQtyList = chartData.length !== 0 ? chartData[0].logdata : [1];
  const maxHoldQty = Math.max(...holdQtyList) + 1;

  // console.log('chartData', chartData, chartData.length);
  // const yMax = chartData.length !== 0 ? Math.max(...chartData[0].logdata) + 1 : 5;
  console.log('ymax', holdQtyList, maxHoldQty);

  return (
    <>
      {/* <Container maxWidth="false" disableGutters> */}
      <Grid item xs={12} md={12} lg={24}>
        <AppWebsiteVisits
          title={title}
          subheader={subtitle}
          chartLabels={chartLabels.map((row) => {
            return row.label;
          })}
          // chartData={{
          //   name: chartData[0].licname,
          //   type: 'line',
          //   fill: 'solid',
          //   data: chartData[0].logdata,
          //   color: randomColors[chartData[0].id],
          // }}
          chartData={chartData.map((row) => {
            return {
              name: row.licname,
              type: 'line',
              fill: 'solid',
              data: row.logdata,
              color: randomColor,
            };
          })}
          xaxis={{
            title: {
              style: { fontSize: '12px', fontFamily: '굴림체' },
              text: subtitle[0] === '일' ? '시간 (시)' : subtitle[0] === '월' ? '날짜 (일)' : '날짜 (월)',
            },
          }}
          yaxis={{
            title: { text: '수량 (건)', style: { fontSize: '12px', fontFamily: '굴림체' } },
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
