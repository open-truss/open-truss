import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'
import { test } from 'node:test'
import { build } from 'vite'

async function bundle(source) {
  const result = await build({
    root: fileURLToPath(new URL('..', import.meta.url)),
    configFile: false,
    publicDir: false,
    logLevel: 'error',
    plugins: [
      {
        name: 'bundle-consumer',
        resolveId(id) {
          if (id === 'virtual:consumer') return '\0consumer'
        },
        load(id) {
          if (id === '\0consumer') return source
        },
      },
    ],
    build: {
      write: false,
      minify: false,
      rollupOptions: {
        input: 'virtual:consumer',
        output: { format: 'es' },
      },
    },
  })
  const chunk = result.output.find((output) => output.type === 'chunk')
  return { result, chunk }
}

function evaluate(chunk) {
  const context = {}
  runInNewContext(chunk.code, context)
  return JSON.parse(JSON.stringify(context.result))
}

test('importing z retains only Zod', async () => {
  const { chunk } = await bundle(`
    import { z } from '@open-truss/open-truss'
    globalThis.result = z.object({ name: z.string() }).parse({ name: 'Ada' })
  `)
  assert.deepEqual(evaluate(chunk), { name: 'Ada' })
  const retained = Object.entries(chunk.modules)
    .filter(([, module]) => module.renderedLength > 0)
    .map(([id]) => id)
  assert.ok(retained.some((id) => id.includes('/zod/')))
  assert.deepEqual(
    retained.filter((id) => id !== '\0consumer' && !id.includes('/zod/')),
    [],
  )
})

test('signal registration and reactivity survive tree shaking', async () => {
  const { chunk } = await bundle(`
    import {
      SIGNALS, getSignalsType, signal, computed, effect,
    } from '@open-truss/open-truss'
    const input = signal(2)
    const doubled = computed(() => input.value * 2)
    let observed
    const stop = effect(() => { observed = doubled.value })
    input.value = 6
    stop()
    globalThis.result = {
      types: Object.keys(SIGNALS).sort(),
      registered: getSignalsType(SIGNALS.string.signal) === SIGNALS.string.signal,
      observed,
    }
  `)
  assert.deepEqual(evaluate(chunk), {
    types: [
      'NavigateFrame',
      'boolean',
      'boolean[]',
      'number',
      'number[]',
      'string',
      'string[]',
      'unknown',
    ],
    registered: true,
    observed: 12,
  })
})

test('side-effect CSS imports survive tree shaking', async () => {
  const css = fileURLToPath(
    new URL(
      '../../packages/open-truss/dist/styles/example-page.css',
      import.meta.url,
    ),
  )
  const { result } = await bundle(`
    import ${JSON.stringify(css)}
  `)
  assert.ok(
    result.output.some(
      (output) =>
        output.type === 'asset' &&
        output.fileName.endsWith('.css') &&
        String(output.source).includes('.open-truss-example-page'),
    ),
  )
})
