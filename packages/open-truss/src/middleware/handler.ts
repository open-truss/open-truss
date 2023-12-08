import next from 'next'
import type { IncomingMessage, ServerResponse } from 'http'

export async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  console.log("in handler")
  const nextjsConf = {
    dir: '/Users/hktouw/Repos/open-truss/open-truss/packages/open-truss/dist/mjs/middleware/open-truss-middleware',
    dev: process.env.NODE_ENV !== 'production',
    hostname: "localhost",
    port: 3000,
  }
  const app = next(nextjsConf)
  await app.prepare()
  // const handle = app.getRequestHandler()
  // console.log(req)
  // await handle(req, res)
  await app.render(req, res, '/ot')
}
