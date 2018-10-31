// @ts-ignore
import RouteLink from './route-link.es';
// @ts-ignore
import RouterView from './router-view.es';
import {
	buildRoute, manageHooks, toPlainRoutes, pathToRegExp, generateUrl,
	getHashRegExp, clearSlashes, toInternalRoute, navigate, callLeave, goToPath
} from './tools';
import { Component, InternalRoute, RouteTransition, RouterOptions, ObjectLike, NavigateParam } from './types';

export default class Router {

	_component: Component;
	private _root: string;
	private _hash: string;
	private _listener: () => void;
	private _onChange: (() => void)[];
	private _routes: InternalRoute[] = [];
	private _mode: 'hash' | 'history' = 'hash';
	private _prev: InternalRoute | null = null;
	private _default: InternalRoute | null = null;
	private _notFound: InternalRoute | null = null;
	private _redirects: { from: RegExp, to: string }[];
	private _hooks: {
		after?(route: RouteTransition): void;
		before?(route: RouteTransition, next: (() => void)): void;
	};

	constructor(options: RouterOptions) {
		this._hooks = {};
		this._onChange = [];
		this._redirects = [];
		this._hash = options.hash || '#';
		this._listener = () => { this._onLocationChange(); };
		this._root = options.root ? `${clearSlashes(options.root)}/` : '/';
		this._mode = options.mode === 'history' && !!(history.pushState) ? 'history' : 'hash';

		this._routes = options.routes.reduce((routes, route) => {
			let { path } = route;
			let modifier = options.ignoreCase ? 'i' : '';
			let _route = toInternalRoute(route, modifier);
			if (typeof path === 'string' && (path === '' || path === '/')) {
				this._default = _route;
			} else if (!path) {
				this._notFound = _route;
				return routes;
			} else {
				routes.push(_route);
			}
			toPlainRoutes(this, _route, routes, modifier);
			return routes;
		}, <InternalRoute[]>[]);

		this._listen();
	}

	private _getFragment() {
		let root = '/';
		let url = root;
		if (this._mode === 'history') {
			url = clearSlashes(decodeURI(location.pathname + location.search));
			url = url.replace(/\?(.*)$/, '');
			url = this._root !== root ? url.replace(this._root, '') : url;
		} else {
			let match = window.location.href.match(getHashRegExp(this._hash));
			url = match ? match[1] : root;
		}
		return clearSlashes(url) || root;
	}

	private _buildRouteObject(url: string, name: string, params: ObjectLike<string>, state: ObjectLike<any>) {
		if (url == null) throw new Error('Unable to compile request object');
		let route = buildRoute(this, url);
		if (name) route.name = name;
		if (state) route.state = state;
		if (params) route.params = params;
		let completeFragment = url.split('?');
		if (completeFragment.length === 2) {
			route.query = {};
			let queryString = completeFragment[1].split('&');
			for (let i = 0, len = queryString.length; i < len; i++) {
				let [key, value] = queryString[i].split('=');
				route.query[decodeURI(key)] = decodeURI(value.replace(/\+/g, '%20'));
			}
			route.query;
		}
		return route;
	}

	private _matchedRoute(url: string, index: number | undefined) {
		if (typeof index === 'number') {
			return this._routes[index];
		} else if (url === '/' && this._default) {
			return this._default;
		} else if (this._notFound) {
			return this._notFound;
		}
		return null;
	}

	private _fallowRoute(url: string, indexes: number[]) {
		let index = indexes.shift();
		let route = this._matchedRoute(url, index);
		if (route) {
			let hasNext = indexes.length !== 0;
			let params: ObjectLike<string> = {};
			let match = <RegExpMatchArray>url.match(route.path);
			let { _params } = route;

			for (let i = 0; i < _params.length; i++) {
				params[_params[i]] = match[i + 1];
			}

			let to = this._buildRouteObject(url, route.name, params, route.state);
			let ins: RouteTransition = { to };
			const prev = this._prev;

			if (prev) {
				ins.from = prev._route;
				if (prev._path === url) {
					let { hooks } = prev;
					hooks && hooks.already && hooks.already(to);
				}
			}

			this._prev = route;
			route._route = hasNext ? ins.from : to;

			return (parent: Component) => {
				route._parent = parent;
				manageHooks(() => {
					manageHooks(() => {
						route._root !== prev && callLeave(prev, ins);
						route._component.call(route, to, (err: Error | string) => {
							if (err) throw err;
							hasNext && this._fallowRoute(url, indexes)(route._instance);
						});
					}, ins, route.hooks);
				}, ins, !hasNext && this._hooks);
			};
		} else {
			return () => {
				console.warn(`Error code(404): Unmatched route for url '${url}'.`);
			};
		}
	}

	private _onLocationChange() {
		this.route();
	}

	private _listen() {
		if (this._mode === 'history') {
			window.addEventListener('popstate', this._listener);
		} else {
			window.addEventListener('hashchange', this._listener);
		}
	}

	get mode() {
		return this._mode;
	}

	get hash() {
		return this._hash;
	}

	get root() {
		return this._root;
	}

	get url() {
		return this._getFragment();
	}

	static plugin(this: Component, Ctor: Function) {
		let { $options } = this;
		$options.children['route-link'] = RouteLink;
		$options.children['router-view'] = RouterView;

		if ($options.router && !this.$route) {
			const router: Router = $options.router;
			router._component = this;
			Object.defineProperty(Ctor.prototype, '$router', {
				get: () => router, enumerable: true, configurable: true
			});
			if ($options.didMount) {
				let { didMount } = $options;
				$options.didMount = function (this: Component) {
					didMount.call(this);
					navigate(this.$router);
				};
			} else {
				$options.didMount = function (this: Component) {
					navigate(this.$router);
				};
			}
			if ($options.didDestroy) {
				let { didDestroy } = $options;
				$options.didDestroy = function (this: Component) {
					didDestroy.call(this);
					this.$router.destroy();
				};
			} else {
				$options.didDestroy = function (this: Component) {
					this.$router.destroy();
				};
			}
		}
  }
  
  go(path: string | number | NavigateParam) {
    goToPath(this, path);
  }

	onUrlChange(listener: () => void) {
		this._onChange.push(listener);
	}

	route() {
		let url = this.url;
		let redirect: string;
		let indexes: number[] = [];

		for (let i = 0; i < this._redirects.length; i++) {
			const path = this._redirects[i].from;
			if (path.test(url)) {
				redirect = this._redirects[i].to;
				i = this._redirects.length;
			}
		}

		if (typeof redirect === 'string') {
			navigate(this, redirect);
		} else {
			for (let i = 0; i < this._routes.length; i++) {
				let path = <RegExp>this._routes[i].path;
				if (path.test(url)) {
					indexes.push(i);
				}
			}
			this._fallowRoute(url, indexes)(this._component);
			this._onChange.forEach(listener => { try { listener(); } catch { } });
		}
	}

	beforeEach(handler: (routes: RouteTransition, next: (() => void)) => void) {
		handler && (this._hooks.before = handler);
	}

	afterEach(handler: (routes: RouteTransition) => void) {
		handler && (this._hooks.after = handler);
	}

	redirect(paths: { [key: string]: string | NavigateParam }) {
		if (typeof paths === 'object') {
			for (const key in paths) {
				if (paths.hasOwnProperty(key)) {
					const path = paths[key];
					const to = typeof path === 'string' ? path : generateUrl(this, path);
					this._redirects.push({ from: pathToRegExp(key), to });
				}
			}
		}
	}

	destroy() {
		this._root = '/';
		this._hash = '#';
		this._routes = [];
		this._mode = 'hash';

		window.removeEventListener('popstate', this._listener);
		window.removeEventListener('hashchange', this._listener);
	}
}
