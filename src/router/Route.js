import { h } from '../vdom';
import { matchPath } from './utils';

export const Route = ({ name, path, exact, view, render }) => ({ emit }) => {
  const match = matchPath(window.location.pathname, { name, path, exact });

  if (!match) return null;

  emit('routeMatched', match);

  if (view) {
    return h(view, { match });
  }

  if (render) {
    return render({ match });
  }
};
