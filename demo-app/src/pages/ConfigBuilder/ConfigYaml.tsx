import { Button } from '@/components/ui/button'
import { useConfigBuilderContext } from '@open-truss/open-truss'

const FRAMES_PATH_PARTS = ['workflow:', 'frames:', '- frame:']

export default function ConfigYaml(): JSX.Element {
  const { config, framesPath, setFramesPath } = useConfigBuilderContext()
  const framesPathParts: Array<number | string> = []

  return (
    <>
      {config
        // clean up empty values to make things more readable
        .replaceAll('frame: null', 'frame: ')
        .replaceAll('frames: []', 'frames:')
        .replaceAll('frames:', 'frames: ')
        // read the config line by line
        .split('\n')
        .map((line, i) => {
          const trimmedLine = line.trim()

          // While iterating over the lines of the config, we construct what
          // each 'frames:' line's `framePath` is. This will look something like
          // 'workflow.frames.0.frames' where the integer is the index of the
          // current frame in the current frames array. This index gets
          // incremented when we encounter a '- frame:' line.

          // `configLevel` is what indentation level within the YAML we are in.
          // We divide by 2 because the config is indented 2 spaces per level.
          // We use `configLevel` to know what `framePath` level we are updating.
          const configLevel = line.search(/\S|$/) / 2
          if (FRAMES_PATH_PARTS.includes(trimmedLine)) {
            if (trimmedLine === '- frame:') {
              if (framesPathParts[configLevel] === undefined) {
                framesPathParts[configLevel] = 0
              } else {
                framesPathParts[configLevel] =
                  Number(framesPathParts[configLevel]) + 1
              }
            } else {
              framesPathParts[configLevel] = trimmedLine.replace(/:$/, '')
            }
          }

          if (trimmedLine.startsWith('frames:')) {
            const thisFramesPath = framesPathParts.join('.')
            const selectedFramesPath = thisFramesPath === framesPath
            return (
              <pre
                key={i}
                className={`${
                  selectedFramesPath ? 'color-pink' : 'color-black'
                }`}
              >
                {line}
                <Button
                  size="xs"
                  onClick={() => {
                    setFramesPath(thisFramesPath)
                  }}
                >
                  Nest at this level
                </Button>
              </pre>
            )
          } else {
            return <pre key={i}>{line}</pre>
          }
        })}
    </>
  )
}
