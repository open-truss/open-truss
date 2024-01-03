import createTrinoUqiClient from '@/lib/trino-uqi-client'

const sources = {
  // setup local trino with this:
  // docker run --name trino -d -p 8080:8080 trinodb/trino
  'trino-demo': {
    config: {
      auth: 'trino',
      server: String(process.env.TRINO_DEMO_SERVER),
    },
    createClient: createTrinoUqiClient,
  },
  'mysql-demo': {
    // setup local mysql with this:
    // docker run --name mysql8 -e MYSQL_ROOT_PASSWORD="passw0rd" -e MYSQL_USER=admin -e MYSQL_PASSWORD="passw0rd" -d mysql:8
    config: {
      // ...
    },
    // createClient: createMysqlUqiClient,
  },
}

export default sources
