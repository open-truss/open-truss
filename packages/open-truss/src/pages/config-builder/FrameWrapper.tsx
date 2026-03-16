import { useConfigBuilderContext } from '../../hooks'
import { type FrameWrapper } from '../../configuration'

const ConfigBuilderFrameWrapper: FrameWrapper = ({
  children,
  configPath,
  frame,
}) => {
  const { framesPath, setFramesPath, deleteFrame } = useConfigBuilderContext()

  let nestingHere = false
  // When we add a frame we set its `.frames` to an empty array if
  // it supports children, so here we just check if that field is truthy.
  const canNestFrames = Boolean(frame?.frames)
  if (canNestFrames) {
    // `framesPath` is the current nesting component's `.frames` so to ask
    // if this component is the nester, we remove `.frames` from the end.
    nestingHere = configPath === framesPath.replace(/\.frames$/, '')
  }

  const nestHere = (e: React.MouseEvent): void => {
    e.stopPropagation()
    if (nestingHere) {
      // We're toggling off frame nesting.
      setFramesPath(null)
      return
    }
    // Set framesPath to this component's frames array.
    setFramesPath(`${configPath}.frames`)
  }

  const deleteThisFrame = (e: React.MouseEvent): void => {
    e.stopPropagation()
    deleteFrame(configPath)
  }

  return (
    <div
      className={`relative border-1 border-solid${
        nestingHere ? ' border-rose-600' : ''
      }`}
    >
      <div className="absolute right-0 top-0 flex">
        {canNestFrames && (
          <button className="mr-1" onClick={nestHere}>
            {nestingHere ? 'Stop nesting' : 'Nest here'}
          </button>
        )}
        <button onClick={deleteThisFrame}>Delete</button>
      </div>
      {children}
    </div>
  )
}

export default ConfigBuilderFrameWrapper
