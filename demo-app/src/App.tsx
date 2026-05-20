import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Playground from './pages/Playground'
import ConfigView from './pages/ConfigView'
import ConfigBuilder from './pages/ot/config-builder'

export default function App(): JSX.Element {
  return (
    <div className="flex flex-col h-screen">
      <header className="border-b px-4 py-2 flex gap-4">
        <Link to="/" className="font-bold text-blue-600 hover:underline">
          Model Home
        </Link>
        <Link to="/ot/playground" className="text-blue-600 hover:underline">
          Playground
        </Link>
        <Link to="/ot/config-builder" className="text-blue-600 hover:underline">
          Config Builder
        </Link>
      </header>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ot/playground" element={<Playground />} />
          <Route path="/ot/playground/:slug" element={<ConfigView />} />
          <Route path="/ot/config-builder" element={<ConfigBuilder />} />
        </Routes>
      </main>
    </div>
  )
}
