var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { promises as fs } from 'fs';
import Link from 'next/link';
// TODO this should be cached since what's on disk can't change
function availableWorkflowsFromDisk() {
    return __awaiter(this, void 0, void 0, function* () {
        return fs.readdir('./src/workflows/');
    });
}
function AvailableWorkflows() {
    return __awaiter(this, void 0, void 0, function* () {
        const workflows = yield availableWorkflowsFromDisk();
        const workflowIds = workflows.map((fileName) => fileName.replace('.yaml', ''));
        return (_jsxs("div", { children: [_jsx("h1", { children: "Available Workflows:" }), _jsx("ul", { children: workflowIds.map((workflowId) => (_jsx("li", { children: _jsx(Link, { href: `workflows/${workflowId}`, children: workflowId }) }, workflowId))) })] }));
    });
}
export default AvailableWorkflows;
