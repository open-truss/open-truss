import { type BaseOpenTrussComponentV1 } from '@open-truss/open-truss'

function PageTitle({ children }: BaseOpenTrussComponentV1): JSX.Element {
  return <h1>{children}</h1>
}

export default PageTitle
