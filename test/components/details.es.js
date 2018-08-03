import {
  _$CompCtr,
  _$,
  _$d,
  _$a,
  _$ce,
  _$ct,
  _$toStr,
  _$plugin
} from 'trebor/tools';
function _$tplDetails(_$state) {
  var _$frag, h1_1, txt_1, p_1, txt_2, strong_1, txt_3, setTxt_3;
  _$frag = _$d();
  setTxt_3 = function (_$state) {
    return _$state.$route.path;
  };
  return {
    $create: function () {
      h1_1 = _$ce('h1');
      txt_1 = _$ct('Details Page');
      p_1 = _$ce('p');
      txt_2 = _$ct('You are in page ');
      strong_1 = _$ce('strong');
      txt_3 = _$ct();
      txt_3.data = setTxt_3(_$state);
    },
    $mount: function (parent, sibling) {
      this.$unmount();
      _$a(_$(parent), _$frag, _$(sibling));
      this.$siblingEl = _$(sibling);
      this.$parentEl = sibling && _$(sibling).parentElement || _$(parent);
    },
    $update: function (_$state) {
      var updateTxt_3 = setTxt_3(_$state);
      if (txt_3.data !== _$toStr(updateTxt_3)) {
        txt_3.data = updateTxt_3;
      }
      updateTxt_3 = void 0;
    },
    $unmount: function () {
      _$a(h1_1, txt_1);
      _$a(_$frag, h1_1);
      _$a(p_1, txt_2);
      _$a(strong_1, txt_3);
      _$a(p_1, strong_1);
      _$a(_$frag, p_1);
    },
    $destroy: function () {
      this.$unmount();
      this.$parent = null;
      this.$parentEl = null;
      this.$siblingEl = null;
      this.$children.splice(0, this.$children.length);
      delete _$state.$root;
      _$frag = h1_1 = txt_1 = p_1 = txt_2 = strong_1 = txt_3 = setTxt_3 = void 0;
    }
  };
}
function Details(_$attrs, _$parent) {
  _$CompCtr.call(this, _$attrs, _$tplDetails, {}, _$parent);
  !_$parent && this.$create();
}
Details.plugin = _$plugin;
Details.prototype = Object.create(_$CompCtr.prototype);
Details.prototype.constructor = Details;
export default Details;