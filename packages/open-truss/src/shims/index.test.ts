import React from 'react'
import { CSLinkShape } from './index'

describe('CSLinkShape', () => {
  test('accepts a link component function without invoking it during validation', () => {
    const linkComponent = jest.fn(
      ({ to, children }: { to: string; children?: React.ReactNode }) =>
        React.createElement('a', { href: to }, children),
    )

    expect(CSLinkShape.safeParse(linkComponent).success).toBe(true)
    expect(linkComponent).not.toHaveBeenCalled()
  })

  test('rejects non-function values', () => {
    expect(CSLinkShape.safeParse('not-a-fn').success).toBe(false)
    expect(CSLinkShape.safeParse({}).success).toBe(false)
    expect(CSLinkShape.safeParse(null).success).toBe(false)
  })
})
