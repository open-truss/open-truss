import createFakeClient, { type FakeClientConfig } from './fake-client'

describe('createFakeClient', () => {
  it('should create a fake client with the provided config', async () => {
    const config: FakeClientConfig = {
      values: [18, 42, 33],
      sleep: 10,
    }
    const client = await createFakeClient(config)

    const results = []
    const queryIterator = await client.query('SELECT * FROM patients')
    const queryId = queryIterator.id
    let qr
    for await (const queryResult of queryIterator) {
      if (queryResult.data !== undefined) {
        qr = queryResult
        for (const row of queryResult.data) {
          results.push(row)
        }
      }
    }

    expect(results.length).toBe(config.values.length)
    for (let i = 0; i < results.length; i++) {
      expect(results[i]).toEqual([`Sam ${config.values[i]}`, config.values[i]])
    }
    expect(qr?.metadata?.columns).toEqual([
      { name: 'full_name', type: 'varchar' },
      { name: 'age', type: 'int' },
    ])

    const queryInfo = await client.queryInfo(queryId)
    expect(queryInfo.stats.rowsReturned).toBe(config.values.length)
    expect(queryInfo.stats.totalRows).toBe(config.values.length)
    expect(queryInfo.closed).toBe(false)
  })

  it('should handle empty config values', async () => {
    const config: FakeClientConfig = {
      values: [],
      sleep: 1000,
    }
    const client = await createFakeClient(config)

    const results = []
    const queryIterator = await client.query('SELECT * FROM things')
    const queryId = queryIterator.id
    for await (const queryResult of queryIterator) {
      if (queryResult.data !== undefined) {
        for (const row of queryResult.data) {
          results.push(row)
        }
      }
    }

    expect(results.length).toBe(0)

    const queryInfo = await client.queryInfo(queryId)
    expect(queryInfo.stats.rowsReturned).toBe(0)
    expect(queryInfo.stats.totalRows).toBe(0)
    expect(queryInfo.closed).toBe(false)
  })

  it('throws an error when a value is divisible by 8', async () => {
    const config: FakeClientConfig = {
      values: [18, 42, 33, 64],
      sleep: 10,
    }
    const client = await createFakeClient(config)

    const queryIterator = await client.query('SELECT * FROM patients')
    const results = []

    await expect(async () => {
      for await (const queryResult of queryIterator) {
        if (queryResult.data !== undefined) {
          for (const row of queryResult.data) {
            results.push(row)
          }
        }
      }
    }).rejects.toThrow('Value 64 is divisible by 8')
  })

  it('should close the client', async () => {
    const config = {
      values: [],
      sleep: 1000,
    }
    const client = await createFakeClient(config)

    expect(await client.isOpen()).toBe(true)
    await client.close()
    expect(await client.isOpen()).toBe(false)
  })
})
