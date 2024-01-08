import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Model Home',
  description: 'Open Truss demo application.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
// import { Html, Head, Main, NextScript } from 'next/document'
//
// export default function Document() {
//   return (
//     <Html lang="en">
//       <Head />
//       <body>
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   )
// }
