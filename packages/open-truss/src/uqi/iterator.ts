// Idea taken from https://github.com/regadas/trino-js-client/blob/48cc8aa78b80b1196133ed39878315400f8035cf/src/index.ts#L299-L350

export type IteratorResult<T> = Promise<{
  value: T
  done?: boolean | undefined
}>

class Iterator<T> implements AsyncIterableIterator<T> {
  private readonly iter: AsyncIterableIterator<T>

  constructor(iter: AsyncIterableIterator<T>) {
    this.iter = iter
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    return this
  }

  async next(): IteratorResult<T> {
    return this.iter.next()
  }

  map<U>(fn: (value: T) => U): Iterator<U> {
    const that = this.iter
    const asyncIterableIterator: AsyncIterableIterator<U> = {
      [Symbol.asyncIterator]() {
        return this
      },
      async next(): IteratorResult<U> {
        return that.next().then((result) => {
          return {
            value: fn(result.value),
            done: result.done,
          }
        })
      },
    }
    return new Iterator<U>(asyncIterableIterator)
  }

  async forEach(fn: (value: T) => void): Promise<void> {
    let e: { error: any } | undefined
    try {
      for await (const value of this) {
        try {
          fn(value)
        } catch (error) {
          e = { error }
          throw error
        }
      }
    } finally {
      // noop
    }
    if (e) throw e.error
  }

  async fold<U>(acc: U, fn: (value: T, acc: U) => U): Promise<U> {
    await this.forEach((value) => {
      acc = fn(value, acc)
    })
    return acc
  }
}

export default Iterator
