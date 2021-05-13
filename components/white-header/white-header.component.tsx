import React from "react"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import * as S from "./white-header.styles"

function WhiteHeader({ url } : { url: string}) {
  return (
    <S.HeaderWrapper>
      <a href={url}>
        <a>
          <ArrowBackIcon style={{ color: "#1958BC", fontSize: "inherit" }} />
        </a>
      </a>
    </S.HeaderWrapper>
  )
}

export default WhiteHeader
