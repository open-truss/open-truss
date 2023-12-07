export type IteratorResultUqi<T> = Promise<{ value: T, done?: boolean | undefined }>

class Iterator<T> {
  public iter: AsyncIterableIterator<T>

  constructor(iter: AsyncIterableIterator<T>) {
    this.iter = iter
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    return this
  }

  async next(): IteratorResultUqi<T> {
    return this.iter.next()
  }

  map<U>(fn: (value: T) => U): Iterator<U> {
    const that = this.iter
    const asyncIterableIterator: AsyncIterableIterator<U> = {
      [Symbol.asyncIterator]() {
        return this
      },
      async next(): IteratorResultUqi<U> {
        return that.next().then((result) => {
          return {
            value: fn(result.value),
            done: result.done
          }
        })
      }
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
    await this.forEach(value => { acc = fn(value, acc) })
    return acc
  }
}

export default Iterator
