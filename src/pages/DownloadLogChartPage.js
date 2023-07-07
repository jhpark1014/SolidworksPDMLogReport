// @mui
import { Grid, Container } from '@mui/material';
// sections
import { AppWebsiteVisits } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DownloadLogChartPage(values) {  
  return (        
    <Container maxWidth="false" disableGutters>
      <Grid item xs={12} md={6} lg={12}>
        <AppWebsiteVisits
          title={values.title}
          subheader={values.subTitle}        
          chartLabels={
            values.chartLabels.map((row)=>(row.label))
          }
          chartData={
            values.chartDatas.map((row)=>(                
              {
                  name: row.username,
                  type: 'line',
                  fill: 'solid',
                  data: row.logdata,
              }
            ))
          }            
          xaxis={{title: {text:`날짜 (${values.xLabel})`}}}
          yaxis={{title: {text:'수량 (건)'}}}
        />
      </Grid>
    </Container>
  );
}
