/* eslint-disable no-template-curly-in-string */
import {
  StringOrTemplate,
  resolveStringOrTemplate,
  resolveTemplate,
} from './template'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const signal = (value: any) => ({ value, toString: () => String(value) })

test('resolveTemplate', () => {
  const actual = resolveTemplate({
    template: '/search/issues?q=repo:${repo_nwo}+is:${issue_or_pr}',
    repo_nwo: signal('open-truss/open-truss'),
    issue_or_pr: 'issue',
  })
  const expected = '/search/issues?q=repo:open-truss/open-truss+is:issue'
  expect(expected).toBe(actual)
})

test('resolveStringOrTemplate', () => {
  const actual = resolveStringOrTemplate({
    template: '/search/issues?q=repo:${repo_nwo}+is:${issue_or_pr}',
    repo_nwo: signal('open-truss/open-truss'),
    issue_or_pr: 'issue',
  })
  const expected = '/search/issues?q=repo:open-truss/open-truss+is:issue'
  expect(expected).toBe(actual)

  expect(resolveStringOrTemplate(StringOrTemplate.parse(signal('hello')))).toBe(
    'hello',
  )
})
