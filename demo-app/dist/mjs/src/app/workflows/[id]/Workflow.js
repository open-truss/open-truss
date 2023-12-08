import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import displayComponents from '@/display-components';
function Workflow({ workflow }) {
    // If there are any nested workflows, render them recursively.
    // We use `!workflow.component` because we have a contract that workflows either
    // have `workflows` or `component` defined. This trick tells Typescript that
    // `workflow.component` is defined, which we use to our advantage below.
    if (!workflow.component) {
        const workflows = workflow.workflows || [];
        return (_jsx(_Fragment, { children: workflows.map((workflow, i) => _jsx(Workflow, { workflow: workflow }, i)) }));
    }
    const { component: componentConfiguration } = workflow;
    const { component, props: propsConfiguration } = componentConfiguration;
    const props = propsConfiguration || {};
    // Render this workflow's component
    const Component = displayComponents[component] || component;
    return _jsx(Component, Object.assign({}, props));
}
export default Workflow;
