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

const ClientPageTitle: BaseOpenTrussComponentV1<z.infer<typeof Props>> = ({
  color,
  headerElement = 'h1',
  title,
}) => {
  let Component
  switch (headerElement) {
    case 'h1':
      Component = TypographyH1
      break
    case 'h2':
      Component = TypographyH2
      break
    case 'h3':
      Component = TypographyH3
      break
    case 'h4':
      Component = TypographyH4
      break
  }

  return (
    <Component style={{ color }}>
      {title} (I am an {headerElement})
    </Component>
  )
}

export default ClientPageTitle
