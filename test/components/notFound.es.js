import {
  _$CompCtr,
  _$,
  _$d,
  _$a,
  _$ce,
  _$ct,
  _$al,
  _$rl,
  _$noop,
  _$plugin
} from 'trebor/tools';
function _$tplNotFound(_$state) {
  var _$frag, h1_1, txt_1, p_1, txt_2, button_1, txt_3, clickEvent_1, handlerClickEvent_1;
  _$frag = _$d();
  clickEvent_1 = function (_$state) {
    _$state.$route.back();
  };
  return {
    $create: function () {
      h1_1 = _$ce('h1');
      txt_1 = _$ct('Not Found Page');
      p_1 = _$ce('p');
      txt_2 = _$ct(' Somthing was wrong. ');
      button_1 = _$ce('button');
      txt_3 = _$ct('Go Back');
      this.$hydrate();
    },
    $hydrate: function () {
      _$al(button_1, 'click', handlerClickEvent_1 = function (event) {
        clickEvent_1(_$state, event, button_1);
      });
    },
    $mount: function (parent, sibling) {
      this.$unmount();
      _$a(_$(parent), _$frag, _$(sibling));
      this.$siblingEl = _$(sibling);
      this.$parentEl = sibling && _$(sibling).parentElement || _$(parent);
    },
    $update: _$noop,
    $unmount: function () {
      _$a(h1_1, txt_1);
      _$a(_$frag, h1_1);
      _$a(p_1, txt_2);
      _$a(_$frag, p_1);
      _$a(button_1, txt_3);
      _$a(_$frag, button_1);
    },
    $destroy: function () {
      this.$unmount();
      this.$parent = null;
      this.$parentEl = null;
      this.$siblingEl = null;
      this.$children.splice(0, this.$children.length);
      _$rl(button_1, 'click', handlerClickEvent_1);
      delete _$state.$root;
      _$frag = h1_1 = txt_1 = p_1 = txt_2 = button_1 = txt_3 = clickEvent_1 = handlerClickEvent_1 = void 0;
    }
  };
}
function NotFound(_$attrs, _$parent) {
  _$CompCtr.call(this, _$attrs, _$tplNotFound, {}, _$parent);
  !_$parent && this.$create();
}
NotFound.plugin = _$plugin;
NotFound.prototype = Object.create(_$CompCtr.prototype);
NotFound.prototype.constructor = NotFound;
export default NotFound;