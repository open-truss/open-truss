import { jsx as _jsx } from "react/jsx-runtime";
export const metadata = {
    title: 'Model Home',
    description: 'Open Truss demo application.',
};
export default function RootLayout({ children }) {
    return (_jsx("html", { lang: "en", children: _jsx("body", { children: children }) }));
}
