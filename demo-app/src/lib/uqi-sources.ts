import createTrinoUqiClient from '@/lib/trino-uqi-client'

const sources = {
  'trino-demo': {
    config: {
      auth: 'trino',
      server: process.env.TRINO_DEMO_SERVER,
    },
    createClient: createTrinoUqiClient,
  },
}

export default sources
