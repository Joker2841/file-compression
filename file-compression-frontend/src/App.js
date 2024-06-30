import React from 'react';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import theme from './theme';
import FileUpload from './components/fileupload';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <FileUpload />
      </Container>
    </ThemeProvider>
  );
};

export default App;
