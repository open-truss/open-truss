'use client'
import { type BaseOpenTrussComponentV1Props } from '@open-truss/open-truss'

function PageTitle({ children }: BaseOpenTrussComponentV1Props): JSX.Element {
  return <h1>{children}</h1>
}

export default PageTitle
