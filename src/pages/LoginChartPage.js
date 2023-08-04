import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// sections
import { AppWebsiteVisits } from '../sections/@dashboard/app';

const showHoldQty = process.env.REACT_APP_LIC_HOLD_QTY;
// ----------------------------------------------------------------------

LoginChartPage.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  chartLabels: PropTypes.array,
};

export default function LoginChartPage({ title, subtitle, chartLabels, chartDatas }) {
  const theme = useTheme();

  function generateStrokeArray(chartData) {
    const strokeArray = new Array(chartData.length * 2);
    strokeArray.fill(0);
    strokeArray.fill(5, chartData.length, chartData.length * 2);
    return strokeArray;
  }

  function generateStrokeWidthArray(chartData) {
    const strokeArray = new Array(chartData.length * 2);
    strokeArray.fill(3);
    strokeArray.fill(1, chartData.length, chartData.length * 2);
    return strokeArray;
  }

  function generateMarkerArray(chartData) {
    const strokeArray = new Array(chartData.length * 2);
    strokeArray.fill(12);
    strokeArray.fill(0, chartData.length, chartData.length * 2);
    return strokeArray;
  }

  const generateRandomColor = () => {
    const randomNumber = Math.floor(Math.random() * 0xcccccc);
    return `#${randomNumber.toString(16).padEnd(6, 'c')}`;
  };
  function generateRandomColorArray(data) {
    const colors = new Array(data.length).fill(0);
    for (let i = 0; i < data.length; i += 1) {
      const color = generateRandomColor();
      if (colors.indexOf(color) !== -1) {
        i -= 1;
      } else {
        colors[i] = color;
      }
    }
    return Array.from(colors, () => generateRandomColor());
  }

  const randomColors = [
    theme.palette.primary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.primary.dark,
    theme.palette.error.dark,
    theme.palette.warning.dark,
    theme.palette.info.dark,
    theme.palette.success.dark,
    theme.palette.primary.light,
    theme.palette.error.light,
    theme.palette.warning.light,
    theme.palette.info.light,
    theme.palette.success.light,
  ];

  function generateHoldQtyArray(holdqty, chartLabels) {
    return new Array(chartLabels.length).fill(holdqty);
  }

  function generateChartData2(chartDatas) {
    const chartData2 = chartDatas.map((row) => {
      return {
        name: `${row.licname} 보유 수량`,
        type: 'line',
        fill: 'solid',
        data: generateHoldQtyArray(row.holdqty, chartLabels),
        color: randomColors[row.id],
      };
    });
    return chartData2;
  }

  function generatePointAnnotation(chartData2) {
    const pointAnnotation = chartData2.map((row) => {
      return {
        y: row.data[0],
        marker: {
          size: 0,
        },
        label: {
          borderColor: row.color,
          offsetX: 20,
          textAnchor: 'start',
          style: {
            color: '#fff',
            background: row.color,
          },
          text: '보유수량',
        },
      };
    });
    return pointAnnotation;
  }

  const chartData2 = showHoldQty === 'TRUE' ? generateChartData2(chartDatas) : [];
  const pointAnnotation2 = generatePointAnnotation(chartData2);

  return (
    <>
      <Grid item xs={12} md={12} lg={24}>
        <AppWebsiteVisits
          title={title}
          subheader={subtitle}
          chartLabels={chartLabels.map((row) => {
            return row.label;
          })}
          sx={{ height: 436 }}
          stroke={{
            dashArray: generateStrokeArray(chartDatas),
            width: generateStrokeWidthArray(chartDatas),
          }}
          chartOffsetY={-33}
          chartData={chartDatas.map((row) => {
            return {
              name: row.licname,
              type: 'line',
              fill: 'solid',
              data: row.logdata,
              color: randomColors[row.id],
            };
          })}
          chartData2={chartData2}
          legendformatter={(seriesName) => {
            if (seriesName.includes('보유')) return '';
            return seriesName;
          }}
          legendmarker={{ width: generateMarkerArray(chartDatas) }}
          annotations2={pointAnnotation2}
          xaxis={{
            title: {
              offsetY: -8,
              style: { fontSize: '12px', fontFamily: '굴림체' },
              text: subtitle[0] === '일' ? '시간 (시)' : subtitle[0] === '월' ? '날짜 (일)' : '날짜 (월)',
            },
          }}
          yaxis={{
            title: { offsetX: -3, text: '수량 (건)', style: { fontSize: '12px', fontFamily: '굴림체' } },
            labels: {
              formatter: (val) => {
                return val.toFixed(0);
              },
            },
          }}
        />
      </Grid>
    </>
  );
}
