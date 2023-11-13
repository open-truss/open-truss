import type { OpenTrussComponentProps } from '@/types'

function PageTitle({ children }: OpenTrussComponentProps): JSX.Element {
  return <h1>{children}</h1>
}

export default PageTitle
