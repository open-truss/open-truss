import { z } from 'zod'
import React from 'react'

// Zod custom types
export const JSXShape = z.custom<JSX.Element>((value) =>
  React.isValidElement(value),
)

// Component Shims
// Zod 4: z.function() API changed; create a custom function schema manually.
export const CSLinkShape = z.custom<
  (args: { to: string; children?: any }) => JSX.Element
>((val) => {
  if (typeof val !== 'function') return false
  // Light runtime check by invoking with dummy data (avoid side effects):
  try {
    const result = (val as any)({ to: '', children: undefined })
    return React.isValidElement(result)
  } catch {
    return false
  }
})
