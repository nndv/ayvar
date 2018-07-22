import { historyPush, historyReplace } from './utils';

export const routerStore = (state, { on, emit }) => {
  state.route = {};

  window.addEventListener('popstate', () => {
    emit('render');
  });

  on('pushState', path => {
    historyPush(path);
    emit('render');
  });

  on('replaceState', path => {
    historyReplace(path);
    emit('render');
  });

  on('routeMatched', match => {
    state.route = match;
    emit('navigate');
  });
};
