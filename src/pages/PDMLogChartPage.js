// @mui
import { Grid, Container } from '@mui/material';
// sections
import { AppWebsiteVisits } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function PDMLogChartPage(values) {
  return (
    <Container maxWidth="false" disableGutters>
      <Grid item xs={12} md={6} lg={12}>
        <AppWebsiteVisits
          title={values.title}
          subheader={values.subTitle}
          chartLabels={values.chartLabels.map((row) => row.label)}
          chartData={values.chartDatas.map((row) => ({
            name: row.username,
            type: 'line',
            fill: 'solid',
            data: row.logdata,
          }))}
          sx={{ height: 436 }}
          chartOffsetY={-33}
          xaxis={{
            offsetY: -8,
            title: { text: `날짜 (${values.xLabel})`, style: { fontSize: '12px', fontFamily: '굴림체' } },
          }}
          yaxis={{ offsetX: -3, title: { text: '수량 (건)', style: { fontSize: '12px', fontFamily: '굴림체' } } }}
        />
      </Grid>
    </Container>
  );
}
