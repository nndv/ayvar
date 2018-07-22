import { NodeTypes, PatchTypes } from './types';

const SVG_NS = 'http://www.w3.org/2000/svg';

const NULL_ELEMENT_COMMENT = 'ayvar--empty';

export const patch = patches => {
  for (let p of patches) applyPatch(p);
};

export const applyPatch = patch => {
  switch (patch.type) {
    case PatchTypes.APPEND:
      appendVNode(patch.newVNode, patch.parent);
      break;

    case PatchTypes.REMOVE:
      removeVNode(patch.oldVNode);
      break;

    case PatchTypes.REPLACE:
      replaceVNode(patch.newVNode, patch.oldVNode.element);
      break;

    case PatchTypes.PROPS:
      updateProps(patch.oldVNode, patch.newVNode);
      break;

    case PatchTypes.TEXT:
      updateText(patch.oldVNode, patch.newVNode);
      break;

    default:
      throw new Error(`Non-exhaustive match for ${patch.type}`);
  }
};

export const appendVNode = (vNode, parent) => {
  parent.appendChild(createElement(vNode));
};

export const removeVNode = vNode => {
  vNode.element.parentNode.removeChild(vNode.element);
};

export const replaceVNode = (vNode, element) => {
  element.parentNode.replaceChild(createElement(vNode), element);
};

export const updateText = (oldVNode, newVNode) => {
  const element = oldVNode.element;
  element.nodeValue = newVNode.value;
  newVNode.element = element;
};

export const updateProps = (oldVNode, newVNode) => {
  const element = oldVNode.element;

  if (element.nodeType !== 3 && element.nodeType !== 8) {
    const props = newVNode.props;

    for (let attr of element.attributes) element.removeAttribute(attr.name);

    for (let prop in props)
      setAttribute(element, prop, props[prop], newVNode.nodeType);
  }

  newVNode.element = element;
};

export const createElement = vNode => {
  let element = null;

  switch (vNode.nodeType) {
    case NodeTypes.TEXT:
      element = createTextElement(vNode.value);
      break;

    case NodeTypes.SVG:
      element = createSvgElement(vNode);
      break;

    case NodeTypes.NULL:
      element = createNullElement(vNode);
      break;

    case NodeTypes.DEFAULT:
      element = createDefaultElement(vNode);
      break;

    default:
      throw new Error(`Non-exhaustive match for ${vNode.nodeType}`);
  }

  vNode.element = element;

  return element;
};

export const createTextElement = value => {
  return document.createTextNode(value);
};

export const createSvgElement = vNode => {
  const { nodeName, props, children } = vNode;
  const element = document.createElementNS(SVG_NS, nodeName);

  appendChildren(element, children);
  setProps(element, props, true);

  return element;
};

export const createDefaultElement = vNode => {
  const { nodeName, props, children } = vNode;
  const element = document.createElement(nodeName);

  appendChildren(element, children);
  setProps(element, props, false);

  return element;
};

export const createNullElement = () => {
  return document.createComment(NULL_ELEMENT_COMMENT);
};

export const appendChildren = (element, children) => {
  for (let childNode of children)
    childNode && element.appendChild(createElement(childNode));
};

export const setProps = (element, props, isSvg) => {
  for (let prop in props) setAttribute(element, prop, props[prop], isSvg);
};

export const setAttribute = (element, prop, value, isSvg) => {
  if (prop.startsWith('on')) {
    const eventName = prop.slice(2).toLowerCase();
    setEventListener(element, eventName, value);
  } else if (prop === 'value' || prop === 'className') {
    element[prop] = value;
  } else if (typeof value === 'boolean') {
    if (value) {
      element.setAttribute(prop, value);
      element[prop] = true;
    }
  } else {
    isSvg
      ? element.setAttributeNS(null, prop, value)
      : element.setAttribute(prop, value);
  }
};

export const setEventListener = (element, eventName, value) => {
  element.__events = element.__events || {};
  element.removeEventListener(eventName, element.__events[eventName]);
  element.__events[eventName] = value;
  element.addEventListener(eventName, element.__events[eventName]);
};
