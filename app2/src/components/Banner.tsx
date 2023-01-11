/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react'
import Box from '@mui/material/Box';
import { css } from '@emotion/react'

interface IBannerProp {
    children?:React.ReactNode|React.ReactNode[];
    image?:string;
    textSize?:string;
}


export default function Banner(props:IBannerProp) {

return <Box sx={{ //backgroundImage:`url(${"./images/corners.svg"})`,
backgroundRepeat:"no-repeat",
backgroundSize:"100%",
backgroundPosition:"center",
backgroundClip:"border-box",
height: "auto",
position:"relative",
maxWidth: "750px"

//aspectRatio:"1.777777",
}}>
    <img src="./images/corners.svg" width="100%" height="100%" css={{position:"absolute"}}/>
    <div css={{
        position: "relative",
        top:"20%",
        left:"20%",
        width:"60%",
        padding:"8% 0"
    }}>
    {props.children}
    </div>
</Box>
}

