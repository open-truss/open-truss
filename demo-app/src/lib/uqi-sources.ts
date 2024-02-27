import createMysqlUqiClient from '@/lib/mysql-uqi-client'
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
    // docker run --name mysql8 -e MYSQL_ROOT_PASSWORD="passw0rd" -d mysql:8
    // mysql -uroot -p -h<hostname>
    config: {
      uri: String(process.env.MYSQL_DEMO_URI),
      socketPath: process.env.MYSQL_DEMO_SOCKET_PATH,
    },
    createClient: createMysqlUqiClient,
  },
}

export default sources
