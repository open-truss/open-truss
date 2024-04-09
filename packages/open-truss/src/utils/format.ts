import { format as sqlFormat, type SqlLanguage } from 'sql-formatter'

export type Param = string | number | string[] | number[]

export interface Config {
  language?: SqlLanguage
  params?: Record<string, Param>
}

function formatParam(param: Param): string {
  if (typeof param === 'number') {
    return String(param)
  } else if (typeof param === 'string') {
    return `'${param.replaceAll("'", "''")}'`
  } else if (Array.isArray(param)) {
    return param.map(formatParam).join(',')
  } else {
    throw new Error(`Unsupported param type: ${typeof param}`)
  }
}

function formatParams(params: Record<string, Param>): Record<string, string> {
  const formattedEntries = Object.entries(params).map(([key, param]) => [
    key,
    formatParam(param),
  ])
  return Object.fromEntries(formattedEntries)
}

export function formatQuery(template: string, config?: Config): string {
  return sqlFormat(template, {
    language: config?.language || 'sql',
    linesBetweenQueries: 2,
    params: config?.params ? formatParams(config.params) : undefined,
    paramTypes: { named: [':'] },
    tabWidth: 4,
  })
}
