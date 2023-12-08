import { createServer } from 'http'
// The nextjs docs seem to use this deprecated api
// eslint-disable-next-line n/no-deprecated-api
import { parse } from 'url'
import next from 'next'
import { handler } from '@open-truss/open-truss'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    (async function() {
      const parsedUrl = parse(req.url || '', true)
      const { pathname, query } = parsedUrl

      console.log("hello world")
      console.log(pathname)
      if (pathname === '/ot') {
        console.log("in ot right")
        await handler(req, res)
      } else {
        console.log("in else")
        await handle(req, res, parsedUrl)
      }
    })().catch((e) => {
      console.log(e)
    })
  })
  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
}).catch((e) => {
  console.log(e)
})
