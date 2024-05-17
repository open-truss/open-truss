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

    // This null check been added because signals can be null
    // I set this value to '' to get around the compiler issues
    // but a more valid handling of might include:
    //   - exposing a defaultQuery prop and use that instead
    //   - showing an error to the user
    //   - changing this type to be a static string instead of a signal
    //     since the template would likely be static anyway
    //
    // Option 3 makes the most sense, but instead of implementing that
    // I left this as is so that it can be a useful example to consider.
    const templateValue = template.value ?? ''
    const formattedQuery = formatQuery(templateValue, {
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
