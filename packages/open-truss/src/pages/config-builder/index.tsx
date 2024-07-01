import {
  withChildren,
  type BaseOpenTrussComponentV1,
  BaseOpenTrussComponentV1PropsShape,
} from '../../configuration/engine-v1'
import { type z } from 'zod'

export const Props = BaseOpenTrussComponentV1PropsShape.extend({
  ...withChildren,
})

const OTConfigBuilder: BaseOpenTrussComponentV1<z.infer<typeof Props>> = (
  props,
) => {
  return (
    <div className={'config-builder'}>
      <h2 className={'title'}>Config Builder</h2>
    </div>
  )
}

export default OTConfigBuilder
