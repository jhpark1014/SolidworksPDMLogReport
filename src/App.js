import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useTheme } from '@emotion/react';
// import { createTheme } from '@mui/material';
import { koKR } from '@mui/material/locale';
// import { useMemo } from 'react';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

export default function App() {
  const theme = useTheme(koKR);
  // const themeWithLocale = useMemo(() => createTheme(theme, koKR), [koKR, theme]);
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          <StyledChart />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
