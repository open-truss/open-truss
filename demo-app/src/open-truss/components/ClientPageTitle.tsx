'use client'
import { z } from 'zod'
import { BaseOpenTrussComponentV1PropsShape } from '@open-truss/open-truss'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  color: z.string().default('blue'),
  headerElement: z.enum(['h1', 'h2', 'h3', 'h4', 'h5']).default('h1'),
  title: z.string().default('Page Title'),
})

function PageTitle({
  color,
  headerElement,
  title,
}: z.infer<typeof Props>): JSX.Element {
  const Component = headerElement
  return (
    <Component style={{ color }}>
      {title} (I am an {headerElement})
    </Component>
  )
}

export default PageTitle
