const TEXT_ELEMENT = 'TEXT ELEMENT';
const SVG_NS = 'http://www.w3.org/2000/svg';

function createElement(type, props, ...children) {
  props = Object.assign({}, props);
  props.children = [];

  const rawChildren = [].concat(...children);
  const { ref, key } = props;

  if (ref) delete props.ref;

  for (let child of rawChildren) {
    if (!isEmptyElement(child)) {
      props.children.push(
        isTextElement(child) ? createTextElement(child) : child
      );
    }
  }

  return { type, props, key, ref };
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

const resolved = typeof Promise === 'function' && Promise.resolve();

const defer = !resolved
  ? setTimeout
  : function(cb) {
      return resolved.then(cb);
    };

let prevInstance = null;

function render(element, container) {
  defer(() => {
    prevInstance = reconcile(container, prevInstance, element);
  });
}

function reconcile(parentDom, instance, element) {
  if (instance == null) {
    const newInstance = instantiate(element);

    parentDom.appendChild(newInstance.dom);

    return newInstance;
  }

  if (element == null) {
    const { onDestroy } = instance.self;

    onDestroy && onDestroy();

    parentDom.removeChild(instance.dom);

    return null;
  }

  if (instance.element.type !== element.type) {
    const newInstance = instantiate(element);
    const { onDestroy } = instance.element.type;

    onDestroy && onDestroy();

    parentDom.replaceChild(newInstance.dom, instance.dom);

    return newInstance;
  }

  if (element.type === TEXT_ELEMENT) {
    if (instance.element.props.nodeValue !== element.props.nodeValue) {
      instance.dom.nodeValue = element.props.nodeValue;
      instance.element = element;
    }

    return instance;
  }

  if (typeof element.type === 'function') {
    const childElement = instance.render(element.props);
    const oldChildInstance = instance.childInstance;
    const childInstance = reconcile(parentDom, oldChildInstance, childElement);
    const { onUpdate } = instance.self;

    onUpdate && onUpdate(instance.element.props);

    instance.dom = childInstance.dom;
    instance.childInstance = childInstance;
    instance.element = element;

    return instance;
  }

  updateAttributes(instance.dom, instance.element.props, element.props);

  const newChildInstances = [];
  const count = Math.max(
    instance.childInstances.length,
    element.props.children.length
  );

  for (let i = 0; i < count; i++) {
    const childInstance = reconcile(
      instance.dom,
      instance.childInstances[i],
      element.props.children[i]
    );

    if (newChildInstances) {
      newChildInstances.push(childInstance);
    }
  }

  instance.childInstances = newChildInstances;

  instance.element = element;

  return instance;
}

function instantiate(element) {
  if (element.type === TEXT_ELEMENT) {
    const dom = document.createTextNode(element.props.nodeValue);

    return { dom, element };
  }

  if (typeof element.type === 'function') {
    const instance = {};
    const render = createComponent(element, instance);
    const childElement = render(element.props);
    const childInstance = instantiate(childElement);
    const dom = childInstance.dom;
    const { onCreate } = instance.self;

    onCreate && onCreate();

    return Object.assign(instance, {
      dom,
      element,
      childInstance,
      render
    });
  }

  const { type, props } = element;

  element.ns = element.ns || type === 'svg';

  const dom = element.ns
    ? document.createElementNS(SVG_NS, type)
    : document.createElement(type);

  updateAttributes(dom, [], props);

  const childInstances = [];

  for (let child of props.children) {
    child.ns = element.ns;

    const childInstance = instantiate(child);

    dom.appendChild(childInstance.dom);

    childInstances.push(childInstance);
  }

  return { dom, element, childInstances };
}

function updateAttributes(dom, prevProps, nextProps) {
  const mergedProps = Object.assign({}, prevProps, nextProps);

  for (let prop in mergedProps) {
    if (isEvent(prop) && isOldProp(nextProps)(prop)) {
      const eventName = prop.toLowerCase().substring(2);

      dom.removeEventListener(eventName, prevProps[prop]);
    } else if (isEvent(prop) && isNewProp(prevProps, nextProps)(prop)) {
      const eventName = prop.toLowerCase().substring(2);

      dom.removeEventListener(eventName, prevProps[prop]);
      dom.addEventListener(eventName, nextProps[prop]);
    } else if (isAttribute(prop) && isOldProp(nextProps)(prop)) {
      dom.removeAttribute(prop);
    } else if (isAttribute(prop) && isNewProp(prevProps, nextProps)(prop)) {
      const value = nextProps[prop];

      setAttribute(dom, prop, value);
    } else if (prop === 'style') {
      const prevStyle = prevProps.style || {};
      const nextStyle = nextProps.style || {};

      updateStyles(dom, prevStyle, nextStyle);
    }
  }
}

function setAttribute(dom, prop, value) {
  if (prop === 'checked' || prop === 'value' || prop === 'className') {
    dom[prop] = value;
  } else if (typeof value === 'boolean') {
    if (value) {
      dom.setAttribute(prop, value);
      dom[prop] = true;
    } else {
      dom.removeAttribute(prop);
    }
  } else {
    dom.setAttribute(prop, value);
  }
}

function updateStyles(dom, prevStyle, nextStyle) {
  const mergedStyles = Object.assign({}, prevStyle, nextStyle);

  for (let key in mergedStyles) {
    if (isOldProp(nextStyle)(key)) {
      dom.style[key] = '';
    } else if (isNewProp(prevStyle, nextStyle)(key)) {
      dom.style[key] = nextStyle[key];
    }
  }
}

function createComponent(element, instance) {
  const state = Object.create(null);
  const self = Object.create(null);

  instance.self = self;

  return props => element.type(props, { state, setState, self });

  function setState(newState) {
    Object.assign(state, newState);

    defer(() => {
      reconcile(
        instance.dom.parentNode,
        instance.childInstance,
        instance.render(instance.element.props)
      );
    });
  }
}

const isEvent = name => name.startsWith('on');

const isAttribute = name =>
  !isEvent(name) && name !== 'style' && name !== 'children';

const isNewProp = (prev, next) => key => prev[key] !== next[key];

const isOldProp = next => key => !(key in next);

const isTextElement = element =>
  typeof element === 'string' || typeof element === 'number';

const isEmptyElement = element =>
  element === true || element === false || element == null;

export default {
  createElement,
  render
};
