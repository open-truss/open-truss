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
import * as yaml from 'yaml';
import Workflow from './Workflow';
// TODO this should be cached since what's on disk can't change
function loadWorkflowFromDisk(workflowId) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileContents = yield fs.readFile(`./src/workflows/${workflowId}.yaml`, 'utf-8');
        return yaml.parse(fileContents);
    });
}
function WorkflowPage({ params }) {
    return __awaiter(this, void 0, void 0, function* () {
        const workflow = yield loadWorkflowFromDisk(params.id);
        return <Workflow workflow={workflow}/>;
    });
}
export default WorkflowPage;
