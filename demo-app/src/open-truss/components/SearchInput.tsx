import {
  type BaseOpenTrussComponentV1,
  BaseOpenTrussComponentV1PropsShape,
  withChildren,
  StringSignal,
  formatQuery,
  type z,
} from '@open-truss/open-truss'
import { Input } from '@/components/ui/input'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
  query: StringSignal,
  template: StringSignal,
})

const SearchInput: BaseOpenTrussComponentV1<z.infer<typeof Props>> = ({
  template,
  query,
}) => {
  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const value = event.target.value
    const formattedQuery = formatQuery(template.value, {
      params: { value: `%${value.trim()}%` },
    })
    query.value = formattedQuery
  }

  return (
    <div className="m-6 flex flex-col">
      <h2>Currently query: {query}</h2>
      <div className="flex flex-row mt-2 w-1/2 justify-start items-center">
        <Input type="string" onChange={onChangeHandler} />
      </div>
    </div>
  )
}

export default SearchInput
