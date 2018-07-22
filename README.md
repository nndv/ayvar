# Ayvar

Ayvar is a JavaScript framework for building web applications.

## Getting Started

Our first example is a counter that can be incremented or decremented.

```jsx
import { h, app } from 'ayvar';

const appStore = (state, { on, emit }) => {
  state.count = 0;

  on('down', value => {
    state.count -= value;
    emit('render');
  });

  on('up', value => {
    state.count += value;
    emit('render');
  });
};

const App = () => ({ state, emit }) => (
  <div>
    <h1>{state.count}</h1>
    <button onClick={() => emit('down', 1)}>-</button>
    <button onClick={() => emit('up', 1)}>+</button>
  </div>
);

app()
  .use(appState)
  .mount(<App />, document.getElementById('app'));
```

## Installation

Install with npm or Yarn.

<pre>
npm i <a href=https://www.npmjs.com/package/ayvar>ayvar</a>
</pre>

## License

Ayvar is MIT licensed. See [LICENSE](LICENSE.md).
