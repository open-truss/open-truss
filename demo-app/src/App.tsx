import { useState, useEffect, type ReactNode } from 'react'
import Home from './pages/Home'
import Playground from './pages/Playground'
import ViewConfig from './pages/ViewConfig'
import ConfigBuilder from './pages/ConfigBuilder'

interface Route {
  page: string
  slug?: string
}

function parseRoute(): Route {
  const hash = window.location.hash.slice(1) || '/'
  const parts = hash.split('/').filter(Boolean)
  if (parts[0] === 'playground' && parts[1]) {
    return { page: 'playground-view', slug: parts[1] }
  }
  if (parts[0] === 'playground') {
    return { page: 'playground' }
  }
  if (parts[0] === 'config-builder') {
    return { page: 'config-builder' }
  }
  return { page: 'home' }
}

function Link({ href, ...props }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={`#${href}`}
      {...props}
    />
  )
}

export { Link }

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  switch (route.page) {
    case 'playground':
      return <Playground />
    case 'playground-view':
      return <ViewConfig slug={route.slug!} />
    case 'config-builder':
      return <ConfigBuilder />
    default:
      return <Home />
  }
}
