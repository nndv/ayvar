import { createEventHub } from './event';
import { createRender } from './vdom';
import { createScheduler } from './utils';
import { routerStore } from './router';

export const app = (config = {}) => {
  const state = {};
  const eventHub = createEventHub();
  const schedule = createScheduler();

  use(routerStore);

  return {
    mount,
    use
  };

  function mount(view, parent) {
    const render = createRender(parent, {
      state,
      emit: eventHub.emit
    });

    render(view);

    eventHub.emit('DOMContentLoaded');

    eventHub.on('render', () => {
      schedule(() => {
        render(view);
      });
    });
  }

  function use(callback) {
    callback(state, eventHub);

    return this;
  }
};
