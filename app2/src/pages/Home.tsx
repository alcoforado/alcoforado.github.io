import React from 'react';
import Banner from '../components/Banner';
import OptionalSideBySide from '../components/OptionalSideBySide';
import AppCard from '../components/AppCard';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import Grid from '@mui/material/Grid'; 
import Item from '@mui/material/Grid'; 

export default function Home():JSX.Element {

  return (
    <>
       <OptionalSideBySide 
            required={
                <Banner>
                    <Typography variant="h5">
                        Welcome to my portfolio App. 
                    </Typography>
                    <Typography variant="h5">
                        Here you will find many interactive webgl applications like games, numerical simulations, calculation tools and much more. Select a card to start
                    </Typography>
                </Banner>
            }
            optional={
                <img  src="./images/poweredby.svg"  height="200px" />
            }
        />
        <Container sx={{
             backgroundImage:`url(${"./images/stripSecondary.svg"})`,
             backgroundRepeat:"no-repeat",
             backgroundSize: "100% auto",
             backgroundPosition:"top",
             minWidth:"100%",
             aspectRatio: "4.4",
             height:"auto",
             paddingTop:"15%"

        }}>
          
        </Container>
        <Container>
        <AppCard
                title="Voronoi Diagram 2D"
                description="Solving Voronoi Diagrams in 2D with Fortuna alghorithm, using 'Beach Curves'">
            </AppCard>
        </Container>
        <Container sx={{
            backgroundImage:`url(${"./images/landscape.svg"})`,
            backgroundRepeat:"no-repeat",
            backgroundSize:"100%",
            backgroundPosition:"top",
            minWidth:"100%",
            height: "auto",
            aspectRatio:"1.84",
            margin:0
        }}/>
       
    </>) as JSX.Element;
}

