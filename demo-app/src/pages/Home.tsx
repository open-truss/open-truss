import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

export default function Home(): JSX.Element {
  return (
    <Card className="m-6">
      <CardHeader>
        <CardTitle>Model Home</CardTitle>
        <CardDescription>an open-truss demo app</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside">
          <li>
            <Link to="/ot/playground" className="text-blue-500 hover:underline">
              Client Playground
            </Link>
          </li>
          <li>
            <Link
              to="/ot/config-builder"
              className="text-blue-500 hover:underline"
            >
              Config Builder
            </Link>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
