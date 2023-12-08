import createClient from './fake-client-uqi'

interface Metadata {
  columns: Array<{ name: string, type: string }>
}

describe('fake-client-uqi', () => {
  it('should work', async () => {
    const client = await createClient({
      values: [12, 99, 51],
      sleep: 10,
    })

    let m: Metadata = { columns: [] }
    const queryIterator = await client.query('SELECT * FROM patients')

    const results = []
    for await (const { row, metadata } of queryIterator) {
      m = metadata
      results.push(row)
    }

    expect(results).toEqual([
      [['Sam 12', 12]],
      [['Sam 99', 99]],
      [['Sam 51', 51]],
    ])
    expect(m.columns).toEqual([
      { name: 'full_name', type: 'String' },
      { name: 'age', type: 'Number' },
    ])
  })
})
