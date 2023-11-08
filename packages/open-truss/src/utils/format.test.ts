import { formatQuery } from './format'

describe('format', () => {
  it('injects named number values', () => {
    const actual = formatQuery(
      'SELECT * FROM users WHERE id = :id',
      { params: { id: 12345 } },
    )
    const expected = `
SELECT
    *
FROM
    users
WHERE
    id = 12345
`.trim()
    expect(actual).toBe(expected)
  })

  it('injects named string values', () => {
    const actual = formatQuery(
      'SELECT * FROM users WHERE login = :login',
      { params: { login: 'foobar' } },
    )
    const expected = `
SELECT
    *
FROM
    users
WHERE
    login = 'foobar'
`.trim()
    expect(actual).toBe(expected)
  })

  it('injects named array number values', () => {
    const actual = formatQuery(
      'SELECT * FROM users WHERE id IN (:ids)',
      { params: { ids: [12345, 23456, 67890] } },
    )
    const expected = `
SELECT
    *
FROM
    users
WHERE
    id IN (12345,23456,67890)
`.trim()
    expect(actual).toBe(expected)
  })

  it('injects named array string values', () => {
    const actual = formatQuery(
      'SELECT * FROM users WHERE login IN (:logins)', 
      { params: { logins: ['foo', 'bar', 'baz'] } },
    )
    const expected = `
SELECT
    *
FROM
    users
WHERE
    login IN ('foo','bar','baz')
`.trim()
    expect(actual).toBe(expected)
  })
})
