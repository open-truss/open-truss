import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import Playlists from './Playlists'

const getPlaylists = async () => {
  return [1,2,3]
}

export default async function PlaylistsPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['playlists'],
    queryFn: getPlaylists,
  })

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Playlists />
    </HydrationBoundary>
  )
}
