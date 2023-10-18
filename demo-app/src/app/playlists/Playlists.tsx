'use client'

import { useQuery } from "@tanstack/react-query"

const getPlaylists = () => {
  return [2,3,4]
}

export default function Playlists() {
  // This useQuery could just as well happen in some deeper
  // child to <Posts>, data will be available immediately either way
  const { data, refetch } = useQuery({ queryKey: ['playlists'], queryFn: getPlaylists })

  return <div onClick={refetch}>{JSON.stringify(data)}</div>
}
