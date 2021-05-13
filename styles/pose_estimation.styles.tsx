import Styled from 'styled-components'

export const PageWrapper = Styled.div`

    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    background-color: #ffffff;
    width:100vh;
    height:100%;

    .row .column:first-child {
  padding-left: 0;
  padding-right: 0;
}


video {
    width:100vh;
    height:100%
}
    
`
