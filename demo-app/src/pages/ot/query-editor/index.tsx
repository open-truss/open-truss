import { Button } from '@/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Editor from '@monaco-editor/react'
import { useState } from 'react'

export default function QueryEditor(): JSX.Element {
  const [query, setQuery] = useState('SELECT id, login FROM users')

  const handleRun = (): void => {
    alert(query)
  }

  const queryChangeHandler = (value: string): void => {
    setQuery(value)
  }

  console.log({ query })
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={50} className="bg-gray-100 min-h-48">
            <div className="p-2 h-full">
              <Editor
                height="90vh"
                defaultLanguage="sql"
                defaultValue={query}
                onChange={(value: string | undefined) => {
                  queryChangeHandler(value || '')
                }}
              />
            </div>
          </ResizablePanel>
          <div className="flex justify-end">
            <Button
              className="mt-2 bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              onClick={handleRun}
            >
              Run
            </Button>
          </div>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">id</TableHead>
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
      </ResizablePanel >
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25}>
        <Tabs defaultValue="recent" className="m-2">
          <TabsList>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="schemas">Catalog</TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <div className="mb-2 p-2 bg-gray-100 rounded-sm text-sm">
              SELECT id, login FROM users
            </div>
            <div className="mb-2 p-2 bg-gray-100 rounded-sm text-sm">
              DESCRIBE spamurai.spamurai.user_destroys
            </div>
          </TabsContent>
          <TabsContent value="schemas">
            <div className="mb-2 p-2 bg-gray-100 rounded-sm">
              <h3 className="font-medium">abuse_classifications</h3>
              <ul className="text-sm">
                <li>id: bigint</li>
                <li>previous_classification: string</li>
                <li>current_classification: string</li>
              </ul>
            </div>
            <div className="mb-2 p-2 bg-gray-100 rounded-sm">
              <h3 className="font-medium">users</h3>
              <ul className="text-sm">
                <li>id: bigint</li>
                <li>login: string</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
