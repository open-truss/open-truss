import otType from './ot-type'

describe('otType', () => {
  describe('MySQL', () => {
    it('maps MySQL types to otTypes', () => {
      const mysqlTypes = {
        int: 'Number',
        tinyint: 'Number',
        smallint: 'Number',
        mediumint: 'Number',
        bigint: 'Number',
        decimal: 'Number',
        float: 'Number',
        double: 'Number',
        bit: 'Number',
        char: 'String',
        varchar: 'String',
        tinytext: 'String',
        text: 'String',
        mediumtext: 'String',
        longtext: 'String',
        enum: 'String',
        set: 'String',
        date: 'Date',
        time: 'Date',
        datetime: 'Date',
        timestamp: 'Date',
        year: 'Date',
        binary: 'ArrayBuffer',
        varbinary: 'ArrayBuffer',
        tinyblob: 'ArrayBuffer',
        blob: 'ArrayBuffer',
        mediumblob: 'ArrayBuffer',
        longblob: 'ArrayBuffer',
      }

      for (const [type, expected] of Object.entries(mysqlTypes)) {
        expect(otType('mysql', type)).toBe(expected)
      }
    })
  })

  describe('Trino', () => {
    it('maps Trino types to otTypes', () => {
      const trinoTypes = {
        integer: 'Number',
        smallint: 'Number',
        bigint: 'Number',
        real: 'Number',
        double: 'Number',
        varchar: 'String',
        char: 'String',
        date: 'Date',
        time: 'Date',
        timestamp: 'Date',
        varbinary: 'ArrayBuffer',
        'row(foo string, bar int)': 'JSON',
      }

      for (const [type, expected] of Object.entries(trinoTypes)) {
        expect(otType('trino', type)).toBe(expected)
      }
    })
  })

  describe('Kusto', () => {
    it('maps Kusto types to otTypes', () => {
      const kustoTypes = {
        int: 'Number',
        long: 'Number',
        real: 'Number',
        decimal: 'Number',
        string: 'String',
        guid: 'String',
        datetime: 'Date',
        dynamic: 'JSON',
      }

      for (const [type, expected] of Object.entries(kustoTypes)) {
        expect(otType('kusto', type)).toBe(expected)
      }
    })
  })

  describe('Cassandra', () => {
    it('maps Cassandra types to otTypes', () => {
      const cassandraTypes = {
        int: 'Number',
        smallint: 'Number',
        tinyint: 'Number',
        bigint: 'Number',
        decimal: 'Number',
        double: 'Number',
        float: 'Number',
        varint: 'Number',
        text: 'String',
        varchar: 'String',
        ascii: 'String',
        timestamp: 'Date',
        date: 'Date',
        time: 'Date',
        blob: 'ArrayBuffer',
        boolean: 'Boolean',
        uuid: 'String',
        timeuuid: 'String',
      }

      for (const [type, expected] of Object.entries(cassandraTypes)) {
        expect(otType('cassandra', type)).toBe(expected)
      }
    })
  })

  describe('FlinkSQL', () => {
    it('maps FlinkSQL types to otTypes', () => {
      const flinksqlTypes = {
        tinyint: 'Number',
        smallint: 'Number',
        integer: 'Number',
        bigint: 'Number',
        float: 'Number',
        double: 'Number',
        decimal: 'Number',
        char: 'String',
        varchar: 'String',
        date: 'Date',
        time: 'Date',
        timestamp: 'Date',
        boolean: 'Boolean',
      }

      for (const [type, expected] of Object.entries(flinksqlTypes)) {
        expect(otType('flinksql', type)).toBe(expected)
      }
    })
  })
})
