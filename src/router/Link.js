import { h } from '../vdom';

export const Link = ({ to, children, replace = false }) => ({ emit }) => {
  function handleClick(event) {
    event.preventDefault();

    replace ? emit('replaceState', to) : emit('pushState', to);
  }

  return h('a', { href: to, onClick: handleClick }, children);
};
