import { type UqiStatus } from '../uqi'
import createClient from './fake-client-uqi'

interface Metadata {
  columns: Array<{
    name: string
    type: string
  }>
}

describe('fake-client-uqi', () => {
  it('should work', async () => {
    const client = await createClient({
      values: [12, 99, 51],
      sleep: 10,
    })

    let m: Metadata = { columns: [] }
    let status: UqiStatus = {
      completedAt: null,
      failedAt: null,
      failedReason: '',
      recordsReturned: 0,
      startedAt: null,
    }
    const queryIterator = await client.query('SELECT * FROM patients', {
      statusCallback: async (s) => {
        status = s
      },
    })
    expect(status.recordsReturned).toBe(0)
    expect(status.startedAt).not.toBe(null)
    expect(status.completedAt).toBe(null)
    expect(status.failedAt).toBe(null)
    expect(status.failedReason).toBe(null)

    const results = []
    for await (const { row, metadata } of queryIterator) {
      m = metadata
      results.push(row)
      expect(status.recordsReturned).toBe(results.length)
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
    expect(status.recordsReturned).toBe(3)
    expect(status.startedAt).not.toBe(null)
    expect(status.completedAt).not.toBe(null)
    expect(status.failedAt).toBe(null)
    expect(status.failedReason).toBe(null)
  })

  it('should capture and report error via statusCallback before re-throwing error', async () => {
    const client = await createClient({
      values: [12, 99, 51, 64],
      sleep: 10,
    })

    let status: UqiStatus = {
      completedAt: null,
      failedAt: null,
      failedReason: '',
      recordsReturned: 0,
      startedAt: null,
    }
    const queryIterator = await client.query('SELECT * FROM patients', {
      statusCallback: async (s) => {
        status = s
      },
    })
    expect(status.recordsReturned).toBe(0)
    expect(status.startedAt).not.toBe(null)
    expect(status.completedAt).toBe(null)
    expect(status.failedAt).toBe(null)
    expect(status.failedReason).toBe(null)

    const results = []
    await expect(async () => {
      for await (const { row } of queryIterator) {
        results.push(row)
      }
    }).rejects.toThrow('Value 64 is divisible by 8')

    expect(status.recordsReturned).toBe(3)
    expect(status.startedAt).not.toBe(null)
    expect(status.completedAt).toBe(null)
    expect(status.failedAt).not.toBe(null)
    expect(status.failedReason).toBe('Value 64 is divisible by 8')
  })
})
