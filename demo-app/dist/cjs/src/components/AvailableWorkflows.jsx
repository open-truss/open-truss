var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        return (<div>
      <h1>Available Workflows:</h1>
      <ul>
        {workflowIds.map((workflowId) => (<li key={workflowId}>
            <Link href={`workflows/${workflowId}`}>{workflowId}</Link>
          </li>))}
      </ul>
    </div>);
    });
}
export default AvailableWorkflows;
