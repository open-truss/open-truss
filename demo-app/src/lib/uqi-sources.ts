import createTrinoUqiClient from '@/lib/trino-uqi-client'

const sources = {
  'trino-demo': {
    config: {
      auth: 'trino',
      server: 'http://localhost:8080',
    },
    createClient: createTrinoUqiClient,
  },
}

export default sources
