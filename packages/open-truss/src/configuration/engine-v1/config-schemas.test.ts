import { SignalsV1Shape } from './config-schemas'
import { Props as GraphqlProps } from '../../components/OTGraphqlDataProvider'
import { Props as RestProps } from '../../components/OTRestDataProvider'

const fakeSignal = <T>(value: T, yamlName = 'sig') => ({
  value,
  yamlName,
  name: 'test',
  toString: () => String(value),
})

describe('engine-v1 config and data provider schemas', () => {
  test('SignalsV1Shape accepts string record or undefined and rejects non-string values', () => {
    expect(SignalsV1Shape.safeParse(undefined).success).toBe(true)
    expect(
      SignalsV1Shape.safeParse({ userId: 'string', count: 'number' }).success,
    ).toBe(true)
    expect(SignalsV1Shape.safeParse({ userId: 123 }).success).toBe(false)
  })

  test('OTGraphqlDataProvider Props validates headers and variables records', () => {
    const valid = GraphqlProps.safeParse({
      source: 'github',
      headers: { Authorization: fakeSignal('Bearer token') },
      body: { template: 'query { viewer { login } }' },
      variables: { login: fakeSignal('octocat') },
      forceQuery: fakeSignal(1),
    })
    expect(valid.success).toBe(true)

    const invalidHeaders = GraphqlProps.safeParse({
      source: 'github',
      headers: { Authorization: 123 },
      body: { template: 'query { viewer { login } }' },
      forceQuery: fakeSignal(1),
    })
    expect(invalidHeaders.success).toBe(false)
  })

  test('OTRestDataProvider Props validates headers and optional StringOrTemplate body', () => {
    const validWithoutBody = RestProps.safeParse({
      source: 'api',
      path: { template: '/users/${id}', id: '1' },
      method: fakeSignal('GET'),
      headers: { Accept: fakeSignal('application/json') },
      forceQuery: fakeSignal(0),
    })
    expect(validWithoutBody.success).toBe(true)

    const validWithTemplateBody = RestProps.safeParse({
      source: 'api',
      path: fakeSignal('/users'),
      method: fakeSignal('POST'),
      body: { template: '{"name":"${name}"}', name: 'ada' },
      forceQuery: fakeSignal(0),
    })
    expect(validWithTemplateBody.success).toBe(true)

    const invalidBody = RestProps.safeParse({
      source: 'api',
      path: fakeSignal('/users'),
      method: fakeSignal('POST'),
      body: 123,
      forceQuery: fakeSignal(0),
    })
    expect(invalidBody.success).toBe(false)
  })
})
