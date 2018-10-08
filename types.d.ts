import Router from './index';

export type ObjectLike<T extends any> = Record<string, T>;

export interface Component {
	new(...args: any[]): Component;
	[key: string]: any;
}

export interface RouteTransition {
	to: RouteInstance;
	from?: RouteInstance;
}

export interface Hooks {
	already?(route: RouteInstance): void;
	after?(transition: RouteTransition): void;
	leave?(transition: RouteTransition): void;
	before?(transition: RouteTransition, next: () => void): void;
}

export interface Route {
	name?: string;
	hooks?: Hooks;
	view?: string;
	children?: Route[];
	component: Component;
	path?: string | RegExp;
	state?: ObjectLike<any>;
	attrs?: ObjectLike<any>;
}

export interface InternalRoute extends Route {
	_path: string;
	_params: string[];
	_hasNext?: boolean;
	_parent?: Component;
	_instance?: Component;
	_root?: InternalRoute;
	_route?: RouteInstance;
	_component(route: RouteInstance, next?: (error: Error | string) => void): void;
}

export interface RouterOptions {
	hash?: string;
	root?: string;
	routes: Route[];
	ignoreCase?: boolean;
	mode?: 'hash' | 'history';
}

export interface NavigateParam {
	name: string;
	query?: ObjectLike<string>;
	params?: ObjectLike<string>;
}

export interface RouteInstance {
  /**
   * The router instance
   */
	router: Router;
  /**
   * The name of route
   */
	name: string | null;
  /**
   * The url of route
   */
	path: string | null;
  /**
   * State object
   */
	state: ObjectLike<any>;
  /**
   * Params object
   */
	params: ObjectLike<string>;
  /**
   * Query object
   */
	query: ObjectLike<string>;
  /**
   * Return value passed using, in order params, query and default_value if provided
   * @param {string} key Key of the value to retrieve
   * @param {any} defaultValue Default value if nothing found. Default to nothing
   * @return {string}
   */
	get(key: string, defaultValue?: any): string;
  /**
   * Navigate to the given path
   * @param {string|object} path
   */
	go(path: string | number | NavigateParam): void;
  /**
   * Navigate to previous path
   */
	back(distance?: number): void;
  /**
   * Navigate to next path
   */
	forward(distance?: number): void;
}

declare module "*.esm" {
	const moduleValue: Component;
	export default moduleValue;
}