export const historyPush = path => {
  window.history.pushState({}, null, path);
};

export const historyReplace = path => {
  window.history.replaceState({}, null, path);
};

export const matchPath = (pathname, options) => {
  const { name, path, exact } = options;

  if (!path) {
    return {
      path: null,
      url: pathname,
      isExact: true
    };
  }

  const match = new RegExp(`^${path.replace(/:\w+/g, '(\\w+)')}`).exec(
    pathname
  );

  if (!match) return null;

  const url = match[0];
  const isExact = pathname === url;

  if (exact && !isExact) {
    return null;
  }

  const params = {};
  const reg = new RegExp(/:(\w+)/g);
  let pathParamKeys = reg.exec(path);
  let paramValueIndex = 1;

  while (pathParamKeys !== null) {
    params[pathParamKeys[1]] = match[paramValueIndex];
    pathParamKeys = reg.exec(path);
    paramValueIndex++;
  }

  return {
    name,
    path,
    url,
    params,
    isExact
  };
};
