import createTrinoUqiClient from '@/lib/trino-uqi-client'

const sources = {
  'trino-demo': {
    config: {
      auth: 'trino',
      server: 'http://trino.orb.local:8080',
    },
    createClient: createTrinoUqiClient,
  },
}

export default sources
