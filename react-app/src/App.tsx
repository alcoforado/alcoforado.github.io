import React from 'react';
import AppBar from '@mui/material/AppBar';
import Banner from './components/Banner';
import OptionalSideBySide from './components/OptionalSideBySide';
import AppCard from './components/AppCard';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import Grid from '@mui/material/Grid'; 
import Item from '@mui/material/Grid';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Voronoi from "./pages/Voronoi"
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

function App():JSX.Element {
  return (
  <>
    <AppBar color='secondary'>
        <Toolbar>
          <IconButton size="large" color="inherit"><MenuIcon/></IconButton>
          <Typography align='left' sx={{flexGrow:1}}>Alcoforado Github Page</Typography>
          <IconButton href="https://linkedin.com/in/marcos-mendes-a2478720" size="large" color="inherit" ><LinkedInIcon/></IconButton>
          <IconButton href="https://github.com/alcoforado" size="large" color="inherit"><GitHubIcon/></IconButton>
        </Toolbar>
    </AppBar>
    <Toolbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="voronoi" element={<Voronoi title="Voronoi Diagram"/>}/>
    </Routes>
  </>) as JSX.Element;
}

export default App;
