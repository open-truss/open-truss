// import createKustoUqiClient from '@/lib/kusto-uqi-client'
// import createMysqlUqiClient from '@/lib/mysql-uqi-client'
// import createTrinoUqiClient from '@/lib/trino-uqi-client'

const sources = {
  'rest-demo': {
    config: {
      protocol: 'https',
      host: 'api.github.com',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  },
}

export default sources
