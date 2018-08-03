import {
  _$CompCtr,
  _$,
  _$d,
  _$a,
  _$add,
  _$ce,
  _$ct,
  _$toStr,
  _$plugin
} from 'trebor/tools';
function _$tplPage(_$state, children) {
  var _$frag, h1_1, txt_1, setTxt_1, p_1, txt_2, strong_1, txt_3, setTxt_3, routerViewAnchor_1, routerView_1, span_1, txt_4;
  _$frag = _$d();
  setTxt_1 = function (_$state) {
    return (('name' in _$state ? _$state.name : name) ? ('name' in _$state ? _$state.name : name) + ' ' : '') + 'Page';
  };
  setTxt_3 = function (_$state) {
    return _$state.$route.path;
  };
  var RouterView = children['router-view'] || window['RouterView'];
  routerViewAnchor_1 = _$ct();
  routerView_1 = new RouterView({}, _$state);
  _$add(_$state, routerView_1);
  if (routerView_1.$slots['default'] && routerView_1.$slots['default'].childNodes.length !== 0) {
    routerView_1.$slots['default'] = _$d();
  }
  return {
    $create: function () {
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
    $mount: function (parent, sibling) {
      this.$unmount();
      _$a(_$(parent), _$frag, _$(sibling));
      this.$siblingEl = _$(sibling);
      this.$parentEl = sibling && _$(sibling).parentElement || _$(parent);
    },
    $update: function (_$state) {
      var updateTxt_1 = setTxt_1(_$state);
      if (txt_1.data !== _$toStr(updateTxt_1)) {
        txt_1.data = updateTxt_1;
      }
      updateTxt_1 = void 0;
      var updateTxt_3 = setTxt_3(_$state);
      if (txt_3.data !== _$toStr(updateTxt_3)) {
        txt_3.data = updateTxt_3;
      }
      updateTxt_3 = void 0;
      routerView_1 && routerView_1.$update();
    },
    $unmount: function () {
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
    $destroy: function () {
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
  _$CompCtr.call(this, _$attrs, _$tplPage, { attrs: ['name'] }, _$parent);
  !_$parent && this.$create();
}
Page.plugin = _$plugin;
Page.prototype = Object.create(_$CompCtr.prototype);
Page.prototype.constructor = Page;
export default Page;