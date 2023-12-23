import Link from 'next/link'

export default function Home(): JSX.Element {
  return (
    <main>
      <h1>Model Home</h1>
      <ul>
        <li><Link href="/ot/rsc-playground">RSC Playground</Link></li>
        <li><Link href="/ot/playground">Client Playground</Link></li>
      </ul>
    </main>
  )
}
