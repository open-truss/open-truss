type TypeMappingInterface = Record<string, Record<string, string>>

export default function mapToJsType(engine: string, type: string): string {
  // Remove length parameter if present, example: varchar(255)
  type = type.toLowerCase().replace(/\(\d+\)$/, '')

  const typeMapping: TypeMappingInterface = {
    mysql: {
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
      longblob: 'ArrayBuffer'
    },
    trino: {
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
      varbinary: 'ArrayBuffer'
    },
    kusto: {
      int: 'Number',
      long: 'Number',
      real: 'Number',
      decimal: 'Number',
      string: 'String',
      guid: 'String',
      datetime: 'Date',
      dynamic: 'Object'
    },
    cassandra: {
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
      timeuuid: 'String'
    },
    flinksql: {
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
      boolean: 'Boolean'
    }
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
