async function PlaygroundPage(): Promise<JSX.Element> {
  return <div style={{ whiteSpace: 'pre' }}>{config}</div>
}

export default PlaygroundPage

const config = `
To use the playground you can create a new Open Truss configuration at src/open-truss/configs/1-your-config.yaml. For example:

src/open-truss/configs/1-foo-bar.yaml
---
workflow:
  version: 1
  frames:
    - frame:
      data: Foo (component from application)
      view:
        component: Foo
        props:
          color: blue
      frames:
        - frame:
          data: OTBar (component from OT package)
          view:
            component: OTBar
            props:
              color: blue
`
