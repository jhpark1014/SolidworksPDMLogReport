import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography } from '@mui/material';
// sections
import {
  AppLogReport
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage2() {
  const generateRandomColor = () => {
    const randomNumber = Math.floor(Math.random() * 0xCCCCCC); 
    console.log(randomNumber.toString(16));
    return `#${randomNumber.toString(16).padEnd(6, "c")}`;
  };

  const color1 = generateRandomColor();
  const color2 = generateRandomColor();

  console.log("color1==>", color1);
  console.log("color2==>", color2);

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          SOLIDWORKS PDM Log Report
        </Typography>

        <Grid container>
          <Grid item xs={12} md={6} lg={12}>
            <AppLogReport
              title="로그인 로그"
              subheader="월 단위(2023-06), All"
              chartLabels={[
                "2023-06-01",
                "2023-06-02",
                "2023-06-03",
                "2023-06-04",
                "2023-06-05",
                "2023-06-06",
                "2023-06-07",
                "2023-06-08",
                "2023-06-09",
                "2023-06-10",
                "2023-06-11",
                "2023-06-12",
                "2023-06-13",
                "2023-06-14",
                "2023-06-15",
                "2023-06-16",
                "2023-06-17",
                "2023-06-18",
                "2023-06-19",
                "2023-06-20",
                "2023-06-21",
                "2023-06-22",
                "2023-06-23",
                "2023-06-24",
                "2023-06-25",
                "2023-06-26",
                "2023-06-27",
                "2023-06-28",
                "2023-06-29",
                "2023-06-30",
                "2023-06-31",
              ]}
              chartData={[                
                {
                  name: 'SW PDM Lic.',
                  type: 'line',
                  fill: 'solid',      
                  dashArray: 0,
                  color: color1,
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 41, 67, 22, 43, 21, 41, 56, 22, 43, 21, 22, 43, 0, 0, 0, 0, 0, 0, 0, 0],
                },
                {
                  name: 'SW PDM 보유',
                  type: 'line',
                  fill: 'solid',           
                  dashArray: 5, 
                  color: color1,
                  data: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70],
                },
                {
                  name: 'SW Lic.',
                  type: 'line',
                  fill: 'solid',                  
                  dashArray: 0,
                  color: color2,
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 36, 30, 45, 35, 64, 52, 59, 45, 35, 64, 45, 35, 0, 0, 0, 0, 0, 0, 0, 0],
                },
                {
                  name: 'SW 보유',
                  type: 'line',
                  fill: 'solid',                  
                  dashArray: 5,
                  color: color2,
                  data: [75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75],
                },
              ]}
            />
          </Grid>


        </Grid>
      </Container>
    </>
  );
}
