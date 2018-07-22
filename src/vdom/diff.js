import { NodeTypes, PatchTypes } from './types';

export const diff = (oldVNode, newVNode, parent, patches) => {
  if (newVNode === oldVNode) {
  } else if (!oldVNode) {
    patches.push({
      type: PatchTypes.APPEND,
      parent,
      newVNode
    });
  } else if (!newVNode) {
    patches.push({
      type: PatchTypes.REMOVE,
      parent,
      oldVNode
    });
  } else if (newVNode.nodeName !== oldVNode.nodeName) {
    patches.push({
      type: PatchTypes.REPLACE,
      newVNode,
      oldVNode
    });
  } else {
    switch (oldVNode.nodeType) {
      case NodeTypes.TEXT:
        if (newVNode.value !== oldVNode.value) {
          patches.push({
            type: PatchTypes.TEXT,
            newVNode,
            oldVNode
          });
        }
        break;

      case NodeTypes.DEFAULT:
      case NodeTypes.SVG:
        patches.push({
          type: PatchTypes.PROPS,
          newVNode,
          oldVNode
        });

        if (newVNode.children) {
          const parent = oldVNode.element;
          const longest =
            newVNode.children.length >= oldVNode.children.length
              ? newVNode.children.length
              : oldVNode.children.length;

          for (let i = 0; i < longest; i++) {
            diff(oldVNode.children[i], newVNode.children[i], parent, patches);
          }
        }
        break;

      default:
        throw new Error(`Non-exhaustive match for ${oldVNode.nodeType}`);
    }
  }

  return patches;
};
