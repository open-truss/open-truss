import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
} from '@/components/ui/typography'
import {
  BaseOpenTrussComponentV1PropsShape,
  z,
  type BaseOpenTrussComponentV1,
} from '@open-truss/open-truss'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  color: z.string().default('blue'),
  headerElement: z.enum(['h1', 'h2', 'h3', 'h4']).default('h1'),
  title: z.string().default('Page Title'),
})

const ClientPageTitle: BaseOpenTrussComponentV1<z.infer<typeof Props>> = (
  props,
) => {
  const { color, headerElement, title } = props
  const components = {
    h1: TypographyH1,
    h2: TypographyH2,
    h3: TypographyH3,
    h4: TypographyH4,
  } as const
  const Component = components[headerElement as 'h1' | 'h2' | 'h3' | 'h4']

  return (
    <Component style={{ color }}>
      {title} (I am an {headerElement})
    </Component>
  )
}

export default ClientPageTitle
