import {
  type BaseOpenTrussComponentV1,
  BaseOpenTrussComponentV1PropsShape,
} from '@open-truss/open-truss'
import { z } from 'zod'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  color: z.string().default('blue'),
  headerElement: z.enum(['h1', 'h2', 'h3', 'h4', 'h5']).default('h1'),
  title: z.string().default('Page Title'),
})

const ClientPageTitle: BaseOpenTrussComponentV1<z.infer<typeof Props>> = ({
  color,
  headerElement = 'h1',
  title,
}) => {
  const Component = headerElement
  return (
    <Component style={{ color }}>
      {title} (I am an {headerElement})
    </Component>
  )
}

export default ClientPageTitle
