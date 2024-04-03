import { parseYaml, stringifyYaml } from './yaml'

test('stringifyYaml', () => {
  expect(stringifyYaml(5)).toBe('5\n')
  expect(stringifyYaml('hello')).toBe('hello\n')
  expect(stringifyYaml(true)).toBe('true\n')
  expect(stringifyYaml(null)).toBe('null\n')
  expect(stringifyYaml({ foo: 'bar' })).toBe('foo: bar\n')
  expect(stringifyYaml([{ foo: 'bar' }])).toBe('- foo: bar\n')
  expect(stringifyYaml([{ foo: { baz: 4 } }])).toBe('- foo:\n    baz: 4\n')
  expect(stringifyYaml([{ foo: [4, 2, 1] }])).toBe(
    '- foo:\n    - 4\n    - 2\n    - 1\n',
  )
  expect(stringifyYaml([{ foo: [{ baz: 4 }] }])).toBe('- foo:\n    - baz: 4\n')
})

test('parseYaml', () => {
  expect(parseYaml('5')).toBe(5)
  expect(parseYaml('hello')).toBe('hello')
  expect(parseYaml('true')).toBe(true)
  expect(parseYaml('null')).toBe(null)
  expect(parseYaml('foo: bar')).toEqual({ foo: 'bar' })
  expect(parseYaml('- foo: bar')).toEqual([{ foo: 'bar' }])
  expect(parseYaml('- foo:\n    baz: 4')).toEqual([{ foo: { baz: 4 } }])
  expect(parseYaml('- foo:\n    - 4\n    - 2\n    - 1')).toEqual([
    { foo: [4, 2, 1] },
  ])
  expect(parseYaml('- foo:\n    - baz: 4')).toEqual([{ foo: [{ baz: 4 }] }])
  expect(parseYaml<{ foo: string; bar: number }>('foo: bar')).toEqual({
    foo: 'bar',
    bar: 0,
  })
})
