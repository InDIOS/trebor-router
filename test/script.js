(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (factory());
}(this, (function () { 'use strict';

    var PROP_MAP = { p: '__TP__', v: 'value', _: '_value', s: '_subscribers', e: '_events', w: '_watchers', h: 'prototype' };
    var PROPS = ['$slots', '$refs', '$filters', '$directives', '_events', '_watchers'];
    var TPS = window[PROP_MAP.p] || (window[PROP_MAP.p] = []);
    var _$assign = Object['assign'] || function (t) {
        for (var s = void 0, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (_$hasProp(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    function _$CompCtr(attrs, template, options, parent) {
        var self = this;
        var _$set = function (prop, value) { _$def(self, prop, { value: value, writable: true }); };
        if (!attrs)
            attrs = {};
        _$e(PROPS, function (prop) { _$def(self, prop, { value: {} }); });
        _$set('$parent', parent || null);
        _$set('$children', []);
        _$set(PROP_MAP.s, {});
        _$set('$options', options);
        var opts = self.$options;
        if (!opts.attrs)
            opts.attrs = {};
        if (!opts.children)
            opts.children = {};
        _$e(TPS, function (plugin) { plugin.fn.call(self, _$CompCtr, plugin.options); });
        if (opts.filters)
            _$assign(self.$filters, opts.filters);
        if (opts.directives)
            _$e(opts.directives, function (drt, k) { self.$directives[k] = _$drt(drt); });
        _$e(opts.attrs, function (attrOps, key) {
            _$def(self, (_$isType(key, 'number') ? attrOps : key), {
                get: function () {
                    if (_$isStr(attrOps)) {
                        var value = attrs[attrOps];
                        return _$isFunction(value) ? value() : value;
                    }
                    else {
                        if (!_$hasProp(attrs, key) && attrOps.required) {
                            return console.error("Attribute '" + key + "' is required.");
                        }
                        else {
                            var value = _$isFunction(attrs[key]) ? attrs[key]() : attrs[key];
                            if (value === void 0 && _$hasProp(attrOps, 'default')) {
                                var def = attrOps.default;
                                value = _$isFunction(def) ? def() : def;
                            }
                            var typ = attrOps.type;
                            if (typ && !_$isType(value, typ) && attrOps.required) {
                                return console.error("Attribute '" + key + "' must be type '" + typ + "'.");
                            }
                            value = _$toType(value, value === void 0 ? 'undefined' : typ, self, key);
                            if (value !== void 0 && _$hasProp(attrOps, 'validator')) {
                                var validator = attrOps.validator;
                                if (_$isFunction(validator) && !validator(value)) {
                                    return console.error("Assigment '" + key + "'='" + JSON.stringify(value) + "' invalid.");
                                }
                            }
                            return value;
                        }
                    }
                },
                set: function () {
                    console.error("'" + key + "' is read only.");
                },
                enumerable: true, configurable: true
            });
        });
        var data = opts.model || {};
        var _loop_1 = function (key) {
            if (_$hasProp(data, key)) {
                var desc = Object.getOwnPropertyDescriptor(data, key);
                if (desc.value && _$isArray(desc.value)) {
                    desc.value = new _$List(desc.value, self, key);
                }
                else {
                    if (desc.get) {
                        var getter_1 = desc.get;
                        desc.get = function () {
                            var value = getter_1.call(self);
                            if (_$isArray(value))
                                value = new _$List(value, self, key);
                            return value;
                        };
                    }
                    if (desc.set) {
                        var setter_1 = desc.set;
                        desc.set = function (v) {
                            if (_$isArray(v))
                                v = new _$List(v, self, key);
                            setter_1.call(self, v);
                        };
                    }
                }
                _$def(self, key, desc);
            }
        };
        for (var key in data) {
            _loop_1(key);
        }
        var tpl = template(self, opts.children);
        _$e(tpl, function (value, key) {
            _$def(self, key, {
                value: (function (key) {
                    var hook = key[1].toUpperCase() + key.slice(2);
                    var bhook = opts["before" + hook];
                    var ahook = opts["after" + hook];
                    return function () {
                        bhook && bhook.call(this);
                        key.slice(1) === 'update' ? value.call(this, this) : value.apply(this, arguments);
                        ahook && ahook.call(this);
                    };
                })(key)
            });
        });
        _$def(self, '$data', {
            get: function () {
                return _$toPlainObj(this);
            }
        });
    }
    function _$isValueAttr(attr) {
        return attr === 'value';
    }
    function _$subs(dep, listener) {
        if (!this[PROP_MAP.s][dep]) {
            this[PROP_MAP.s][dep] = [];
        }
        return this[PROP_MAP.s][dep].push(listener.bind(this)) - 1;
    }
    function _$def(obj, key, desc) {
        Object.defineProperty(obj, key, desc);
    }
    _$assign(_$CompCtr[PROP_MAP.h], {
        $get: function (path) {
            return _$accesor(this, path);
        },
        $set: function (path, value) {
            _$accesor(this, path, value);
        },
        $on: function (event, handler) {
            var _this = this;
            if (!this[PROP_MAP.e][event]) {
                this[PROP_MAP.e][event] = [];
            }
            var i = this[PROP_MAP.e][event].push(handler);
            return {
                $off: function () {
                    _this[PROP_MAP.e][event].splice(i - 1, 1);
                }
            };
        },
        $once: function (event, handler) {
            var e = this.$on(event, function (args) {
                handler(args);
                e.$off();
            });
        },
        $fire: function (event, data) {
            if (this[PROP_MAP.e][event]) {
                _$e(this[PROP_MAP.e][event], function (handler) { handler(data); });
            }
        },
        $notify: function (key) {
            if (this[PROP_MAP.s][key]) {
                _$e(this[PROP_MAP.s][key], function (suscriber) { suscriber(); });
            }
        },
        $observe: function (deps, listener) {
            var _this = this;
            var subs = [];
            if (_$isArray(deps)) {
                _$e(deps, function (dep) {
                    subs.push({ sub: dep, i: _$subs.call(_this, dep, listener) });
                });
            }
            else {
                subs.push({ sub: deps, i: _$subs.call(this, deps, listener) });
            }
            return {
                $unobserve: function () {
                    _$e(subs, function (sub) {
                        _this[PROP_MAP.s][sub.sub].splice(sub.i, 1);
                    });
                }
            };
        },
        $watch: function (key, watcher) {
            var _this = this;
            if (!this[PROP_MAP.w][key]) {
                this[PROP_MAP.w][key] = [];
            }
            var i = this[PROP_MAP.w][key].push(watcher.bind(this));
            return {
                $unwatch: function () {
                    _this[PROP_MAP.w][key].splice(i - 1, 1);
                }
            };
        }
    });
    var array = Array[PROP_MAP.h];
    function _$toArgs(args, start) {
        if (start === void 0) { start = 0; }
        return array.slice.call(args, start);
    }
    function _$arrayValues(list, value, root, key) {
        array.push.apply(list, value.map(function (v, i) {
            if (list.length !== 0)
                i += list.length;
            return !(_$isType(v, _$List)) && _$isArray(v) ? new _$List(v, root, key + "." + i) : v;
        }));
    }
    function _$List(value, root, key) {
        var self = this;
        Array.apply(self, [value.length]);
        var desc = { writable: false, configurable: false, enumerable: false };
        _$def(self, '_key', _$assign({ value: key }, desc));
        _$def(self, '_root', _$assign({ value: root }, desc));
        _$arrayValues(self, value, root, key);
        desc.writable = true;
        _$def(self, 'length', _$assign({ value: self.length }, desc));
    }
    _$extends(_$List, Array);
    ['pop', 'push', 'reverse', 'shift', 'sort', 'fill', 'unshift', 'splice'].forEach(function (method) {
        _$List[PROP_MAP.h][method] = function () {
            var self = this;
            var old = self.slice();
            var result;
            if (method === 'push') {
                _$arrayValues(self, _$toArgs(arguments), self._root, self._key);
                result = self.length;
            }
            else {
                result = array[method].apply(self, arguments);
            }
            _$dispatch(self._root, self._key, old, self.slice());
            return result;
        };
    });
    _$List[PROP_MAP.h].pull = function (index) {
        var self = this;
        var items = _$toArgs(arguments, 1);
        var length = self.length;
        if (index > length) {
            length = index + 1;
            var pull = new Array(index - self.length);
            pull.push.apply(pull, items);
            for (var i = 0; i < length; i++) {
                if (i === index) {
                    self.push.apply(self, pull);
                }
            }
        }
        else {
            self.splice.apply(self, [index, 1].concat(items));
        }
    };
    function _$dispatch(root, key, oldVal, value) {
        root.$notify(key);
        if (root[PROP_MAP.w][key]) {
            _$e(root[PROP_MAP.w][key], function (watcher) { watcher(oldVal, value); });
        }
        root.$update();
    }
    function _$extends(ctor, exts) {
        ctor['plugin'] = function (fn, options) {
            TPS.push({ options: options, fn: fn });
        };
        ctor[PROP_MAP.h] = Object.create(exts[PROP_MAP.h]);
        ctor[PROP_MAP.h].constructor = ctor;
    }
    function _$isType(value, type) {
        return _$type(type) === 'string' ? type.split('|').some(function (t) { return t.trim() === _$type(value); }) : value instanceof type;
    }
    function _$isObject(obj) {
        return _$isType(obj, 'object');
    }
    function _$isArray(obj) {
        return Array.isArray ? Array.isArray(obj) : _$isType(obj, 'array');
    }
    function _$isFunction(obj) {
        return _$isType(obj, 'function');
    }
    function _$isStr(obj) {
        return _$isType(obj, 'string');
    }
    function _$toType(value, type, root, key) {
        switch (type) {
            case 'date':
                return new Date(value);
            case 'string':
                return _$toStr(value);
            case 'number':
                return +value;
            case 'boolean':
                return _$isStr(value) && !value ? true : !!value;
            case 'array':
                return _$isType(value, _$List) ? value : new _$List(value, root, key);
            default:
                return value;
        }
    }
    function _$type(obj) {
        return / (\w+)/.exec(({}).toString.call(obj))[1].toLowerCase();
    }
    function _$hasProp(obj, prop) {
        return obj.hasOwnProperty(prop);
    }
    function _$drt(dd) {
        var hasProp = function (prop, instance, options, element) { return _$isObject(dd) && dd[prop] && dd[prop](instance, options, element); };
        return {
            $init: function (instance, options, element) {
                hasProp('$init', instance, options, element);
            },
            $inserted: function (instance, options, element) {
                hasProp('$inserted', instance, options, element);
            },
            $update: function (instance, options, element) {
                if (_$isFunction(dd)) {
                    dd(instance, options, element);
                }
                else {
                    hasProp('$update', instance, options, element);
                }
            },
            $destroy: function (instance, options, element) {
                hasProp('$destroy', instance, options, element);
            }
        };
    }
    function _$noop() { }
    function _$add(inst, Child, attrs) {
        var child = null;
        if (Child) {
            child = new Child(attrs, inst);
            inst.$children.push(child);
        }
        return child;
    }
    function _$toStr(obj) {
        var str = _$type(obj);
        return !/null|undefined/.test(str) ? obj.toString() : str;
    }
    function _$toPlainObj(obj) {
        var data = {};
        _$e(_$isObject(obj) ? obj : {}, function (_v, k) {
            if (k[0] !== '$' && !_$isFunction(obj[k])) {
                if (_$isType(obj[k], _$List)) {
                    data[k] = obj[k].map(_$toPlainObj);
                }
                else if (_$isObject(obj[k])) {
                    data[k] = _$toPlainObj(obj[k]);
                }
                else {
                    data[k] = obj[k];
                }
            }
        });
        return _$isObject(obj) ? data : obj;
    }
    function _$setRef(obj, prop) {
        var value = [];
        _$def(obj, prop, {
            get: function () { return value.length <= 1 ? value[0] : value; },
            set: function (val) { val && !~value.indexOf(val) && value.push(val); },
            enumerable: true, configurable: true
        });
    }
    function _$accesor(object, path, value) {
        return path.split('.').reduce(function (obj, key, i, arr) {
            if (_$isType(value, 'undefined')) {
                if (obj == null) {
                    arr.splice(0, arr.length);
                    return i > 0 && obj === null ? obj : undefined;
                }
            }
            else {
                if (i === arr.length - 1) {
                    if (_$isType(obj, _$List) && _$toStr(+key) === key) {
                        obj.pull(+key, value);
                    }
                    else {
                        var oldVal = obj[key];
                        obj[key] = !_$isType(value, _$List) && _$isArray(value) ? new _$List(value, object, key) : value;
                        _$dispatch(object, path, oldVal, obj[key]);
                    }
                }
                else if (!_$isObject(obj[key])) {
                    obj[key] = {};
                }
            }
            return obj ? obj[key] : null;
        }, object);
    }
    function _$(selector, parent) {
        return _$isStr(selector) ? (parent || document).querySelector(selector) : selector;
    }
    function _$d() {
        return document.createDocumentFragment();
    }
    function _$a(parent, child, sibling) {
        if (_$isType(sibling, 'boolean') && sibling)
            parent.parentElement.replaceChild(child, parent);
        else if (!sibling)
            parent.appendChild(child);
        else
            parent.insertBefore(child, sibling);
    }
    function _$as(source, dest) {
        var childNodes = source.childNodes, attributes = source.attributes;
        for (var i = 0; i < childNodes.length; i++) {
            _$a(dest, childNodes[i]);
        }
        for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            dest.setAttributeNS(source.namespaceURI, attr.name, attr.value);
        }
        source.parentElement.replaceChild(dest, source);
        return dest;
    }
    function _$ce(tagName) {
        return document.createElement(tagName || 'div');
    }
    function _$ct(content) {
        return document.createTextNode(content || '');
    }
    function _$sa(el, attrOrBind) {
        var attr = attrOrBind[0], value = attrOrBind[1];
        el.setAttribute(attr, _$toStr(value));
        if (_$isValueAttr(attr) && !_$isStr(value))
            el[PROP_MAP._] = value;
    }
    function _$ga(el, attr) {
        return _$isValueAttr(attr) ? _$gv(el) : el.getAttribute(attr);
    }
    function _$gv(el) {
        return _$hasProp(el, PROP_MAP._) ? el[PROP_MAP._] : el[PROP_MAP.v];
    }
    function _$al(el, event, handler) {
        el.addEventListener(event, handler, false);
    }
    function _$ul(el, event, oldHandler, newHandler) {
        _$rl(el, event, oldHandler);
        _$al(el, event, oldHandler = newHandler);
        return oldHandler;
    }
    function _$rl(el, event, handler) {
        el.removeEventListener(event, handler, false);
    }
    function _$bc(value) {
        var classes = '';
        if (_$isStr(value)) {
            classes += " " + value;
        }
        else if (_$isArray(value)) {
            classes = value.map(_$bc).join(' ');
        }
        else if (_$isObject(value)) {
            for (var key in value)
                if (_$hasProp(value, key) && value[key])
                    classes += " " + key;
        }
        return classes.trim();
    }
    function _$bu(el, binding) {
        var attr = binding[0], value = binding[1];
        var _value = attr === 'checked' ? !!value : _$toStr(value);
        if (/value|checked/.test(attr)) {
            if (el[attr] !== _value)
                el[attr] = _$isValueAttr(attr) ? _value : value;
            el[PROP_MAP._] = _$isValueAttr(attr) ? value : el[PROP_MAP.v];
        }
        else if (_$ga(el, attr) !== _value) {
            _$sa(el, [attr, _value]);
        }
    }
    function _$tu(text, value) {
        if (text.data !== (value = _$toStr(value)))
            text.data = value;
    }
    function _$e(obj, cb) {
        for (var key in obj) {
            if (_$hasProp(obj, key)) {
                cb(obj[key], (isNaN(+key) ? key : +key));
            }
        }
    }

    function _$tplList(_$state, children) {
      var _$frag, h1_1, p_1, txt_1, strong_1, txt_2, setTxt_2, routerViewAnchor_1, routerView_1;
      _$frag = _$d();
      setTxt_2 = function(_$state) {
        return _$state.$route.path;
      };
      var RouterView = children['router-view'] || window['RouterView'];
      routerViewAnchor_1 = _$ct();
      routerView_1 = _$add(_$state, RouterView, {});
      return {
        $create: function() {
          h1_1 = _$ce('h1');
          h1_1.innerHTML = 'List Page';
          p_1 = _$ce('p');
          txt_1 = _$ct('You are in page ');
          strong_1 = _$ce('strong');
          txt_2 = _$ct();
          txt_2.data = setTxt_2(_$state);
          routerView_1.$create();
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$a(_$(parent), _$frag, _$(sibling));
          this.$siblingEl = _$(sibling);
          this.$parentEl = sibling && _$(sibling).parentElement || _$(parent);
        },

        $update: function(_$state) {
          _$tu(txt_2, setTxt_2(_$state));
          routerView_1 && routerView_1.$update();
        },

        $unmount: function() {
          _$a(_$frag, h1_1);
          _$a(p_1, txt_1);
          _$a(strong_1, txt_2);
          _$a(p_1, strong_1);
          _$a(_$frag, p_1);
          _$a(_$frag, routerViewAnchor_1);
          routerView_1.$mount(_$frag, routerViewAnchor_1);
        },

        $destroy: function() {
          this.$unmount();
          this.$parent = null;
          this.$parentEl = null;
          this.$siblingEl = null;
          this.$children.splice(0, this.$children.length);
          routerView_1 && routerView_1.$destroy();
          delete _$state.$root;
          _$frag = h1_1 = p_1 = txt_1 = strong_1 = txt_2 = setTxt_2 = routerViewAnchor_1 = routerView_1 = void 0;
        }
      };
    }
    function List(_$attrs, _$parent) {
      _$CompCtr.call(this, _$attrs, _$tplList, {}, _$parent);
      !_$parent && this.$create();
    }
    _$extends(List, _$CompCtr);

    function _$tplPage(_$state, children) {
      var _$frag, h1_1, txt_1, setTxt_1, p_1, txt_2, strong_1, txt_3, setTxt_3, routerViewAnchor_1, routerView_1, span_1, txt_4;
      _$frag = _$d();
      setTxt_1 = function() {
        return (name ? name + ' ' : '') + 'Page';
      };
      setTxt_3 = function(_$state) {
        return _$state.$route.path;
      };
      var RouterView = children['router-view'] || window['RouterView'];
      routerViewAnchor_1 = _$ct();
      routerView_1 = _$add(_$state, RouterView, {});
      if (routerView_1.$slots['default'] && routerView_1.$slots['default'].childNodes.length !== 0) {
        routerView_1.$slots['default'] = _$d();
      }
      return {
        $create: function() {
          h1_1 = _$ce('h1');
          txt_1 = _$ct();
          txt_1.data = setTxt_1(_$state);
          p_1 = _$ce('p');
          txt_2 = _$ct('PATH: ');
          strong_1 = _$ce('strong');
          txt_3 = _$ct();
          txt_3.data = setTxt_3(_$state);
          routerView_1.$create();
          span_1 = _$ce('span');
          txt_4 = _$ct('Default Child');
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$a(_$(parent), _$frag, _$(sibling));
          this.$siblingEl = _$(sibling);
          this.$parentEl = sibling && _$(sibling).parentElement || _$(parent);
        },

        $update: function(_$state) {
          _$tu(txt_1, setTxt_1(_$state));
          _$tu(txt_3, setTxt_3(_$state));
          routerView_1 && routerView_1.$update();
        },

        $unmount: function() {
          _$a(h1_1, txt_1);
          _$a(_$frag, h1_1);
          _$a(p_1, txt_2);
          _$a(strong_1, txt_3);
          _$a(p_1, strong_1);
          _$a(_$frag, p_1);
          _$a(_$frag, routerViewAnchor_1);
          _$a(span_1, txt_4);
          if (routerView_1.$slots['default']) {
            _$a(routerView_1.$slots['default'], span_1);
          }
          routerView_1.$mount(_$frag, routerViewAnchor_1);
        },

        $destroy: function() {
          this.$unmount();
          this.$parent = null;
          this.$parentEl = null;
          this.$siblingEl = null;
          this.$children.splice(0, this.$children.length);
          routerView_1 && routerView_1.$destroy();
          delete _$state.$root;
          _$frag = h1_1 = txt_1 = setTxt_1 = p_1 = txt_2 = strong_1 = txt_3 = setTxt_3 = routerViewAnchor_1 = routerView_1 = span_1 = txt_4 = void 0;
        }
      };
    }
    function Page(_$attrs, _$parent) {
      _$CompCtr.call(this, _$attrs, _$tplPage, {
        attrs: ['name']
      }, _$parent);
      !_$parent && this.$create();
    }
    _$extends(Page, _$CompCtr);

    function _$tplHome(_$state) {
      var _$frag, h1_1, p_1, txt_1, strong_1, txt_2, setTxt_2;
      _$frag = _$d();
      setTxt_2 = function(_$state) {
        return _$state.$route.path;
      };
      return {
        $create: function() {
          h1_1 = _$ce('h1');
          h1_1.innerHTML = 'Home Page';
          p_1 = _$ce('p');
          txt_1 = _$ct('You are in page ');
          strong_1 = _$ce('strong');
          txt_2 = _$ct();
          txt_2.data = setTxt_2(_$state);
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$a(_$(parent), _$frag, _$(sibling));
          this.$siblingEl = _$(sibling);
          this.$parentEl = sibling && _$(sibling).parentElement || _$(parent);
        },

        $update: function(_$state) {
          _$tu(txt_2, setTxt_2(_$state));
        },

        $unmount: function() {
          _$a(_$frag, h1_1);
          _$a(p_1, txt_1);
          _$a(strong_1, txt_2);
          _$a(p_1, strong_1);
          _$a(_$frag, p_1);
        },

        $destroy: function() {
          this.$unmount();
          this.$parent = null;
          this.$parentEl = null;
          this.$siblingEl = null;
          this.$children.splice(0, this.$children.length);
          delete _$state.$root;
          _$frag = h1_1 = p_1 = txt_1 = strong_1 = txt_2 = setTxt_2 = void 0;
        }
      };
    }
    function Home(_$attrs, _$parent) {
      _$CompCtr.call(this, _$attrs, _$tplHome, {}, _$parent);
      !_$parent && this.$create();
    }
    _$extends(Home, _$CompCtr);

    function _$tplAbout(_$state) {
      var _$frag, h1_1, p_1, txt_1, strong_1, txt_2, setTxt_2;
      _$frag = _$d();
      setTxt_2 = function(_$state) {
        return _$state.$route.path;
      };
      return {
        $create: function() {
          h1_1 = _$ce('h1');
          h1_1.innerHTML = 'About Page';
          p_1 = _$ce('p');
          txt_1 = _$ct('You are in page ');
          strong_1 = _$ce('strong');
          txt_2 = _$ct();
          txt_2.data = setTxt_2(_$state);
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$a(_$(parent), _$frag, _$(sibling));
          this.$siblingEl = _$(sibling);
          this.$parentEl = sibling && _$(sibling).parentElement || _$(parent);
        },

        $update: function(_$state) {
          _$tu(txt_2, setTxt_2(_$state));
        },

        $unmount: function() {
          _$a(_$frag, h1_1);
          _$a(p_1, txt_1);
          _$a(strong_1, txt_2);
          _$a(p_1, strong_1);
          _$a(_$frag, p_1);
        },

        $destroy: function() {
          this.$unmount();
          this.$parent = null;
          this.$parentEl = null;
          this.$siblingEl = null;
          this.$children.splice(0, this.$children.length);
          delete _$state.$root;
          _$frag = h1_1 = p_1 = txt_1 = strong_1 = txt_2 = setTxt_2 = void 0;
        }
      };
    }
    function About(_$attrs, _$parent) {
      _$CompCtr.call(this, _$attrs, _$tplAbout, {}, _$parent);
      !_$parent && this.$create();
    }
    _$extends(About, _$CompCtr);

    function _$tplDetails(_$state) {
      var _$frag, h1_1, p_1, txt_1, strong_1, txt_2, setTxt_2;
      _$frag = _$d();
      setTxt_2 = function(_$state) {
        return _$state.$route.path;
      };
      return {
        $create: function() {
          h1_1 = _$ce('h1');
          h1_1.innerHTML = 'Details Page';
          p_1 = _$ce('p');
          txt_1 = _$ct('You are in page ');
          strong_1 = _$ce('strong');
          txt_2 = _$ct();
          txt_2.data = setTxt_2(_$state);
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$a(_$(parent), _$frag, _$(sibling));
          this.$siblingEl = _$(sibling);
          this.$parentEl = sibling && _$(sibling).parentElement || _$(parent);
        },

        $update: function(_$state) {
          _$tu(txt_2, setTxt_2(_$state));
        },

        $unmount: function() {
          _$a(_$frag, h1_1);
          _$a(p_1, txt_1);
          _$a(strong_1, txt_2);
          _$a(p_1, strong_1);
          _$a(_$frag, p_1);
        },

        $destroy: function() {
          this.$unmount();
          this.$parent = null;
          this.$parentEl = null;
          this.$siblingEl = null;
          this.$children.splice(0, this.$children.length);
          delete _$state.$root;
          _$frag = h1_1 = p_1 = txt_1 = strong_1 = txt_2 = setTxt_2 = void 0;
        }
      };
    }
    function Details(_$attrs, _$parent) {
      _$CompCtr.call(this, _$attrs, _$tplDetails, {}, _$parent);
      !_$parent && this.$create();
    }
    _$extends(Details, _$CompCtr);

    function _$tplContact(_$state) {
      var _$frag, h1_1, p_1, txt_1, strong_1, txt_2, setTxt_2;
      _$frag = _$d();
      setTxt_2 = function(_$state) {
        return _$state.$route.path;
      };
      return {
        $create: function() {
          h1_1 = _$ce('h1');
          h1_1.innerHTML = 'Contact Page';
          p_1 = _$ce('p');
          txt_1 = _$ct('You are in page ');
          strong_1 = _$ce('strong');
          txt_2 = _$ct();
          txt_2.data = setTxt_2(_$state);
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$a(_$(parent), _$frag, _$(sibling));
          this.$siblingEl = _$(sibling);
          this.$parentEl = sibling && _$(sibling).parentElement || _$(parent);
        },

        $update: function(_$state) {
          _$tu(txt_2, setTxt_2(_$state));
        },

        $unmount: function() {
          _$a(_$frag, h1_1);
          _$a(p_1, txt_1);
          _$a(strong_1, txt_2);
          _$a(p_1, strong_1);
          _$a(_$frag, p_1);
        },

        $destroy: function() {
          this.$unmount();
          this.$parent = null;
          this.$parentEl = null;
          this.$siblingEl = null;
          this.$children.splice(0, this.$children.length);
          delete _$state.$root;
          _$frag = h1_1 = p_1 = txt_1 = strong_1 = txt_2 = setTxt_2 = void 0;
        }
      };
    }
    function Contact(_$attrs, _$parent) {
      _$CompCtr.call(this, _$attrs, _$tplContact, {}, _$parent);
      !_$parent && this.$create();
    }
    _$extends(Contact, _$CompCtr);

    function _$tplNotFound(_$state) {
      var _$frag, h1_1, p_1, button_1, txt_1, clickEvent_1, handlerClickEvent_1;
      _$frag = _$d();
      clickEvent_1 = function(_$state) {
        _$state.$route.back();
      };
      return {
        $create: function() {
          h1_1 = _$ce('h1');
          h1_1.innerHTML = 'Not Found Page';
          p_1 = _$ce('p');
          p_1.innerHTML = '\n  Somthing was wrong.\n';
          button_1 = _$ce('button');
          txt_1 = _$ct('Go Back');
          _$al(button_1, 'click', handlerClickEvent_1 = function(event) {
            clickEvent_1(_$state, event, button_1);
          });
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$a(_$(parent), _$frag, _$(sibling));
          this.$siblingEl = _$(sibling);
          this.$parentEl = sibling && _$(sibling).parentElement || _$(parent);
        },

        $update: _$noop,

        $unmount: function() {
          _$a(_$frag, h1_1);
          _$a(_$frag, p_1);
          _$a(button_1, txt_1);
          _$a(_$frag, button_1);
        },

        $destroy: function() {
          this.$unmount();
          this.$parent = null;
          this.$parentEl = null;
          this.$siblingEl = null;
          this.$children.splice(0, this.$children.length);
          _$rl(button_1, 'click', handlerClickEvent_1);
          delete _$state.$root;
          _$frag = h1_1 = p_1 = button_1 = txt_1 = clickEvent_1 = handlerClickEvent_1 = void 0;
        }
      };
    }
    function NotFound(_$attrs, _$parent) {
      _$CompCtr.call(this, _$attrs, _$tplNotFound, {}, _$parent);
      !_$parent && this.$create();
    }
    _$extends(NotFound, _$CompCtr);

    function _$tplRouterView(_$state) {
      var _$frag;
      _$frag = _$d();
      _$state.$slots['default'] = _$d();
      return {
        $create: _$noop,

        $mount: function(parent, sibling) {
          this.$unmount();
          _$a(_$(parent), _$frag, _$(sibling));
          this.$siblingEl = _$(sibling);
          this.$parentEl = sibling && _$(sibling).parentElement || _$(parent);
        },

        $update: _$noop,

        $unmount: function() {
          _$a(_$frag, _$state.$slots['default']);
        },

        $destroy: function() {
          this.$unmount();
          this.$parent = null;
          this.$parentEl = null;
          this.$siblingEl = null;
          this.$children.splice(0, this.$children.length);
          delete _$state.$root;
          _$frag = void 0;
        }
      };
    }
    function RouterView(_$attrs, _$parent) {
      _$CompCtr.call(this, _$attrs, _$tplRouterView, {
        attrs: {
          name: {
            type: 'string',
            default: 'default'
          }
        },

        beforeUnmount: function() {
          if (this.$slots.default.hasChildNodes() && this.$parent.$hasNext) {
            this.$slots.default = _$d();
          }
        }
      }, _$parent);
      !_$parent && this.$create();
    }
    _$extends(RouterView, _$CompCtr);

    var ROOT_MATCHER = /^\/$/, PATH_REPLACER = '([^\/\\?]+)', PATH_NAME_MATCHER = /:([\w\d]+)/g, PATH_EVERY_MATCHER = /\/\*(?!\*)/, PATH_EVERY_REPLACER = '\/([^\/\\?]+)', PATH_EVERY_GLOBAL_MATCHER = /\*{2}/, PATH_EVERY_GLOBAL_REPLACER = '(.*?)\\??', LEADING_BACKSLASHES_MATCH = /\/*$/;
    function clearSlashes(path) {
        return path.replace(LEADING_BACKSLASHES_MATCH, '');
    }
    function pathToRegExp(path, modifier) {
        if (modifier === void 0) { modifier = ''; }
        return !path ? ROOT_MATCHER : new RegExp(path
            .replace(PATH_NAME_MATCHER, PATH_REPLACER)
            .replace(PATH_EVERY_MATCHER, PATH_EVERY_REPLACER)
            .replace(PATH_EVERY_GLOBAL_MATCHER, PATH_EVERY_GLOBAL_REPLACER) + '(?:\\?.+)?$', modifier);
    }
    function toInternalRoute(route, modifier) {
        if (modifier === void 0) { modifier = ''; }
        var path = route.path, component = route.component;
        var match, params = [];
        var _component = function (ins) {
            var _this = this;
            var view = this._parent.$children
                .filter(function (c) { return c instanceof RouterView && c.name === _this.view; })[0];
            if (view) {
                component.prototype.$route = ins;
                var hasNext = this._hasNext && !this.path.test(ins.path);
                if (!this._instance) {
                    var instance = new component(route.attrs);
                    instance.$hasNext = hasNext;
                    view.$parentEl = view.$siblingEl && view.$siblingEl.parentElement || view.$parentEl;
                    instance.$mount(view.$parentEl, view.$siblingEl);
                    this._instance = instance;
                }
                else {
                    var instance = this._instance;
                    instance.$hasNext = hasNext;
                    var $parentEl = instance.$parentEl, $siblingEl = instance.$siblingEl;
                    instance.$unmount();
                    instance.$mount($parentEl, $siblingEl);
                    instance.$update();
                }
            }
        };
        var intRoute = Object.assign({}, route, { _path: '', _params: [], _component: _component });
        if (typeof path === 'string') {
            path = clearSlashes(path);
            intRoute._path = path || '/';
            while ((match = PATH_NAME_MATCHER.exec(path)) !== null)
                params.push(match[1]);
            path = pathToRegExp(path, modifier);
        }
        intRoute.path = path;
        intRoute._params = params;
        intRoute.state = intRoute.state || {};
        intRoute.view = intRoute.view || 'default';
        if (intRoute.hooks && intRoute.hooks.leave) {
            var leave_1 = intRoute.hooks.leave;
            intRoute.hooks.leave = function (ins) {
                leave_1(ins);
                if (intRoute._instance) {
                    intRoute._instance.$destroy();
                    delete intRoute._instance;
                }
            };
        }
        else {
            (intRoute.hooks = intRoute.hooks || {}).leave = function () {
                if (intRoute._instance) {
                    intRoute._instance.$destroy();
                    delete intRoute._instance;
                }
            };
        }
        return intRoute;
    }
    function toPlainRoutes(router, route, routes, modifier) {
        if (modifier === void 0) { modifier = ''; }
        var children = route.children;
        if (children && children.length !== 0) {
            delete route.children;
            var _component_1 = route._component;
            route._component = function (ins, next) {
                route._hasNext = true;
                _component_1.call(route, ins);
                next && next();
            };
            children.forEach(function (child) {
                if (child.name && route.name)
                    child.name = [route.name, child.name].join('.');
                if (typeof child.path === 'string')
                    child.path = [route._path, child.path.replace(/^\//, '')].join('/');
                var subRoute = toInternalRoute(child, modifier);
                routes.push(subRoute);
                subRoute._root = route;
                if (subRoute._path !== route._path) {
                    var _component_2 = subRoute._component;
                    subRoute._component = function (to, next) {
                        route._parent = subRoute._parent;
                        manageHooks(function () {
                            route._component(to, next);
                            subRoute._parent = route._instance;
                            _component_2.call(subRoute, to, next);
                        }, { from: route._route, to: to }, route.hooks);
                    };
                }
                toPlainRoutes(router, subRoute, routes);
            });
        }
    }
    function onChange(router) {
        setTimeout(function () { router.route(); }, 0);
    }
    function getHashRegExp(hash) {
        return new RegExp(hash + "(.*)$");
    }
    function callLeave(route, ins) {
        if (route) {
            route.hooks && route.hooks.leave && route.hooks.leave(ins);
            callLeave(route._root, ins);
        }
    }
    function manageHooks(handler, route, hooks) {
        if (typeof hooks === 'object') {
            if (hooks.before) {
                hooks.before(route, function () {
                    handler();
                    hooks.after && hooks.after(route);
                });
                return;
            }
            else if (hooks.after) {
                handler();
                hooks.after(route);
                return;
            }
        }
        handler();
    }
    function buildRoute(router, path) {
        path = path || '/';
        return {
            path: path,
            router: router,
            query: {},
            state: {},
            params: {},
            go: function (path) {
                switch (typeof path) {
                    case 'number':
                        history && history.go(path);
                        break;
                    case 'object':
                        var _a = path, name_1 = _a.name, params = _a.params, query = _a.query;
                        navigate(router, generateUrl(router, { name: name_1, params: params, query: query }));
                        break;
                    default:
                        navigate(router, path);
                        break;
                }
            },
            back: function (distance) {
                history && history.back(distance);
            },
            forward: function (distance) {
                history && history.forward(distance);
            },
            get: function (key, default_value) {
                return (this.params && this.params[key] !== undefined) ?
                    this.params[key] : (this.query && this.query[key] !== undefined) ?
                    this.query[key] : (default_value !== undefined) ? default_value : undefined;
            }
        };
    }
    function navigate(router, path) {
        path = path || router.url;
        if (router.mode === 'history') {
            history.pushState(null, '', router.root + clearSlashes(path).replace(/^\//, ''));
            onChange(router);
        }
        else {
            var href = window.location.href.replace(getHashRegExp(router.hash), '');
            var to = "" + href + router.hash + path.replace(router.hash, '');
            if (window.location.href !== to) {
                window.location.href = to;
            }
            else {
                onChange(router);
            }
        }
    }
    function generateUrl(router, _a) {
        var name = _a.name, _b = _a.params, params = _b === void 0 ? {} : _b, query = _a.query;
        var result = '';
        var route = router['_routes'].filter(function (route) { return route.name === name; })[0];
        if (route) {
            result = route._path;
            for (var key in params)
                result = result.replace(":" + key, params[key]);
            if (query && typeof query === 'object') {
                var getParams = [];
                for (var key in query)
                    getParams.push(key + "=" + encodeURI(query[key]));
                result += "?" + getParams.join('&');
            }
        }
        result = result || '/';
        return router.mode === 'hash' ? "" + router.hash + result : result;
    }

    function _$tplRouteLink(_$state) {
      var _$frag, _$node_1, setTag_$node_1, _refs, clickEvent_1, handlerClickEvent_1, bindClass_$node_1;
      _$frag = _$d();
      setTag_$node_1 = function(_$state) {
        return _$state.tag;
      };
      _$state.$slots['default'] = _$d();
      _refs = _$state.$refs;
      clickEvent_1 = function(_$state, $event) {
        _$state._navigate($event);
      };
      bindClass_$node_1 = function(_$state) {
        var _a;
        return ['class', _$bc([
          _$state.classes,
          (_a = {}, _a[_$state.activeClass] = _$state._url === _$state._path, _a)
        ]).trim()];
      };
      return {
        $create: function() {
          _$node_1 = _$ce(setTag_$node_1(_$state));
          !_refs['link'] && _$setRef(_refs, 'link');
          _refs['link'] = _$node_1;
          _$al(_$node_1, 'click', handlerClickEvent_1 = function(event) {
            event.preventDefault();
            clickEvent_1(_$state, event, _$node_1);
          });
          _$sa(_$node_1, bindClass_$node_1(_$state));
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$a(_$(parent), _$frag, _$(sibling));
          this.$siblingEl = _$(sibling);
          this.$parentEl = sibling && _$(sibling).parentElement || _$(parent);
        },

        $update: function(_$state) {
          var updateTag_$node_1 = setTag_$node_1(_$state);
          if (updateTag_$node_1.toUpperCase() !== _$node_1.tagName) {
            _$node_1 = _$as(_$node_1, _$ce(updateTag_$node_1));
          }
          updateTag_$node_1 = void 0;
          handlerClickEvent_1 = _$ul(_$node_1, 'click', handlerClickEvent_1, function(event) {
            event.preventDefault();
            clickEvent_1(_$state, event, _$node_1);
          });
          _$bu(_$node_1, bindClass_$node_1(_$state));
        },

        $unmount: function() {
          _$a(_$node_1, _$state.$slots['default']);
          _$a(_$frag, _$node_1);
        },

        $destroy: function() {
          this.$unmount();
          this.$parent = null;
          this.$parentEl = null;
          this.$siblingEl = null;
          this.$children.splice(0, this.$children.length);
          if (_$isType(_refs['link'], 'array')) {
            var index_$node_1 = _refs['link'].indexOf(_$node_1);
            _refs['link'].splice(index_$node_1, 1);
          } else {
            delete _refs['link'];
          }
          _$rl(_$node_1, 'click', handlerClickEvent_1);
          delete _$state.$root;
          _$frag = _$node_1 = setTag_$node_1 = _refs = clickEvent_1 = handlerClickEvent_1 = bindClass_$node_1 = void 0;
        }
      };
    }
    function RouteLink(_$attrs, _$parent) {
      _$CompCtr.call(this, _$attrs, _$tplRouteLink, {
        attrs: {
          to: {
            required: true,
            type: 'string | object'
          },

          tag: {
            default: 'a',
            type: 'string'
          },

          class: {
            default: '',
            type: 'string'
          },

          activeClass: {
            type: 'string',
            default: 'link-active'
          }
        },

        afterMount: function() {
          var _this = this;
          this._classes = this.class;
          this._url = this.$router.url;
          this._path = typeof this.to === 'string' ? this.to : generateUrl(this.$router, this.to);
          if (this.tag === 'a') {
            var link = this.$refs.link;
            link.setAttribute('href', this._path);
          }
          this.$router.onUrlChange(function() {
            _this.$set('_url', _this.$router.url);
          });
          this.$update();
        },

        model: {
          _url: '',
          _path: '',
          _classes: '',

          _navigate: function(e) {
            navigate(this.$router, this._path);
            this.$fire('click', e);
          }
        }
      }, _$parent);
      !_$parent && this.$create();
    }
    _$extends(RouteLink, _$CompCtr);

    var Router = (function () {
        function Router(options) {
            var _this = this;
            this._routes = [];
            this._mode = 'hash';
            this._prev = null;
            this._default = null;
            this._notFound = null;
            this._hooks = {};
            this._onChange = [];
            this._redirects = [];
            this._hash = options.hash || '#';
            this._listener = function () { _this._onLocationChange(); };
            this._root = options.root ? clearSlashes(options.root) + "/" : '/';
            this._mode = options.mode === 'history' && !!(history.pushState) ? 'history' : 'hash';
            this._routes = options.routes.reduce(function (routes, _a, i) {
                var path = _a.path;
                var modifier = options.ignoreCase ? 'i' : '';
                var route = toInternalRoute(options.routes[i], modifier);
                if (typeof path === 'string' && (path === '' || path === '/')) {
                    _this._default = route;
                }
                else if (!path) {
                    _this._notFound = route;
                }
                else {
                    routes.push(route);
                    toPlainRoutes(_this, route, routes, modifier);
                }
                return routes;
            }, []);
            this._listen();
        }
        Router.prototype._getFragment = function () {
            var root = '/';
            var url = root;
            if (this._mode === 'history') {
                url = clearSlashes(decodeURI(location.pathname + location.search));
                url = url.replace(/\?(.*)$/, '');
                url = this._root !== root ? url.replace(this._root, '') : url;
            }
            else {
                var match = window.location.href.match(getHashRegExp(this._hash));
                url = match ? match[1] : root;
            }
            return clearSlashes(url) || root;
        };
        Router.prototype._buildRouteObject = function (url, params, state) {
            if (url == null)
                throw new Error('Unable to compile request object');
            var route = buildRoute(this, url);
            if (state)
                route.state = state;
            if (params)
                route.params = params;
            var completeFragment = url.split('?');
            if (completeFragment.length === 2) {
                route.query = {};
                var queryString = completeFragment[1].split('&');
                for (var i = 0, len = queryString.length; i < len; i++) {
                    var _a = queryString[i].split('='), key = _a[0], value = _a[1];
                    route.query[decodeURI(key)] = decodeURI(value.replace(/\+/g, '%20'));
                }
            }
            return route;
        };
        Router.prototype._matchedRoute = function (url, index) {
            if (typeof index === 'number') {
                return this._routes[index];
            }
            else if (url === '/' && this._default) {
                return this._default;
            }
            else if (this._notFound) {
                return this._notFound;
            }
            return null;
        };
        Router.prototype._fallowRoute = function (url, indexes) {
            var _this = this;
            var index = indexes.shift();
            var route = this._matchedRoute(url, index);
            if (route) {
                var hasNext_1 = indexes.length !== 0;
                var params = {};
                var match = url.match(route.path);
                var _params = route._params;
                for (var i = 0; i < _params.length; i++) {
                    params[_params[i]] = match[i + 1];
                }
                var to_1 = this._buildRouteObject(url, params, route.state);
                var ins_1 = { to: to_1 };
                var prev_1 = this._prev;
                if (prev_1) {
                    ins_1.from = prev_1._route;
                    if (prev_1._path === url) {
                        var hooks = prev_1.hooks;
                        hooks && hooks.already && hooks.already(to_1);
                    }
                }
                this._prev = route;
                route._route = hasNext_1 ? ins_1.from : to_1;
                return function (parent) {
                    route._parent = parent;
                    manageHooks(function () {
                        manageHooks(function () {
                            route._root !== prev_1 && callLeave(prev_1, ins_1);
                            route._component.call(route, to_1, function (err) {
                                if (err)
                                    throw err;
                                hasNext_1 && _this._fallowRoute(url, indexes)(route._instance);
                            });
                        }, ins_1, route.hooks);
                    }, ins_1, !hasNext_1 && _this._hooks);
                };
            }
            else {
                return function () {
                    console.warn("Error code(404): Unmatched route for url '" + url + "'.");
                };
            }
        };
        Router.prototype._onLocationChange = function () {
            this.route();
        };
        Router.prototype._listen = function () {
            if (this._mode === 'history') {
                window.addEventListener('popstate', this._listener);
            }
            else {
                window.addEventListener('hashchange', this._listener);
            }
        };
        Object.defineProperty(Router.prototype, "mode", {
            get: function () {
                return this._mode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "hash", {
            get: function () {
                return this._hash;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "root", {
            get: function () {
                return this._root;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "url", {
            get: function () {
                return this._getFragment();
            },
            enumerable: true,
            configurable: true
        });
        Router.plugin = function (Ctor) {
            var $options = this.$options;
            $options.children['route-link'] = RouteLink;
            $options.children['router-view'] = RouterView;
            if ($options.router && !this.$route) {
                var router_1 = $options.router;
                router_1._component = this;
                Object.defineProperty(Ctor.prototype, '$router', {
                    get: function () { return router_1; }, enumerable: true, configurable: true
                });
                if ($options.afterMount) {
                    var afterMount_1 = $options.afterMount;
                    $options.afterMount = function () {
                        afterMount_1.call(this);
                        navigate(this.$router);
                    };
                }
                else {
                    $options.afterMount = function () {
                        navigate(this.$router);
                    };
                }
                if ($options.afterDestroy) {
                    var afterDestroy_1 = $options.afterDestroy;
                    $options.afterDestroy = function () {
                        afterDestroy_1.call(this);
                        this.$router.destroy();
                    };
                }
                else {
                    $options.afterDestroy = function () {
                        this.$router.destroy();
                    };
                }
            }
        };
        Router.prototype.onUrlChange = function (listener) {
            this._onChange.push(listener);
        };
        Router.prototype.route = function () {
            var url = this.url;
            var redirect;
            var indexes = [];
            for (var i = 0; i < this._redirects.length; i++) {
                var path = this._redirects[i].from;
                if (path.test(url)) {
                    redirect = this._redirects[i].to;
                    i = this._redirects.length;
                }
            }
            if (typeof redirect === 'string') {
                navigate(this, redirect);
            }
            else {
                for (var i = 0; i < this._routes.length; i++) {
                    var path = this._routes[i].path;
                    if (path.test(url)) {
                        indexes.push(i);
                    }
                }
                this._fallowRoute(url, indexes)(this._component);
                this._onChange.forEach(function (l) { l(); });
            }
        };
        Router.prototype.beforeEach = function (handler) {
            handler && (this._hooks.before = handler);
        };
        Router.prototype.afterEach = function (handler) {
            handler && (this._hooks.after = handler);
        };
        Router.prototype.redirect = function (paths) {
            if (typeof paths === 'object') {
                for (var key in paths) {
                    if (paths.hasOwnProperty(key)) {
                        var path = paths[key];
                        var to = typeof path === 'string' ? path : generateUrl(this, path);
                        this._redirects.push({ from: pathToRegExp(key), to: to });
                    }
                }
            }
        };
        Router.prototype.destroy = function () {
            this._root = '/';
            this._hash = '#';
            this._routes = [];
            this._mode = 'hash';
            window.removeEventListener('popstate', this._listener);
            window.removeEventListener('hashchange', this._listener);
        };
        return Router;
    }());

    let router = new Router({
      // hash: '#!',
      mode: 'history',
      routes: [
        { path: '/home', name: 'home', component: Home },
        {
          path: '/list/:author', name: 'list', component: List, children: [
            { path: '/', name: 'home', component: Page, attrs: { name: 'Home' } },
            { path: '/edit', name: 'edit', component: Page, attrs: { name: 'Edit' } },
            {
              path: '/details', name: 'view', component: Page, attrs: { name: 'View' }, children: [
                { path: '/:id', name: 'details', component: Details }
              ]
            }
          ]
        },
        { path: '/contact', name: 'contact', component: Contact },
        { path: '/about', name: 'about', component: About },
        { name: 'notFound', component: NotFound }
      ]
    });

    router.redirect({
      '/': { name: 'home' }
    });

    function _$tplApp(_$state, children) {
      var _$frag, routeLinkAnchor_1, routeLink_1, txt_1, txt_2, routeLinkAnchor_2, routeLink_2, txt_3, txt_4, routeLinkAnchor_3, routeLink_3, txt_5, txt_6, routeLinkAnchor_4, routeLink_4, txt_7, txt_8, routeLinkAnchor_5, routeLink_5, txt_9, txt_10, routeLinkAnchor_6, routeLink_6, txt_11, txt_12, routeLinkAnchor_7, routeLink_7, txt_13, hr_1, routerViewAnchor_1, routerView_1;
      _$frag = _$d();
      var RouteLink = children['route-link'] || window['RouteLink'];
      routeLinkAnchor_1 = _$ct();
      routeLink_1 = _$add(_$state, RouteLink, {
        to: function() {
          return {
            name: 'home'
          };
        },

        redirect: '/home'
      });
      if (routeLink_1.$slots['default'] && routeLink_1.$slots['default'].childNodes.length !== 0) {
        routeLink_1.$slots['default'] = _$d();
      }
      routeLinkAnchor_2 = _$ct();
      routeLink_2 = _$add(_$state, RouteLink, {
        to: function() {
          return {
            name: 'list',

            params: {
              author: 'robert'
            }
          };
        }
      });
      if (routeLink_2.$slots['default'] && routeLink_2.$slots['default'].childNodes.length !== 0) {
        routeLink_2.$slots['default'] = _$d();
      }
      routeLinkAnchor_3 = _$ct();
      routeLink_3 = _$add(_$state, RouteLink, {
        to: function() {
          return {
            name: 'list.edit',

            params: {
              author: 'robert'
            }
          };
        }
      });
      if (routeLink_3.$slots['default'] && routeLink_3.$slots['default'].childNodes.length !== 0) {
        routeLink_3.$slots['default'] = _$d();
      }
      routeLinkAnchor_4 = _$ct();
      routeLink_4 = _$add(_$state, RouteLink, {
        to: function() {
          return {
            name: 'list.view',

            params: {
              author: 'robert'
            }
          };
        }
      });
      if (routeLink_4.$slots['default'] && routeLink_4.$slots['default'].childNodes.length !== 0) {
        routeLink_4.$slots['default'] = _$d();
      }
      routeLinkAnchor_5 = _$ct();
      routeLink_5 = _$add(_$state, RouteLink, {
        to: function() {
          return {
            name: 'list.view.details',

            params: {
              author: 'robert',
              id: 4
            }
          };
        }
      });
      if (routeLink_5.$slots['default'] && routeLink_5.$slots['default'].childNodes.length !== 0) {
        routeLink_5.$slots['default'] = _$d();
      }
      routeLinkAnchor_6 = _$ct();
      routeLink_6 = _$add(_$state, RouteLink, {
        to: function() {
          return {
            name: 'contact'
          };
        }
      });
      if (routeLink_6.$slots['default'] && routeLink_6.$slots['default'].childNodes.length !== 0) {
        routeLink_6.$slots['default'] = _$d();
      }
      routeLinkAnchor_7 = _$ct();
      routeLink_7 = _$add(_$state, RouteLink, {
        to: function() {
          return {
            name: 'about'
          };
        }
      });
      if (routeLink_7.$slots['default'] && routeLink_7.$slots['default'].childNodes.length !== 0) {
        routeLink_7.$slots['default'] = _$d();
      }
      var RouterView = children['router-view'] || window['RouterView'];
      routerViewAnchor_1 = _$ct();
      routerView_1 = _$add(_$state, RouterView, {});
      return {
        $create: function() {
          routeLink_1.$create();
          txt_1 = _$ct('Home ');
          txt_2 = _$ct('| ');
          routeLink_2.$create();
          txt_3 = _$ct('List ');
          txt_4 = _$ct('| ');
          routeLink_3.$create();
          txt_5 = _$ct('List Edit ');
          txt_6 = _$ct('| ');
          routeLink_4.$create();
          txt_7 = _$ct('List View ');
          txt_8 = _$ct('| ');
          routeLink_5.$create();
          txt_9 = _$ct('List Details ');
          txt_10 = _$ct('| ');
          routeLink_6.$create();
          txt_11 = _$ct('Contact ');
          txt_12 = _$ct('| ');
          routeLink_7.$create();
          txt_13 = _$ct('About');
          hr_1 = _$ce('hr');
          hr_1.innerHTML = '';
          routerView_1.$create();
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$a(_$(parent), _$frag, _$(sibling));
          this.$siblingEl = _$(sibling);
          this.$parentEl = sibling && _$(sibling).parentElement || _$(parent);
        },

        $update: function() {
          routeLink_1 && routeLink_1.$update();
          routeLink_2 && routeLink_2.$update();
          routeLink_3 && routeLink_3.$update();
          routeLink_4 && routeLink_4.$update();
          routeLink_5 && routeLink_5.$update();
          routeLink_6 && routeLink_6.$update();
          routeLink_7 && routeLink_7.$update();
          routerView_1 && routerView_1.$update();
        },

        $unmount: function() {
          _$a(_$frag, routeLinkAnchor_1);
          if (routeLink_1.$slots['default']) {
            _$a(routeLink_1.$slots['default'], txt_1);
          }
          routeLink_1.$mount(_$frag, routeLinkAnchor_1);
          _$a(_$frag, txt_2);
          _$a(_$frag, routeLinkAnchor_2);
          if (routeLink_2.$slots['default']) {
            _$a(routeLink_2.$slots['default'], txt_3);
          }
          routeLink_2.$mount(_$frag, routeLinkAnchor_2);
          _$a(_$frag, txt_4);
          _$a(_$frag, routeLinkAnchor_3);
          if (routeLink_3.$slots['default']) {
            _$a(routeLink_3.$slots['default'], txt_5);
          }
          routeLink_3.$mount(_$frag, routeLinkAnchor_3);
          _$a(_$frag, txt_6);
          _$a(_$frag, routeLinkAnchor_4);
          if (routeLink_4.$slots['default']) {
            _$a(routeLink_4.$slots['default'], txt_7);
          }
          routeLink_4.$mount(_$frag, routeLinkAnchor_4);
          _$a(_$frag, txt_8);
          _$a(_$frag, routeLinkAnchor_5);
          if (routeLink_5.$slots['default']) {
            _$a(routeLink_5.$slots['default'], txt_9);
          }
          routeLink_5.$mount(_$frag, routeLinkAnchor_5);
          _$a(_$frag, txt_10);
          _$a(_$frag, routeLinkAnchor_6);
          if (routeLink_6.$slots['default']) {
            _$a(routeLink_6.$slots['default'], txt_11);
          }
          routeLink_6.$mount(_$frag, routeLinkAnchor_6);
          _$a(_$frag, txt_12);
          _$a(_$frag, routeLinkAnchor_7);
          if (routeLink_7.$slots['default']) {
            _$a(routeLink_7.$slots['default'], txt_13);
          }
          routeLink_7.$mount(_$frag, routeLinkAnchor_7);
          _$a(_$frag, hr_1);
          _$a(_$frag, routerViewAnchor_1);
          routerView_1.$mount(_$frag, routerViewAnchor_1);
        },

        $destroy: function() {
          this.$unmount();
          this.$parent = null;
          this.$parentEl = null;
          this.$siblingEl = null;
          this.$children.splice(0, this.$children.length);
          routeLink_1 && routeLink_1.$destroy();
          routeLink_2 && routeLink_2.$destroy();
          routeLink_3 && routeLink_3.$destroy();
          routeLink_4 && routeLink_4.$destroy();
          routeLink_5 && routeLink_5.$destroy();
          routeLink_6 && routeLink_6.$destroy();
          routeLink_7 && routeLink_7.$destroy();
          routerView_1 && routerView_1.$destroy();
          delete _$state.$root;
          _$frag = routeLinkAnchor_1 = routeLink_1 = txt_1 = txt_2 = routeLinkAnchor_2 = routeLink_2 = txt_3 = txt_4 = routeLinkAnchor_3 = routeLink_3 = txt_5 = txt_6 = routeLinkAnchor_4 = routeLink_4 = txt_7 = txt_8 = routeLinkAnchor_5 = routeLink_5 = txt_9 = txt_10 = routeLinkAnchor_6 = routeLink_6 = txt_11 = txt_12 = routeLinkAnchor_7 = routeLink_7 = txt_13 = hr_1 = routerViewAnchor_1 = routerView_1 = void 0;
        }
      };
    }
    function App(_$attrs, _$parent) {
      _$CompCtr.call(this, _$attrs, _$tplApp, {
        router: router
      }, _$parent);
      !_$parent && this.$create();
    }
    _$extends(App, _$CompCtr);

    App.plugin(Router.plugin);

    let app = new App();

    app.$mount('main');

})));
