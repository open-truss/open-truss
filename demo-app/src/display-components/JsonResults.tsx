import { OpenTrussComponent } from '@/types'

const JsonResults: OpenTrussComponent = ({ query: { results } }) => {
  return <div>{JSON.stringify(results)}</div>
}

export default JsonResults

