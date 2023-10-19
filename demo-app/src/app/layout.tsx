import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Model Home',
  description: 'Open Truss demo application.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
