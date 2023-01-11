import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    secondary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0"
    },
    primary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2"
    }
  }
})

function App() {

  return 
    <AppBar color='secondary'>
      <Toolbar>Hellow world</Toolbar>
    </AppBar>
  
}

export default App;
