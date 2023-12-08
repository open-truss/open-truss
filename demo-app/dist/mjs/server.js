var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createServer } from 'http';
// The nextjs docs seem to use this deprecated api
// eslint-disable-next-line n/no-deprecated-api
import { parse } from 'url';
import next from 'next';
import { handler } from '@open-truss/open-truss';
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    const server = createServer((req, res) => {
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                const parsedUrl = parse(req.url || '', true);
                const { pathname, query } = parsedUrl;
                console.log("hello world");
                console.log(pathname);
                if (pathname === '/ot') {
                    console.log("in ot right");
                    yield handler(req, res);
                }
                else {
                    console.log("in else");
                    yield handle(req, res, parsedUrl);
                }
            });
        })().catch((e) => {
            console.log(e);
        });
    });
    server.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
}).catch((e) => {
    console.log(e);
});
