import { createVNode } from './node';
import { diff } from './diff';
import { patch } from './patch';

export const createRender = (dom, context) => {
  let oldVNode = null;

  return function(element) {
    let newVNode = createVNode(element, context);
    let patches = [];

    patch(diff(oldVNode, newVNode, dom, patches));

    oldVNode = newVNode;
  };
};
