type TypeMappingInterface = Record<string, Record<string, string>>

export default function otType(engine: string, type: string): string {
  // Check if the type is 'row' and remove nested types inside parentheses
  if (type.startsWith('row(')) {
    type = 'row'
  }

  // Remove length parameter if present, example: varchar(255)
  type = type.toLowerCase().replace(/\(\d+\)$/, '')

  const typeMapping: TypeMappingInterface = {
    mysql: {
      bigint: 'BigInt',
      binary: 'ArrayBuffer',
      bit: 'Number',
      blob: 'ArrayBuffer',
      boolean: 'Boolean',
      char: 'String',
      date: 'Date',
      datetime: 'Date',
      decimal: 'Number',
      double: 'Number',
      enum: 'String',
      float: 'Number',
      int: 'Number',
      json: 'JSON',
      longblob: 'ArrayBuffer',
      longtext: 'String',
      mediumblob: 'ArrayBuffer',
      mediumint: 'Number',
      mediumtext: 'String',
      set: 'String',
      smallint: 'Number',
      text: 'String',
      time: 'Date',
      timestamp: 'Date',
      tinyblob: 'ArrayBuffer',
      tinyint: 'Number',
      tinytext: 'String',
      varbinary: 'ArrayBuffer',
      varchar: 'String',
      year: 'Date',
    },
    trino: {
      bigint: 'BigInt',
      binary: 'ArrayBuffer',
      boolean: 'Boolean',
      char: 'String',
      date: 'Date',
      double: 'Number',
      integer: 'Number',
      json: 'JSON',
      real: 'Number',
      row: 'JSON',
      smallint: 'Number',
      time: 'Date',
      timestamp: 'Date',
      tinyint: 'Number',
      varbinary: 'ArrayBuffer',
      varchar: 'String',
    },
    kusto: {
      boolean: 'Boolean',
      datetime: 'Date',
      decimal: 'Number',
      dynamic: 'JSON',
      guid: 'String',
      int: 'Number',
      long: 'BigInt',
      real: 'Number',
      string: 'String',
      timespan: 'Date',
    },
    cassandra: {
      ascii: 'String',
      bigint: 'BigInt',
      blob: 'ArrayBuffer',
      boolean: 'Boolean',
      date: 'Date',
      decimal: 'Number',
      double: 'Number',
      float: 'Number',
      inet: 'String',
      int: 'Number',
      json: 'JSON',
      list: 'JSON',
      map: 'JSON',
      set: 'JSON',
      smallint: 'Number',
      text: 'String',
      time: 'Date',
      timestamp: 'Date',
      timeuuid: 'String',
      tinyint: 'Number',
      uuid: 'String',
      varchar: 'String',
      varint: 'Number',
    },
    flinksql: {
      array: 'JSON',
      bigint: 'BigInt',
      binary: 'ArrayBuffer',
      boolean: 'Boolean',
      char: 'String',
      date: 'Date',
      decimal: 'Number',
      double: 'Number',
      float: 'Number',
      integer: 'Number',
      interval: 'Number',
      map: 'JSON',
      multiset: 'JSON',
      raw: 'ArrayBuffer',
      row: 'JSON',
      smallint: 'Number',
      time: 'Date',
      timestamp_ltz: 'Date',
      timestamp: 'Date',
      tinyint: 'Number',
      varbinary: 'ArrayBuffer',
      varchar: 'String',
    },
  }

  const engineMapping = typeMapping[engine.toLowerCase()]

  if (!engineMapping) {
    throw new Error(`Unsupported engine: ${engine}`)
  }

  const jsType = engineMapping[type]

  if (!jsType) {
    throw new Error(`Unsupported type: ${type} for engine: ${engine}`)
  }

  return jsType
}
