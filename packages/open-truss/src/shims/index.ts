import { z } from 'zod'
import React from 'react'

// Zod custom types
const JSXShape = z.custom<JSX.Element>((value) => {
  return React.isValidElement(value)
})

// Component Shims
export const CSLinkShape = z
  .function()
  .args(
    z.object({
      to: z.string(),
      children: z.any().optional(),
    }),
  )
  .returns(JSXShape)
