import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

export default function QueryEditor(): JSX.Element {
  const [query, setQuery] = useState('SELECT id, login FROM users')

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setQuery(event.target.value)
  }
  const handleRun = (): void => {
    alert(query)
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel className="bg-gray-100">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel className="bg-gray-100">
            <Textarea value={query} onChange={handleQueryChange} />
            <Button onClick={handleRun}>Run</Button>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel className="bg-gray-100">
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>id</TableHead>
                  <TableHead>login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>hktouw</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>jonmagic</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3</TableCell>
                  <TableCell>kmcq</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="bg-gray-100">
        <Tabs defaultValue="recent" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="recent">Recent queries</TabsTrigger>
            <TabsTrigger value="schemas">Schemas</TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardDescription>3 results</CardDescription>
              </CardHeader>
              <CardContent>SELECT id, login FROM users</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>1 result</CardDescription>
              </CardHeader>
              <CardContent>
                DESCRIBE spamurai.spamurai.user_destroys
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="schemas">
            <Card>
              <CardHeader>
                <CardTitle>users</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  <li>id: bigint</li>
                  <li>login: string</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
