export const metadata = {
    title: 'Model Home',
    description: 'Open Truss demo application.',
};
export default function RootLayout({ children }) {
    return (<html lang="en">
      <body>{children}</body>
    </html>);
}
