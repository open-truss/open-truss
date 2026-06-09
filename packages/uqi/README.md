# uqi, a unified query interface

_pronounced: yoo-kee_

## What is uqi?

It is a query client and client builder that can be used to wrap any data source client and present a unified query interface.

## Aspirational Examples

These examples are not yet implemented, but are the goal of this project. See the [example](./example) folder for an example implementation.

### Querying a CSV file

```typescript
import createClient from 'path/to/csv-client-uqi'
const client = await createClient({ path: 'path/to/folder' })
const queryIterator = await client.query('SELECT first_name FROM users.csv')

for await (const { row, metadata } of queryIterator) {
  console.log({ metadata })
  metadata.columns.forEach((column, i) => {
    console.log({ [column.name]: row[i] })
  })
}

await client.teardown()
```

### Querying a JSON file

```typescript
import createClient from 'path/to/json-client-uqi'
const client = await createClient({ path: 'path/to/users.json', queryLanguage: 'jq' })
const queryIterator = await client.query('.[] | select(.first_name | startswith("J")) | .first_name')

for await (const { row, metadata } of queryIterator) {
  console.log({ metadata })
  metadata.columns.forEach((column, i) => {
    console.log({ [column.name]: row[i] })
  })
}

await client.teardown()
```

### Querying a MySQL database

```typescript
import createClient from 'path/to/mysql-client-uqi'
const client = await createClient({
  hostname: process.env.MYSQL_HOSTNAME,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})
const queryIterator = await client.query('SELECT first_name FROM users')

for await (const { row, metadata } of queryIterator) {
  console.log({ metadata })
  metadata.columns.forEach((column, i) => {
    console.log({ [column.name]: row[i] })
  })
}

await client.teardown()
```

### Querying a Trino database

```typescript
import createClient from 'path/to/trino-client-uqi'
const client = await createClient({
  server: process.env.TRINO_URI,
  auth: new BasicAuth(process.env.TRINO_USER_IDENTIFIER, ),
  source: 'acme/production',
})
const queryIterator = await client.query('SELECT first_name FROM acme.production.users')

for await (const { row, metadata } of queryIterator) {
  console.log({ metadata })
  metadata.columns.forEach((column, i) => {
    console.log({ [column.name]: row[i] })
  })
}

await client.teardown()
```

### Querying a Kusto database

```typescript
import createClient from 'path/to/kusto-client-uqi'
const client = await createClient({
  hostname: process.env.KUSTO_HOSTNAME,
  username: process.env.KUSTO_USERNAME,
  password: process.env.KUSTO_PASSWORD,
})
const queryIterator = await client.query('acme.production.users | project first_name')

for await (const { row, metadata } of queryIterator) {
  console.log({ metadata })
  metadata.columns.forEach((column, i) => {
    console.log({ [column.name]: row[i] })
  })
}

await client.teardown()
```

### Querying a Rest API

```typescript
import createClient from 'path/to/rest-client-uqi'
const client = await createClient({
  url: 'http://localhost:3000',
})
const queryIterator = await client.query('GET /users')

for await (const { row, metadata } of queryIterator) {
  console.log({ metadata })
  metadata.columns.forEach((column, i) => {
    console.log({ [column.name]: row[i] })
  })
}

await client.teardown()
```
