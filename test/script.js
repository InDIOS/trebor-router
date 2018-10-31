(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (factory());
}(this, (function () { 'use strict';

    var PROPS = ['$slots', '$refs', '$filters', '$directives', '_events', '_watchers'];
    var PROP_MAP = { p: '__TP__', v: 'value', _: '_value', s: '_subscribers', e: '_events', w: '_watchers', h: 'prototype' };
    var TPS = window[PROP_MAP.p] || (window[PROP_MAP.p] = []);

    function _$select(selector, parent) {
        return _$isString(selector) ? (parent || document).querySelector(selector) : selector;
    }
    function _$docFragment() {
        return document.createDocumentFragment();
    }
    function _$append(parent, child, sibling) {
        if (_$isType(sibling, 'boolean') && sibling)
            parent.parentElement.replaceChild(child, parent);
        else if (!sibling)
            parent.appendChild(child);
        else
            parent.insertBefore(child, sibling);
    }
    function _$assignEl(source, dest) {
        var childNodes = source.childNodes, attributes = source.attributes;
        for (var i = 0; i < childNodes.length; i++) {
            _$append(dest, childNodes[i]);
        }
        for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            dest.setAttributeNS(source.namespaceURI, attr.name, attr.value);
        }
        source.parentElement.replaceChild(dest, source);
        return dest;
    }
    function _$el(tagName) {
        return document.createElement(tagName || 'div');
    }
    function _$text(content) {
        return document.createTextNode(content || '');
    }
    function _$setAttr(el, attrAndValue) {
        var attr = attrAndValue[0], value = attrAndValue[1];
        el.setAttribute(attr, _$toString(value));
        if (_$isValueAttr(attr) && !_$isString(value))
            el[PROP_MAP._] = value;
    }
    function _$getAttr(el, attr) {
        return _$isValueAttr(attr) ? _$getValue(el) : el.getAttribute(attr);
    }
    function _$getValue(el) {
        return _$hasProp(el, PROP_MAP._) ? el[PROP_MAP._] : el[PROP_MAP.v];
    }
    function _$addListener(el, event, handler) {
        el.addEventListener(event, handler, false);
    }
    function _$updateListener(el, event, oldHandler, newHandler) {
        _$removeListener(el, event, oldHandler);
        _$addListener(el, event, oldHandler = newHandler);
        return oldHandler;
    }
    function _$removeListener(el, event, handler) {
        el.removeEventListener(event, handler, false);
    }

    function _$toLowerCase(str) {
        return str.toLowerCase();
    }
    var _$assign = Object['assign'] || function (t) {
        for (var s = void 0, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (_$hasProp(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    function _$isValueAttr(attr) {
        return attr === 'value';
    }
    function _$subscribers(dep, listener) {
        if (!this[PROP_MAP.s][dep]) {
            this[PROP_MAP.s][dep] = [];
        }
        return this[PROP_MAP.s][dep].push(listener.bind(this)) - 1;
    }
    function _$define(obj, key, desc) {
        Object.defineProperty(obj, key, desc);
    }
    function _$dispatch(root, key, oldVal, value) {
        root.$notify(key);
        if (root[PROP_MAP.w][key]) {
            _$each(root[PROP_MAP.w][key], function (watcher) { watcher(oldVal, value); });
        }
        root.$update();
    }
    function _$extends(ctor, exts) {
        ctor[PROP_MAP.h] = Object.create(exts[PROP_MAP.h]);
        ctor[PROP_MAP.h].constructor = ctor;
    }
    function _$isType(value, type) {
        return _$type(type) === 'string' ? type.split('\|').some(function (t) { return t.trim() === _$type(value); }) : value instanceof type;
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
    function _$isString(obj) {
        return _$isType(obj, 'string');
    }
    function _$toType(value, type, root, key) {
        switch (type) {
            case 'date':
                return new Date(value);
            case 'string':
                return _$toString(value);
            case 'number':
                return +value;
            case 'boolean':
                return _$isString(value) && !value ? true : !!value;
            case 'array':
                return _$isType(value, _$List) ? value : new _$List(value, root, key);
            default:
                return value;
        }
    }
    function _$type(obj) {
        return _$toLowerCase(/ (\w+)/.exec({}.toString.call(obj))[1]);
    }
    function _$hasProp(obj, prop) {
        return obj.hasOwnProperty(prop);
    }
    function _$directive(dd) {
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
    function _$addChild(inst, Child, attrs) {
        var child = null;
        if (Child) {
            child = new Child(attrs, inst);
            inst.$children.push(child);
        }
        return child;
    }
    function _$toString(obj) {
        var str = _$type(obj);
        return !/null|undefined/.test(str) ? obj.toString() : str;
    }
    function _$toPlainObject(obj) {
        var data = {};
        _$each(_$isObject(obj) ? obj : {}, function (_v, k) {
            if (k[0] !== '$' && !_$isFunction(obj[k])) {
                if (_$isType(obj[k], _$List)) {
                    data[k] = obj[k].map(_$toPlainObject);
                }
                else if (_$isObject(obj[k])) {
                    data[k] = _$toPlainObject(obj[k]);
                }
                else {
                    data[k] = obj[k];
                }
            }
        });
        return _$isObject(obj) ? data : obj;
    }
    function _$setReference(refs, prop, node) {
        if (!_$hasProp(refs, prop)) {
            var value_1 = [];
            _$define(refs, prop, {
                get: function () { return value_1.length <= 1 ? value_1[0] : value_1; },
                set: function (val) { val && !~value_1.indexOf(val) && value_1.push(val); },
                enumerable: true, configurable: true
            });
        }
        refs[prop] = node;
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
                    if (_$isType(obj, _$List) && _$toString(+key) === key) {
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
    function _$emptySlot(inst, slot) {
        var slots = inst.$slots;
        return slots[slot] && !slots[slot].hasChildNodes() ? (slots[slot] = _$docFragment()) : null;
    }
    function _$declareSlots($slots, slots) {
        _$each(slots, function (slot) { $slots[slot] = _$docFragment(); });
    }
    function _$bindClasses(value) {
        var classes = '';
        if (_$isString(value)) {
            classes += " " + value;
        }
        else if (_$isArray(value)) {
            classes = value.map(_$bindClasses).join(' ');
        }
        else if (_$isObject(value)) {
            for (var key in value)
                if (_$hasProp(value, key) && value[key])
                    classes += " " + key;
        }
        return classes.trim();
    }
    function _$bindUpdate(el, binding) {
        var attr = binding[0], value = binding[1];
        var _value = _$toString(value);
        if (_$isValueAttr(attr)) {
            if (el[attr] !== _value)
                el[attr] = _value;
            el[PROP_MAP._] = value;
        }
        else if (_$getAttr(el, attr) !== _value) {
            _$setAttr(el, [attr, _value]);
        }
    }
    function _$textUpdate(text, value) {
        if (text.data !== (value = _$toString(value)))
            text.data = value;
    }
    function _$tagUpdate(node, tag) {
        return _$toLowerCase(tag) !== _$toLowerCase(node.tagName) ? _$assignEl(node, _$el(tag)) : node;
    }
    function _$removeReference(refs, prop, node) {
        var nodes = refs[prop];
        _$isArray(nodes) ? refs[prop].splice(nodes.indexOf(node), 1) : (delete refs[prop]);
    }
    function _$destroyComponent(component) {
        component.$unmount();
        component.$parent = null;
        component.$parentEl = null;
        component.$siblingEl = null;
        component.$children.splice(0, component.$children.length);
    }
    function _$setElements(component, parent, sibling) {
        var brother = _$select(sibling);
        component.$siblingEl = brother;
        component.$parentEl = sibling && brother.parentElement || _$select(parent);
    }
    function _$each(obj, cb) {
        var i = 0;
        for (var key in obj) {
            if (_$hasProp(obj, key)) {
                cb(obj[key], (isNaN(+key) ? key : +key), i++);
            }
        }
    }

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
        _$define(self, '_key', _$assign({ value: key }, desc));
        _$define(self, '_root', _$assign({ value: root }, desc));
        _$arrayValues(self, value, root, key);
        desc.writable = true;
        _$define(self, 'length', _$assign({ value: self.length }, desc));
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

    function _$BaseComponent(attrs, template, options, parent) {
        var self = this;
        var _$set = function (prop, value) { _$define(self, prop, { value: value, writable: true }); };
        if (!attrs)
            attrs = {};
        _$each(PROPS, function (prop) { _$define(self, prop, { value: {} }); });
        _$set('$parent', parent || null);
        _$set('$children', []);
        _$set(PROP_MAP.s, {});
        _$set('$options', options);
        var opts = self.$options;
        if (!opts.attrs)
            opts.attrs = {};
        if (!opts.children)
            opts.children = {};
        _$each(TPS, function (plugin) { plugin.fn.call(self, _$BaseComponent, plugin.options); });
        if (opts.filters)
            _$assign(self.$filters, opts.filters);
        if (opts.directives)
            _$each(opts.directives, function (drt, k) { self.$directives[k] = _$directive(drt); });
        _$each(opts.attrs, function (attrOps, key) {
            _$define(self, (_$isType(key, 'number') ? attrOps : key), {
                get: function () {
                    if (_$isString(attrOps)) {
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
                _$define(self, key, desc);
            }
        };
        for (var key in data) {
            _loop_1(key);
        }
        var tpl = template(self);
        _$each(tpl, function (value, key) {
            _$define(self, key, {
                value: (function (key) {
                    var hook = key[1].toUpperCase() + key.slice(2);
                    var bhook = opts["will" + hook];
                    var ahook = opts["did" + hook];
                    return function () {
                        bhook && bhook.call(this);
                        key === '$update' ? value.call(this, this) : value.apply(this, arguments);
                        ahook && ahook.call(this);
                    };
                })(key)
            });
        });
        _$define(self, '$data', {
            get: function () {
                return _$toPlainObject(this);
            }
        });
    }
    _$assign(_$BaseComponent[PROP_MAP.h], {
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
                _$each(this[PROP_MAP.e][event], function (handler) { handler(data); });
            }
        },
        $notify: function (key) {
            if (this[PROP_MAP.s][key]) {
                _$each(this[PROP_MAP.s][key], function (suscriber) { suscriber(); });
            }
        },
        $observe: function (deps, listener) {
            var _this = this;
            var subs = [];
            if (_$isArray(deps)) {
                _$each(deps, function (dep) {
                    subs.push({ sub: dep, i: _$subscribers.call(_this, dep, listener) });
                });
            }
            else {
                subs.push({ sub: deps, i: _$subscribers.call(this, deps, listener) });
            }
            return {
                $unobserve: function () {
                    _$each(subs, function (sub) {
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
    function _$Ctor(tpl, options) {
        var ctor = function (_$attrs, _$parent) {
            _$BaseComponent.call(this, _$attrs, tpl, options, _$parent);
            !_$parent && this.$create();
        };
        ctor.plugin = function (fn, options) {
            TPS.push({ options: options, fn: fn });
        };
        _$extends(ctor, _$BaseComponent);
        return ctor;
    }

    function _$tplList(_$state) {
      var children = _$state.$options.children;
      var _$frag, h1_1, p_1, txt_1, strong_1, txt_2, setTxt_2, routerViewAnchor_1, routerView_1;
      _$frag = _$docFragment();
      setTxt_2 = function(_$state) {
        return _$state.$route.path;
      };
      var RouterView = children['router-view'] || window.RouterView;
      routerViewAnchor_1 = _$text();
      routerView_1 = _$addChild(_$state, RouterView, {});
      return {
        $create: function() {
          h1_1 = _$el('h1');
          h1_1.innerHTML = 'List Page';
          p_1 = _$el('p');
          txt_1 = _$text('You are in page ');
          strong_1 = _$el('strong');
          txt_2 = _$text();
          txt_2.data = setTxt_2(_$state);
          routerView_1.$create();
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$append(_$select(parent), _$frag, _$select(sibling));
          _$setElements(this, parent, sibling);
        },

        $update: function(_$state) {
          _$textUpdate(txt_2, setTxt_2(_$state));
          routerView_1 && routerView_1.$update();
        },

        $unmount: function() {
          _$append(_$frag, h1_1);
          _$append(p_1, txt_1);
          _$append(strong_1, txt_2);
          _$append(p_1, strong_1);
          _$append(_$frag, p_1);
          _$append(_$frag, routerViewAnchor_1);
          routerView_1.$mount(_$frag, routerViewAnchor_1);
        },

        $destroy: function() {
          _$destroyComponent(this);
          routerView_1 && routerView_1.$destroy();
          delete _$state.$root;
          _$frag = h1_1 = p_1 = txt_1 = strong_1 = txt_2 = setTxt_2 = routerViewAnchor_1 = routerView_1 = void 0;
        }
      };
    }
    var List = _$Ctor(_$tplList, {});

    function _$tplPage(_$state) {
      var children = _$state.$options.children;
      var _$frag, h1_1, txt_1, setTxt_1, p_1, txt_2, strong_1, txt_3, setTxt_3, routerViewAnchor_1, routerView_1, span_1, txt_4;
      _$frag = _$docFragment();
      setTxt_1 = function(_$state) {
        return (_$state.name ? _$state.name + ' ' : '') + 'Page';
      };
      setTxt_3 = function(_$state) {
        return _$state.$route.path;
      };
      var RouterView = children['router-view'] || window.RouterView;
      routerViewAnchor_1 = _$text();
      routerView_1 = _$addChild(_$state, RouterView, {});
      var default_routerView_1 = _$emptySlot(routerView_1, 'default');
      return {
        $create: function() {
          h1_1 = _$el('h1');
          txt_1 = _$text();
          txt_1.data = setTxt_1(_$state);
          p_1 = _$el('p');
          txt_2 = _$text('PATH: ');
          strong_1 = _$el('strong');
          txt_3 = _$text();
          txt_3.data = setTxt_3(_$state);
          routerView_1.$create();
          span_1 = _$el('span');
          txt_4 = _$text('Default Child');
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$append(_$select(parent), _$frag, _$select(sibling));
          _$setElements(this, parent, sibling);
        },

        $update: function(_$state) {
          _$textUpdate(txt_1, setTxt_1(_$state));
          _$textUpdate(txt_3, setTxt_3(_$state));
          routerView_1 && routerView_1.$update();
        },

        $unmount: function() {
          _$append(h1_1, txt_1);
          _$append(_$frag, h1_1);
          _$append(p_1, txt_2);
          _$append(strong_1, txt_3);
          _$append(p_1, strong_1);
          _$append(_$frag, p_1);
          _$append(_$frag, routerViewAnchor_1);
          _$append(span_1, txt_4);
          default_routerView_1 && _$append(default_routerView_1, span_1);
          routerView_1.$mount(_$frag, routerViewAnchor_1);
        },

        $destroy: function() {
          _$destroyComponent(this);
          routerView_1 && routerView_1.$destroy();
          delete _$state.$root;
          _$frag = h1_1 = txt_1 = setTxt_1 = p_1 = txt_2 = strong_1 = txt_3 = setTxt_3 = routerViewAnchor_1 = routerView_1 = span_1 = txt_4 = void 0;
        }
      };
    }
    var Page = _$Ctor(_$tplPage, {
      attrs: ['name']
    });

    function _$tplHome(_$state) {
      var _$frag, h1_1, p_1, txt_1, strong_1, txt_2, setTxt_2;
      _$frag = _$docFragment();
      setTxt_2 = function(_$state) {
        return _$state.$route.path;
      };
      return {
        $create: function() {
          h1_1 = _$el('h1');
          h1_1.innerHTML = 'Home Page';
          p_1 = _$el('p');
          txt_1 = _$text('You are in page ');
          strong_1 = _$el('strong');
          txt_2 = _$text();
          txt_2.data = setTxt_2(_$state);
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$append(_$select(parent), _$frag, _$select(sibling));
          _$setElements(this, parent, sibling);
        },

        $update: function(_$state) {
          _$textUpdate(txt_2, setTxt_2(_$state));
        },

        $unmount: function() {
          _$append(_$frag, h1_1);
          _$append(p_1, txt_1);
          _$append(strong_1, txt_2);
          _$append(p_1, strong_1);
          _$append(_$frag, p_1);
        },

        $destroy: function() {
          _$destroyComponent(this);
          delete _$state.$root;
          _$frag = h1_1 = p_1 = txt_1 = strong_1 = txt_2 = setTxt_2 = void 0;
        }
      };
    }
    var Home = _$Ctor(_$tplHome, {});

    function _$tplAbout(_$state) {
      var _$frag, h1_1, p_1, txt_1, strong_1, txt_2, setTxt_2;
      _$frag = _$docFragment();
      setTxt_2 = function(_$state) {
        return _$state.$route.path;
      };
      return {
        $create: function() {
          h1_1 = _$el('h1');
          h1_1.innerHTML = 'About Page';
          p_1 = _$el('p');
          txt_1 = _$text('You are in page ');
          strong_1 = _$el('strong');
          txt_2 = _$text();
          txt_2.data = setTxt_2(_$state);
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$append(_$select(parent), _$frag, _$select(sibling));
          _$setElements(this, parent, sibling);
        },

        $update: function(_$state) {
          _$textUpdate(txt_2, setTxt_2(_$state));
        },

        $unmount: function() {
          _$append(_$frag, h1_1);
          _$append(p_1, txt_1);
          _$append(strong_1, txt_2);
          _$append(p_1, strong_1);
          _$append(_$frag, p_1);
        },

        $destroy: function() {
          _$destroyComponent(this);
          delete _$state.$root;
          _$frag = h1_1 = p_1 = txt_1 = strong_1 = txt_2 = setTxt_2 = void 0;
        }
      };
    }
    var About = _$Ctor(_$tplAbout, {});

    function _$tplDetails(_$state) {
      var _$frag, h1_1, p_1, txt_1, strong_1, txt_2, setTxt_2;
      _$frag = _$docFragment();
      setTxt_2 = function(_$state) {
        return _$state.$route.path;
      };
      return {
        $create: function() {
          h1_1 = _$el('h1');
          h1_1.innerHTML = 'Details Page';
          p_1 = _$el('p');
          txt_1 = _$text('You are in page ');
          strong_1 = _$el('strong');
          txt_2 = _$text();
          txt_2.data = setTxt_2(_$state);
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$append(_$select(parent), _$frag, _$select(sibling));
          _$setElements(this, parent, sibling);
        },

        $update: function(_$state) {
          _$textUpdate(txt_2, setTxt_2(_$state));
        },

        $unmount: function() {
          _$append(_$frag, h1_1);
          _$append(p_1, txt_1);
          _$append(strong_1, txt_2);
          _$append(p_1, strong_1);
          _$append(_$frag, p_1);
        },

        $destroy: function() {
          _$destroyComponent(this);
          delete _$state.$root;
          _$frag = h1_1 = p_1 = txt_1 = strong_1 = txt_2 = setTxt_2 = void 0;
        }
      };
    }
    var Details = _$Ctor(_$tplDetails, {});

    function _$tplContact(_$state) {
      var _$frag, h1_1, p_1, txt_1, strong_1, txt_2, setTxt_2;
      _$frag = _$docFragment();
      setTxt_2 = function(_$state) {
        return _$state.$route.path;
      };
      return {
        $create: function() {
          h1_1 = _$el('h1');
          h1_1.innerHTML = 'Contact Page';
          p_1 = _$el('p');
          txt_1 = _$text('You are in page ');
          strong_1 = _$el('strong');
          txt_2 = _$text();
          txt_2.data = setTxt_2(_$state);
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$append(_$select(parent), _$frag, _$select(sibling));
          _$setElements(this, parent, sibling);
        },

        $update: function(_$state) {
          _$textUpdate(txt_2, setTxt_2(_$state));
        },

        $unmount: function() {
          _$append(_$frag, h1_1);
          _$append(p_1, txt_1);
          _$append(strong_1, txt_2);
          _$append(p_1, strong_1);
          _$append(_$frag, p_1);
        },

        $destroy: function() {
          _$destroyComponent(this);
          delete _$state.$root;
          _$frag = h1_1 = p_1 = txt_1 = strong_1 = txt_2 = setTxt_2 = void 0;
        }
      };
    }
    var Contact = _$Ctor(_$tplContact, {});

    function _$tplNotFound(_$state) {
      var _$frag, h1_1, p_1, button_1, txt_1, clickEvent_1, handlerClickEvent_1;
      _$frag = _$docFragment();
      clickEvent_1 = function(_$state) {
        _$state.$route.back();
      };
      return {
        $create: function() {
          h1_1 = _$el('h1');
          h1_1.innerHTML = 'Not Found Page';
          p_1 = _$el('p');
          p_1.innerHTML = '\n  Somthing was wrong.\n';
          button_1 = _$el('button');
          txt_1 = _$text('Go Back');
          _$addListener(button_1, 'click', handlerClickEvent_1 = function(event) {
            clickEvent_1(_$state, event, button_1);
          });
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$append(_$select(parent), _$frag, _$select(sibling));
          _$setElements(this, parent, sibling);
        },

        $update: _$noop,

        $unmount: function() {
          _$append(_$frag, h1_1);
          _$append(_$frag, p_1);
          _$append(button_1, txt_1);
          _$append(_$frag, button_1);
        },

        $destroy: function() {
          _$destroyComponent(this);
          _$removeListener(button_1, 'click', handlerClickEvent_1);
          delete _$state.$root;
          _$frag = h1_1 = p_1 = button_1 = txt_1 = clickEvent_1 = handlerClickEvent_1 = void 0;
        }
      };
    }
    var NotFound = _$Ctor(_$tplNotFound, {});

    function _$tplRouterView(_$state) {
      var _$frag;
      _$frag = _$docFragment();
      var _$slots = _$state.$slots;
      _$declareSlots(_$slots, ['default']);
      return {
        $create: _$noop,

        $mount: function(parent, sibling) {
          this.$unmount();
          _$append(_$select(parent), _$frag, _$select(sibling));
          _$setElements(this, parent, sibling);
        },

        $update: _$noop,

        $unmount: function() {
          _$append(_$frag, _$slots['default']);
        },

        $destroy: function() {
          _$destroyComponent(this);
          delete _$state.$root;
          _$frag = void 0;
        }
      };
    }
    var RouterView = _$Ctor(_$tplRouterView, {
      attrs: {
        name: {
          type: 'string',
          default: 'default'
        }
      },

      willUnmount: function() {
        if (this.$slots.default.hasChildNodes() && this.$parent.$hasNext) {
          this.$slots.default = _$docFragment();
        }
      }
    });

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
                    child.name = route.name + "." + child.name;
                if (typeof child.path === 'string') {
                    child.path = clearSlashes(route._path) + "/" + child.path.replace(/^\//, '');
                }
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
    function goToPath(router, path) {
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
    }
    function buildRoute(router, path) {
        path = path || '/';
        return {
            path: path,
            router: router,
            query: {},
            state: {},
            name: null,
            params: {},
            go: function (path) {
                goToPath(router, path);
            },
            back: function () {
                history && history.go(-1);
            },
            forward: function () {
                history && history.go(1);
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
      _$frag = _$docFragment();
      setTag_$node_1 = function(_$state) {
        return _$state.tag;
      };
      var _$slots = _$state.$slots;
      _$declareSlots(_$slots, ['default']);
      _refs = _$state.$refs;
      clickEvent_1 = function(_$state, $event) {
        _$state._navigate($event);
      };
      bindClass_$node_1 = function(_$state) {
        var _a;
        return ['class', _$bindClasses([
          _$state._classes,
          (_a = {}, _a[_$state.activeClass] = _$state._active && _$state.parentActive == 'null', _a)
        ]).trim()];
      };
      return {
        $create: function() {
          _$node_1 = _$el(setTag_$node_1(_$state));
          _$setReference(_refs, 'link', _$node_1);
          _$addListener(_$node_1, 'click', handlerClickEvent_1 = function(event) {
            event.preventDefault();
            clickEvent_1(_$state, event, _$node_1);
          });
          _$setAttr(_$node_1, bindClass_$node_1(_$state));
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$append(_$select(parent), _$frag, _$select(sibling));
          _$setElements(this, parent, sibling);
        },

        $update: function(_$state) {
          _$node_1 = _$tagUpdate(_$node_1, setTag_$node_1(_$state));
          handlerClickEvent_1 = _$updateListener(_$node_1, 'click', handlerClickEvent_1, function(event) {
            event.preventDefault();
            clickEvent_1(_$state, event, _$node_1);
          });
          _$bindUpdate(_$node_1, bindClass_$node_1(_$state));
        },

        $unmount: function() {
          _$append(_$node_1, _$slots['default']);
          _$append(_$frag, _$node_1);
        },

        $destroy: function() {
          _$destroyComponent(this);
          _$removeReference(_refs, 'link', _$node_1);
          _$removeListener(_$node_1, 'click', handlerClickEvent_1);
          delete _$state.$root;
          _$frag = _$node_1 = setTag_$node_1 = _refs = clickEvent_1 = handlerClickEvent_1 = bindClass_$node_1 = void 0;
        }
      };
    }
    var RouteLink = _$Ctor(_$tplRouteLink, {
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
        },

        parentActive: {
          type: 'string',
          default: 'null'
        }
      },

      didMount: function() {
        var _this = this;
        this._updateURL();
        this._classes = this.class;
        this._path = _$isType(this.to, 'string') ? this.to : generateUrl(this.$router, this.to);
        if (this.tag === 'a')
          _$setAttr(this.$refs.link, ['href', this._path]);
        this.$router.onUrlChange(function() {
          _this._updateURL();
          _this.$update();
        });
        this.$update();
      },

      didUpdate: function() {
        if (this.parentActive !== 'null') {
          var parent = !this.parentActive ? this.$refs.link.parentElement : _$select(this.parentActive);
          if (parent) {
            if (this._active) {
              parent.classList.add(this.activeClass);
            } else {
              parent.classList.remove(this.activeClass);
            }
          }
        }
      },

      model: {
        _url: '',
        _path: '',
        _classes: '',

        get _active() {
          return this._url === this._path;
        },

        _navigate: function(e) {
          this.$fire('click', e);
          navigate(this.$router, this._path);
        },

        _updateURL: function() {
          this._url = this.$router.url;
        }
      }
    });

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
            this._routes = options.routes.reduce(function (routes, route) {
                var path = route.path;
                var modifier = options.ignoreCase ? 'i' : '';
                var _route = toInternalRoute(route, modifier);
                if (typeof path === 'string' && (path === '' || path === '/')) {
                    _this._default = _route;
                }
                else if (!path) {
                    _this._notFound = _route;
                    return routes;
                }
                else {
                    routes.push(_route);
                }
                toPlainRoutes(_this, _route, routes, modifier);
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
        Router.prototype._buildRouteObject = function (url, name, params, state) {
            if (url == null)
                throw new Error('Unable to compile request object');
            var route = buildRoute(this, url);
            if (name)
                route.name = name;
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
                var to_1 = this._buildRouteObject(url, route.name, params, route.state);
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
                if ($options.didMount) {
                    var didMount_1 = $options.didMount;
                    $options.didMount = function () {
                        didMount_1.call(this);
                        navigate(this.$router);
                    };
                }
                else {
                    $options.didMount = function () {
                        navigate(this.$router);
                    };
                }
                if ($options.didDestroy) {
                    var didDestroy_1 = $options.didDestroy;
                    $options.didDestroy = function () {
                        didDestroy_1.call(this);
                        this.$router.destroy();
                    };
                }
                else {
                    $options.didDestroy = function () {
                        this.$router.destroy();
                    };
                }
            }
        };
        Router.prototype.go = function (path) {
            goToPath(this, path);
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
                this._onChange.forEach(function (listener) { try {
                    listener();
                }
                catch (_a) { } });
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

    function _$tplApp(_$state) {
      var children = _$state.$options.children;
      var _$frag, routeLinkAnchor_1, routeLink_1, txt_1, txt_2, routeLinkAnchor_2, routeLink_2, txt_3, txt_4, routeLinkAnchor_3, routeLink_3, txt_5, txt_6, routeLinkAnchor_4, routeLink_4, txt_7, txt_8, routeLinkAnchor_5, routeLink_5, txt_9, txt_10, routeLinkAnchor_6, routeLink_6, txt_11, txt_12, routeLinkAnchor_7, routeLink_7, txt_13, hr_1, routerViewAnchor_1, routerView_1;
      _$frag = _$docFragment();
      var RouteLink = children['route-link'] || window.RouteLink;
      routeLinkAnchor_1 = _$text();
      routeLink_1 = _$addChild(_$state, RouteLink, {
        to: function() {
          return {
            name: 'home'
          };
        },

        class: 'some-class',
        parentActive: ''
      });
      var default_routeLink_1 = _$emptySlot(routeLink_1, 'default');
      routeLinkAnchor_2 = _$text();
      routeLink_2 = _$addChild(_$state, RouteLink, {
        to: function() {
          return {
            name: 'list',

            params: {
              author: 'robert'
            }
          };
        }
      });
      var default_routeLink_2 = _$emptySlot(routeLink_2, 'default');
      routeLinkAnchor_3 = _$text();
      routeLink_3 = _$addChild(_$state, RouteLink, {
        to: function() {
          return {
            name: 'list.edit',

            params: {
              author: 'robert'
            }
          };
        }
      });
      var default_routeLink_3 = _$emptySlot(routeLink_3, 'default');
      routeLinkAnchor_4 = _$text();
      routeLink_4 = _$addChild(_$state, RouteLink, {
        to: function() {
          return {
            name: 'list.view',

            params: {
              author: 'robert'
            }
          };
        }
      });
      var default_routeLink_4 = _$emptySlot(routeLink_4, 'default');
      routeLinkAnchor_5 = _$text();
      routeLink_5 = _$addChild(_$state, RouteLink, {
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
      var default_routeLink_5 = _$emptySlot(routeLink_5, 'default');
      routeLinkAnchor_6 = _$text();
      routeLink_6 = _$addChild(_$state, RouteLink, {
        to: function() {
          return {
            name: 'contact'
          };
        }
      });
      var default_routeLink_6 = _$emptySlot(routeLink_6, 'default');
      routeLinkAnchor_7 = _$text();
      routeLink_7 = _$addChild(_$state, RouteLink, {
        to: function() {
          return {
            name: 'about'
          };
        }
      });
      var default_routeLink_7 = _$emptySlot(routeLink_7, 'default');
      var RouterView = children['router-view'] || window.RouterView;
      routerViewAnchor_1 = _$text();
      routerView_1 = _$addChild(_$state, RouterView, {});
      return {
        $create: function() {
          routeLink_1.$create();
          txt_1 = _$text('Home ');
          txt_2 = _$text('| ');
          routeLink_2.$create();
          txt_3 = _$text('List ');
          txt_4 = _$text('| ');
          routeLink_3.$create();
          txt_5 = _$text('List Edit ');
          txt_6 = _$text('| ');
          routeLink_4.$create();
          txt_7 = _$text('List View ');
          txt_8 = _$text('| ');
          routeLink_5.$create();
          txt_9 = _$text('List Details ');
          txt_10 = _$text('| ');
          routeLink_6.$create();
          txt_11 = _$text('Contact ');
          txt_12 = _$text('| ');
          routeLink_7.$create();
          txt_13 = _$text('About');
          hr_1 = _$el('hr');
          hr_1.innerHTML = '';
          routerView_1.$create();
        },

        $mount: function(parent, sibling) {
          this.$unmount();
          _$append(_$select(parent), _$frag, _$select(sibling));
          _$setElements(this, parent, sibling);
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
          _$append(_$frag, routeLinkAnchor_1);
          default_routeLink_1 && _$append(default_routeLink_1, txt_1);
          routeLink_1.$mount(_$frag, routeLinkAnchor_1);
          _$append(_$frag, txt_2);
          _$append(_$frag, routeLinkAnchor_2);
          default_routeLink_2 && _$append(default_routeLink_2, txt_3);
          routeLink_2.$mount(_$frag, routeLinkAnchor_2);
          _$append(_$frag, txt_4);
          _$append(_$frag, routeLinkAnchor_3);
          default_routeLink_3 && _$append(default_routeLink_3, txt_5);
          routeLink_3.$mount(_$frag, routeLinkAnchor_3);
          _$append(_$frag, txt_6);
          _$append(_$frag, routeLinkAnchor_4);
          default_routeLink_4 && _$append(default_routeLink_4, txt_7);
          routeLink_4.$mount(_$frag, routeLinkAnchor_4);
          _$append(_$frag, txt_8);
          _$append(_$frag, routeLinkAnchor_5);
          default_routeLink_5 && _$append(default_routeLink_5, txt_9);
          routeLink_5.$mount(_$frag, routeLinkAnchor_5);
          _$append(_$frag, txt_10);
          _$append(_$frag, routeLinkAnchor_6);
          default_routeLink_6 && _$append(default_routeLink_6, txt_11);
          routeLink_6.$mount(_$frag, routeLinkAnchor_6);
          _$append(_$frag, txt_12);
          _$append(_$frag, routeLinkAnchor_7);
          default_routeLink_7 && _$append(default_routeLink_7, txt_13);
          routeLink_7.$mount(_$frag, routeLinkAnchor_7);
          _$append(_$frag, hr_1);
          _$append(_$frag, routerViewAnchor_1);
          routerView_1.$mount(_$frag, routerViewAnchor_1);
        },

        $destroy: function() {
          _$destroyComponent(this);
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
    var App = _$Ctor(_$tplApp, {
      router: router
    });

    App.plugin(Router.plugin);

    let app = new App();

    app.$mount('main');

})));
