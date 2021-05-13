import Styled from 'styled-components'

export const PageWrapper = Styled.div`

    display: grid;
    grid-template-columns: 100%;
    justify-items: center;
    background-color: #ffffff;
    width:100vh;
    height:100%;

    .row .column:first-child {
  padding-left: 0;
}

.row .column:last-child {
  padding-right: 0;
}

video {
    width:100vh;
}
    
`
