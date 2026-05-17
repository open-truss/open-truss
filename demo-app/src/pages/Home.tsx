import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'

export default function Home() {
  return (
    <Card className="m-6">
      <CardHeader>
        <CardTitle>Model Home</CardTitle>
        <CardDescription>an open-truss demo app</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside">
          <li>
            <a href="#/playground" className="text-blue-500 hover:underline">
              Client Playground
            </a>
          </li>
          <li>
            <a href="#/config-builder" className="text-blue-500 hover:underline">
              Config Builder
            </a>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
