import { z } from 'zod'
import { describeZod } from './describe-zod'
import { SignalType } from '../signals'

test('describeZod', () => {
  const props = z.object({
    stringProp: z.string().default('hello world'),
    numberProp: z.number().default(42),
    objectProp: z
      .object({
        stringProp: z.string(),
        numberProp: z.number(),
      })
      .default({ stringProp: 'hello world', numberProp: 42 }),
    arrayProp: z.array(z.string()).default(['a', 'b', 'c']),
    enumProp: z.enum(['enum1', 'enum2']).default('enum1'),
    unionProp: z.union([z.number(), z.string()]).default(123),
    numberSignalProp: SignalType<number>(
      'NumberSignal',
      z.number().default(123),
    ),
    stringArraySignalProp: SignalType<string[]>(
      'StringArraySignal',
      z.array(z.string()).default(['a', 'b']),
    ),
  })
  expect(describeZod(props.shape)).toEqual({
    stringProp: {
      type: 'ZodString',
      defaultValue: 'hello world',
    },
    numberProp: { type: 'ZodNumber', defaultValue: 42 },
    objectProp: {
      type: 'ZodObject',
      shape: {
        stringProp: { type: 'ZodString' },
        numberProp: { type: 'ZodNumber' },
      },
      defaultValue: { stringProp: 'hello world', numberProp: 42 },
    },
    arrayProp: {
      type: 'ZodArray',
      shape: {
        type: 'ZodString',
      },
      defaultValue: ['a', 'b', 'c'],
    },
    enumProp: {
      type: 'ZodEnum',
      shape: ['enum1', 'enum2'],
      defaultValue: 'enum1',
    },
    unionProp: {
      type: 'ZodUnion',
      shape: [{ type: 'ZodNumber' }, { type: 'ZodString' }],
      defaultValue: 123,
    },
    numberSignalProp: {
      type: 'ZodNumber',
      isSignal: true,
      defaultValue: 123,
    },
    stringArraySignalProp: {
      type: 'ZodArray',
      isSignal: true,
      shape: {
        type: 'ZodString',
      },
      defaultValue: ['a', 'b'],
    },
  })
})
