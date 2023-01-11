import React from 'react';
import AppBar from '@mui/material/AppBar';
import Banner from './components/Banner';
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
      <IconButton size="large" color="inherit" ><LinkedInIcon/></IconButton>
      <IconButton size="large" color="inherit"><GitHubIcon/></IconButton>
        
      </Toolbar>
      
 </AppBar>
 <Toolbar/>


<Banner>
    <Typography variant="h5">
      Welcome to my portfolio App. 
    </Typography>
    <Typography variant="h5">
      Here you will find many interactive webgl applications like games, numerical simulations, calculation tools and much more. Select a card to start
    </Typography>
</Banner>


 <Container sx={{
  backgroundImage:`url(${"./images/landscape.svg"})`,
  backgroundRepeat:"no-repeat",
  backgroundSize:"100%",
  backgroundPosition:"bottom",
  minWidth:"100%",
  minHeight:"100vh",
  height: "auto",
  aspectRatio:"1.84",
  margin:0
  }}>
 </Container>
 </>) as JSX.Element;
    

  
}

export default App;
