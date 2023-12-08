export default function Foo(props) {
    return (<div>
      <h1>{JSON.stringify(props.data)}</h1>
      {props.children}
    </div>);
}
