import { z } from 'zod'
import {
  NavigateFrameSignal,
  NumberSignal,
  SIGNALS,
  SignalType,
  StringSignal,
  createSignal,
  getSignalAndValueShape,
  getSignalsType,
} from './index'

const noop = () => {}

const fakeSignal = <T>(value: T, yamlName = 'testSignal') => ({
  value,
  yamlName,
  name: 'test',
  toString: () => String(value),
})

describe('signals', () => {
  test('getSignalAndValueShape resolves signal schemas and ignores non-signals', () => {
    expect(getSignalAndValueShape(StringSignal)?.signal).toBe(StringSignal)
    expect(getSignalAndValueShape(NumberSignal)?.signal).toBe(NumberSignal)
    expect(getSignalsType(NavigateFrameSignal)).toBe(NavigateFrameSignal)

    expect(getSignalAndValueShape(z.string())).toBeUndefined()
    expect(
      getSignalAndValueShape(z.string().describe('not-a-signal')),
    ).toBeUndefined()
    expect(getSignalAndValueShape(null)).toBeUndefined()
    expect(getSignalAndValueShape('string')).toBeUndefined()
  })

  test('SignalType validates signal-like values and rejects invalid or non-signal inputs without throwing', () => {
    const CustomNumberSignal = SignalType<number>(
      'CustomTestNumber',
      z.number().default(0),
    )

    expect(CustomNumberSignal.safeParse(fakeSignal(42)).success).toBe(true)
    expect(CustomNumberSignal.safeParse(fakeSignal(null)).success).toBe(true)
    expect(CustomNumberSignal.safeParse(fakeSignal('wrong')).success).toBe(
      false,
    )
    expect(CustomNumberSignal.safeParse('not-a-signal').success).toBe(false)
    expect(CustomNumberSignal.safeParse(null).success).toBe(false)
  })

  test('NavigateFrameSignal accepts function signals and rejects non-function values', () => {
    expect(NavigateFrameSignal.safeParse(fakeSignal(noop)).success).toBe(true)
    expect(NavigateFrameSignal.safeParse(fakeSignal(null)).success).toBe(true)
    expect(
      NavigateFrameSignal.safeParse(fakeSignal('not-a-function')).success,
    ).toBe(false)
  })

  test('createSignal registers composite object signal shapes and validates values', () => {
    const compositeSignal = createSignal('testWorkflow', {
      count: 'number',
      tags: ['string'],
    })

    expect(getSignalsType(compositeSignal)).toBe(compositeSignal)
    expect(
      compositeSignal.safeParse(fakeSignal({ count: 3, tags: ['a', 'b'] }))
        .success,
    ).toBe(true)
    expect(
      compositeSignal.safeParse(fakeSignal({ count: 'bad', tags: ['a'] }))
        .success,
    ).toBe(false)
    expect(
      Object.keys(SIGNALS).some((k) => k.startsWith('testWorkflow-')),
    ).toBe(true)
  })
})
