// @mui
import { Grid, Container } from '@mui/material';
// sections
import { AppWebsiteVisits } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function PDMLogChartPage(values) {
  console.log('pdm chart renderingg', values);
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
          xaxis={{ title: { text: `날짜 (${values.xLabel})`, style: { fontSize: '12px', fontFamily: '굴림체' } } }}
          yaxis={{ title: { text: '수량 (건)', style: { fontSize: '12px', fontFamily: '굴림체' } } }}
        />
      </Grid>
    </Container>
  );
}
