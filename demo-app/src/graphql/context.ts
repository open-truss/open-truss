export interface Context {
  // database clients, etc.
}

async function context(): Promise<Context> {
  // Return anything needed in the global context like instantiated
  // database clients, etc.
  return {}
}

export default context
