import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Foo(props) {
    return (_jsxs("div", { children: [_jsx("h1", { children: JSON.stringify(props.data) }), props.children] }));
}
