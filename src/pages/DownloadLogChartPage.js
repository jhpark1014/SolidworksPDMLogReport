// @mui
import { Grid, Container } from '@mui/material';
// sections
import {
  AppWebsiteVisits,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DownloadLogPage(values) {
  return (
    <div>
      <Container maxWidth="false" disableGutters>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={12}>
            <AppWebsiteVisits
              title={values.title}
              subheader={values.subTitle}
              chartLabels={
                values.chartLabels.map((row)=>{                
                    return row.label;
                })
              }
              chartData={
                values.chartDatas.map((row)=>{                
                    return (
                        {
                            name: row.username,
                            type: 'line',
                            fill: 'solid',
                            data: row.logdata,
                        }
                    );
                })
              }            
            />
          </Grid>
        </Grid>                     
      </Container>
    </div>
  );
}
