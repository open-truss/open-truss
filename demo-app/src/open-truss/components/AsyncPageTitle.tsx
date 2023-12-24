import { type BaseOpenTrussComponentV1Props } from '@open-truss/open-truss'

async function PageTitle({
  children,
}: BaseOpenTrussComponentV1Props): Promise<JSX.Element> {
  return <h1>{children}</h1>
}

export default PageTitle
