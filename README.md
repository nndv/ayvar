<p align="center"><img width="250" src="https://user-images.githubusercontent.com/9033390/45083249-96517200-b0fb-11e8-81ef-9c16124b9a13.png" alt="Ayvar" /></p>

<p align="center">Ayvar is a JavaScript library for building web applications.</p>

## Example

```jsx
import Ayvar from 'ayvar';

const App = (props, { state, setState }) => {
  const { count = props.initCount } = state;

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={down}>-</button>
      <button onClick={up}>+</button>
    </div>
  );

  function down() {
    setState({ count: count - 1 });
  }

  function up() {
    setState({ count: count + 1 });
  }
};

Ayvar.render(<App initCount={0} />, document.getElementById('app'));
```

## Stateless Component

```jsx
const Hello = props => <h1>Hello, {props.name}</h1>;
```

- **props**: The props that were defined by the caller of this component.

## Stateful Component

```jsx
const Counter = (props, { state, setState }) => {
  const { count = 0 } = state;

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+</button>
    </div>
  );

  function increment() {
    setState({ count: count + 1 });
  }
};
```

- **state**: The state contains data specific to this component that may change over time.
- **setState**: Used to update state and user interface.

## Component Lifecycle

```jsx
const Clock = (props, { state, setState, self: clock }) => {
  const { date = new Date() } = state;

  clock.onCreate = () => {
    clock.timerID = setInterval(tick, 1000);
  };

  clock.onDestroy = () => {
    clearInterval(clock.timerID);
  };

  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {date.toLocaleTimeString()}</h2>
    </div>
  );

  function tick() {
    setState({
      date: new Date()
    });
  }
};
```

- **onCreate**: This event is fired after the component is created and attached to the DOM.
- **onUpdate**: This event is fired every time the component is updated. Previous props are being passed to the handler.
- **onDestroy**: This event is fired when the component is removed from the DOM.

## Installation

<pre>
npm i <a href=https://www.npmjs.com/package/ayvar>ayvar</a>
</pre>

## License

Ayvar is MIT licensed. See [LICENCE](LICENCE.md).
