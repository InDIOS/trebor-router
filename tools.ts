import Router from './index';
// @ts-ignore
import RouterView from './router-view.es';
import { Route, InternalRoute, RouteInstance, Component, RouteTransition, Hooks, NavigateParam } from './types';

const ROOT_MATCHER = /^\/$/,
  PATH_REPLACER = '([^\/\\?]+)',
  PATH_NAME_MATCHER = /:([\w\d]+)/g,
  PATH_EVERY_MATCHER = /\/\*(?!\*)/,
  PATH_EVERY_REPLACER = '\/([^\/\\?]+)',
  PATH_EVERY_GLOBAL_MATCHER = /\*{2}/,
  PATH_EVERY_GLOBAL_REPLACER = '(.*?)\\??',
  LEADING_BACKSLASHES_MATCH = /\/*$/;

export function clearSlashes(path: string) {
  return path.replace(LEADING_BACKSLASHES_MATCH, '');
}

export function pathToRegExp(path: string, modifier: string = '') {
  return !path ? ROOT_MATCHER : new RegExp(path
    .replace(PATH_NAME_MATCHER, PATH_REPLACER)
    .replace(PATH_EVERY_MATCHER, PATH_EVERY_REPLACER)
    .replace(PATH_EVERY_GLOBAL_MATCHER, PATH_EVERY_GLOBAL_REPLACER) + '(?:\\?.+)?$', modifier);
}

export function toInternalRoute(route: Route, modifier: string = '') {
  let { path, component } = route;
  let match: RegExpExecArray | null, params: string[] = [];
  let _component = function (this: InternalRoute, ins: RouteInstance) {
    let [view] = <Component[]>this._parent.$children
      .filter(c => c instanceof RouterView && c.name === this.view);
    if (view) {
      component.prototype.$route = ins;
      let hasNext = this._hasNext && !(<RegExp>this.path).test(ins.path);
      if (!this._instance) {
        let instance = new component(route.attrs);
        instance.$hasNext = hasNext;
        view.$parentEl = view.$siblingEl && view.$siblingEl.parentElement || view.$parentEl;
        instance.$mount(view.$parentEl, view.$siblingEl);
        this._instance = instance;
      } else {
        let instance = this._instance;
        instance.$hasNext = hasNext;
        let { $parentEl, $siblingEl } = instance;
        instance.$unmount();
        instance.$mount($parentEl, $siblingEl);
        instance.$update();
      }
    }
  };
  let intRoute: InternalRoute = Object.assign({}, route, { _path: '', _params: [], _component });
  if (typeof path === 'string') {
    /* Remove leading backslash from the end of the string */
    path = clearSlashes(path);
    intRoute._path = path || '/';
    /* Param Names are all the one defined as :param in the path */
    while ((match = PATH_NAME_MATCHER.exec(path)) !== null) params.push(match[1]);
    path = pathToRegExp(path, modifier);
  }
  intRoute.path = path;
  intRoute._params = params;
  intRoute.state = intRoute.state || {};
  intRoute.view = intRoute.view || 'default';
  if (intRoute.hooks && intRoute.hooks.leave) {
    let { leave } = intRoute.hooks;
    intRoute.hooks.leave = (ins: RouteTransition) => {
      leave(ins);
      if (intRoute._instance) {
        intRoute._instance.$destroy();
        delete intRoute._instance;
      }
    };
  } else {
    (intRoute.hooks = intRoute.hooks || {}).leave = () => {
      if (intRoute._instance) {
        intRoute._instance.$destroy();
        delete intRoute._instance;
      }
    };
  }
  return intRoute;
}

export function toPlainRoutes(router: Router, route: InternalRoute, routes: InternalRoute[], modifier: string = '') {
  let { children } = route;
  if (children && children.length !== 0) {
    delete route.children;
    let { _component } = route;
    route._component = (ins: RouteInstance, next: (error?: string | Error) => void) => {
      route._hasNext = true;
      _component.call(route, ins);
      next && next();
    };
    children.forEach(child => {
      if (child.name && route.name) child.name = `${route.name}.${child.name}`;
      if (typeof child.path === 'string') {
        child.path = `${clearSlashes(route._path)}/${child.path.replace(/^\//, '')}`;
      }
      let subRoute = toInternalRoute(child, modifier);
      routes.push(subRoute);
      subRoute._root = route;
      if (subRoute._path !== route._path) {
        let { _component } = subRoute;
        subRoute._component = (to: RouteInstance, next: (error?: string | Error) => void) => {
          route._parent = subRoute._parent;
          manageHooks(() => {
            route._component(to, next);
            subRoute._parent = route._instance;
            _component.call(subRoute, to, next);
          }, { from: route._route, to }, route.hooks);
        };
      }
      toPlainRoutes(router, subRoute, routes);
    });
  }
}

export function onChange(router: Router) {
  setTimeout(() => { router.route(); }, 0);
}

export function getHashRegExp(hash: string) {
  return new RegExp(`${hash}(.*)$`);
}

export function callLeave(route: InternalRoute, ins: RouteTransition) {
  if (route) {
    route.hooks && route.hooks.leave && route.hooks.leave(ins);
    callLeave(route._root, ins);
  }
}

export function manageHooks(handler: () => void, route: RouteTransition, hooks?: Hooks) {
  if (typeof hooks === 'object') {
    if (hooks.before) {
      hooks.before(route, () => {
        handler();
        hooks.after && hooks.after(route);
      });
      return;
    } else if (hooks.after) {
      handler();
      hooks.after(route);
      return;
    }
  }
  handler();
}

export function goToPath(router: Router, path: string | number | NavigateParam) {
  switch (typeof path) {
    case 'number':
      history && history.go(path);
      break;
    case 'object':
      let { name, params, query } = <NavigateParam>path;
      navigate(router, generateUrl(router, { name, params, query }));
      break;
    default:
      navigate(router, <string>path);
      break;
  }
}

export function buildRoute(router: Router, path: string | null): RouteInstance {
  path = path || '/';
  return {
    path,
    router,
    query: {},
    state: {},
    name: null,
    params: {},
    go(path: string | number | NavigateParam) {
      goToPath(router, path);
    },
    back() {
      history && history.go(-1);
    },
    forward() {
      history && history.go(1);
    },
    get(key: string, default_value?: any): string {
      return (this.params && this.params[key] !== undefined) ?
        this.params[key] : (this.query && this.query[key] !== undefined) ?
          this.query[key] : (default_value !== undefined) ? default_value : undefined;
    }
  };
}

export function navigate(router: Router, path?: string) {
  path = path || router.url;
  if (router.mode === 'history') {
    history.pushState(null, '', router.root + clearSlashes(path).replace(/^\//, ''));
    onChange(router);
  } else {
    let href = window.location.href.replace(getHashRegExp(router.hash), '');
    let to = `${href}${router.hash}${path.replace(router.hash, '')}`;
    if (window.location.href !== to) {
      window.location.href = to;
    } else {
      onChange(router);
    }
  }
}

export function generateUrl(router: Router, { name, params = {}, query }: NavigateParam) {
  let result = '';
  let route = router['_routes'].filter(route => route.name === name)[0];
  if (route) {
    result = route._path;
    for (let key in params) result = result.replace(`:${key}`, params[key]);
    if (query && typeof query === 'object') {
      let getParams = [];
      for (let key in query) getParams.push(`${key}=${encodeURI(query[key])}`);
      result += `?${getParams.join('&')}`;
    }
  }
  result = result || '/';
  return router.mode === 'hash' ? `${router.hash}${result}` : result;
}
