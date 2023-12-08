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
                if (pathname === '/a') {
                    yield app.render(req, res, '/a', query);
                }
                else {
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
