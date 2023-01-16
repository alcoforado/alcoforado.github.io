import styled from '@emotion/styled'

interface IOptionalSideProp {
    required: React.ReactNode;
    optional: React.ReactNode;
    optionalAlign?: "left"|"right";
    widthBreak?:string; //empty for auto hide
}

const Container = styled.div`
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center; 
`;

const RequiredDiv = styled.div``
const OptionalDiv = styled.div`
    flex-grow: 1;
    text-align: right;
    padding-right: 30px;
    @media(max-width: 1000px)
    {
        display:none;
    }
`
export default function OptionalSide(props:IOptionalSideProp) {
  return <Container>
        <RequiredDiv>
            {props.required}
        </RequiredDiv>
        <OptionalDiv>
            {props.optional}                                                                                                                                                                                                    
        </OptionalDiv>
    </Container>
}
