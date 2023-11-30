import mapToJsType from './map-to-js-type'

describe('mapToJsType', () => {
  it('maps MySQL types to JavaScript types', () => {
    expect(mapToJsType('mysql', 'int')).toBe('Number')
    expect(mapToJsType('mysql', 'varchar')).toBe('String')
    expect(mapToJsType('mysql', 'date')).toBe('Date')
    expect(mapToJsType('mysql', 'binary')).toBe('ArrayBuffer')
  })

  it('maps Trino types to JavaScript types', () => {
    expect(mapToJsType('trino', 'integer')).toBe('Number')
    expect(mapToJsType('trino', 'varchar')).toBe('String')
    expect(mapToJsType('trino', 'date')).toBe('Date')
    expect(mapToJsType('trino', 'varbinary')).toBe('ArrayBuffer')
  })

  it('maps Kusto types to JavaScript types', () => {
    expect(mapToJsType('kusto', 'int')).toBe('Number')
    expect(mapToJsType('kusto', 'string')).toBe('String')
    expect(mapToJsType('kusto', 'datetime')).toBe('Date')
    expect(mapToJsType('kusto', 'dynamic')).toBe('Object')
  })

  it('maps Cassandra types to JavaScript types', () => {
    expect(mapToJsType('cassandra', 'int')).toBe('Number')
    expect(mapToJsType('cassandra', 'text')).toBe('String')
    expect(mapToJsType('cassandra', 'timestamp')).toBe('Date')
    expect(mapToJsType('cassandra', 'blob')).toBe('ArrayBuffer')
  })

  it('maps FlinkSQL types to JavaScript types', () => {
    expect(mapToJsType('flinksql', 'tinyint')).toBe('Number')
    expect(mapToJsType('flinksql', 'varchar')).toBe('String')
    expect(mapToJsType('flinksql', 'date')).toBe('Date')
    expect(mapToJsType('flinksql', 'boolean')).toBe('Boolean')
  })

  it('throws an error for unsupported engines', () => {
    expect(() => mapToJsType('invalid-engine', 'int')).toThrowError('Unsupported engine: invalid-engine')
  })

  it('throws an error for unsupported types', () => {
    expect(() => mapToJsType('mysql', 'invalid-type')).toThrowError('Unsupported type: invalid-type for engine: mysql')
  })
})
