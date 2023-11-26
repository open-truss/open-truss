import { BaseOpenTrussComponent } from '@open-truss/open-truss'
import { z } from 'zod'

export const Props = BaseOpenTrussComponent.extend({
  flexDirection: z.enum(['column', 'row']),
  color: z.string(),
  margin: z.object({ top: z.number(), bottom: z.number() }),
  catNames: z.array(z.string()),
})

interface ZodDescriptionObject {
  [prop: string]: string | string[] | ZodDescriptionObject
}

const describeZod = (zobject: object): ZodDescriptionObject => {
  return Object.entries(zobject).reduce((description, [key, value]) => {
    if (Object.keys(BaseOpenTrussComponent.shape).includes(key)) { return description }

    const type = value._def.typeName
    if (type === 'ZodEnum') {
      description[key] = { type, shape: Object.keys(value.enum) }
    } else if (type === 'ZodObject') {
      description[key] = { type, shape: describeZod(value.shape) }
    } else if (type === 'ZodArray') {
      const innertype = value._def.type
      description[key] = { type, shape: describeZod({ innertype }).innertype }
    } else if (type === 'ZodUnion') {
      description[key] = value._def.options.map((innertype: z.ZodType) => {
        return { type, shape: describeZod({ innertype }).innertype }
      })
    } else {
      description[key] = { type }
    }
    return description
  }, {} as ZodDescriptionObject)
}

export default async function FlexBox(props: z.infer<typeof Props>) {
  return <div style={{ color: props.color }}>
    {JSON.stringify(describeZod(Props.shape))}
  </div>
}
