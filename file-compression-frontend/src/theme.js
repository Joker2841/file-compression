import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      marginBottom: '16px',
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

export default theme;
