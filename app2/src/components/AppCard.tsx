import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


interface IAppCardProp {
    children?:React.ReactNode | React.ReactNode[];
    topImage?:string;
    title?:string;
    description?:string;
}

export default function AppCard(prop:IAppCardProp) {
  return (
    <Card raised={true} sx={{ maxWidth: 345,border: "1px solid black"}}>
      <CardMedia
        sx={{ height: 140 }}
        image={prop.topImage}
        title={prop.title}
      />
      <CardContent sx={{}}>
        <Typography gutterBottom variant="h5" component="div">
          {prop.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {prop.description}
        </Typography>
      </CardContent>
      <CardActions sx={{backgroundImage:`url(${"./images/stripSecondary.svg"})`,
             backgroundRepeat:"no-repeat",
             backgroundSize: "100% auto",
             backgroundPosition:"top"}}>
        <Button variant="contained" size="small">Open</Button>
      </CardActions>
    </Card>
  );
}