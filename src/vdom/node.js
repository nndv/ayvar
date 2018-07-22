import { NodeTypes } from './types';

export const h = (nodeName, props, ...children) => {
  return {
    nodeName,
    props: props || {},
    children: [].concat(...children)
  };
};

export const createVNode = (element, context, isSvg = false) => {
  if (element === false || element === true || element == null) {
    return {
      nodeType: NodeTypes.NULL
    };
  }

  if (typeof element.nodeName === 'function') {
    const props = Object.assign({}, element.props, {
      children: element.children
    });
    let subtree = element.nodeName(props);

    if (typeof subtree === 'function') {
      subtree = subtree(context);
    }

    return createVNode(subtree, context);
  }

  if (typeof element === 'string' || typeof element === 'number') {
    return {
      nodeType: NodeTypes.TEXT,
      value: element
    };
  }

  isSvg = isSvg || element.nodeName === 'svg';

  return Object.assign({}, element, {
    children: element.children.map(child => createVNode(child, context, isSvg)),
    nodeType: isSvg ? NodeTypes.SVG : NodeTypes.DEFAULT
  });
};
