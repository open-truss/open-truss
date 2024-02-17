import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

export default function Home(): JSX.Element {
  return (
    <main>
      <Card className="m-6">
        <CardHeader>
          <CardTitle>Model Home</CardTitle>
          <CardDescription>an open-truss demo app</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            <li>
              <Link
                href="/ot/playground"
                className="text-blue-500 hover:underline"
              >
                Client Playground
              </Link>
            </li>
            <li>
              <Link
                href="/ot/config-builder"
                className="text-blue-500 hover:underline"
              >
                Config Builder
              </Link>
            </li>
            <li>
              <Link
                href="/ot/query-editor"
                className="text-blue-500 hover:underline"
              >
                Query Editor
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  )
}
