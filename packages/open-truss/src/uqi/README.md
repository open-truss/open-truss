# uqi, a unified query interface

_pronounced: yoo-kee_

## What is uqi?

It is a query interface with pluggable adapters that makes it simple to query different data sources from a single interface.

## Implemented

### Type transformations

OpenTruss will support a number of query engine backends and data sources. Each of these will have their own type system. OpenTruss will provide a way to transform these types to javascript types so that workflows can be built on top of the simpler javascript types.

```typescript
otType('mysql', 'int')
// => 'Number'

otType('cassandra', 'text')
// => 'String'

otType('flink', 'boolean')
// => 'Boolean'

otType('kusto', 'datetime')
// => 'Date'

otType('trino', 'row(foo int, bar varchar)')
// => 'JSON'
```

## Not Implemented

### Querying a CSV file

```typescript
import { uqi } from '@open-truss/uqi'
const source = uqi.csv({ path: 'path/to/folder' })
for await (const { row, metadata } of source.query('SELECT first_name FROM users.csv')) {
  console.log({ metadata })
  console.log({ first_name: row.first_name })
}
```

### Querying a JSON file

```typescript
import { uqi } from '@open-truss/uqi'
const source = uqi.json({ path: 'path/to/users.json', queryLanguage: 'jq' })
for await (const { row, metadata } of source.query('.[] | select(.first_name | startswith("J")) | .first_name')) {
  console.log({ metadata })
  console.log({ first_name: row.first_name })
}
```

### Querying a MySQL database

```typescript
import { uqi } from '@open-truss/uqi'
const source = uqi.mysql({
  hostname: process.env.MYSQL_HOSTNAME,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})
for await (const { row, metadata } of source.query('SELECT first_name FROM users')) {
  console.log({ metadata })
  console.log({ first_name: row.first_name })
}
```

### Querying a Trino database

```typescript
import { uqi } from '@open-truss/uqi'
const source = uqi.trino({
  hostname: process.env.TRINO_HOSTNAME,
  username: process.env.TRINO_USERNAME,
  password: process.env.TRINO_PASSWORD,
})
for await (const { row, metadata } of source.query('SELECT first_name FROM foo.bar.users')) {
  console.log({ metadata })
  console.log({ first_name: row.first_name })
}
```

### Querying a Kusto database

```typescript
import { uqi } from '@open-truss/uqi'
const source = uqi.kusto({
  hostname: process.env.KUSTO_HOSTNAME,
  username: process.env.KUSTO_USERNAME,
  password: process.env.KUSTO_PASSWORD,
})
for await (const { row, metadata } of source.query('foo.bar.users | project first_name')) {
  console.log({ metadata })
  console.log({ first_name: row.first_name })
}
```

### Querying a Rest API

```typescript
import { uqi } from '@open-truss/uqi'
const source = uqi.rest({
  url: 'http://localhost:3000',
})
for await (const { row, metadata } of source.query('GET /users')) {
  console.log({ metadata })
  console.log({ first_name: row.first_name })
}
```
