import {
  _$CompCtr,
  _$,
  _$d,
  _$a,
  _$add,
  _$ce,
  _$ct,
  _$plugin
} from 'trebor/tools';
import router from './router.js';
function _$tplApp(_$state, children) {
  var _$frag, routeLinkAnchor_1, routeLink_1, txt_1, txt_2, routeLinkAnchor_2, routeLink_2, txt_3, txt_4, routeLinkAnchor_3, routeLink_3, txt_5, txt_6, routeLinkAnchor_4, routeLink_4, txt_7, txt_8, routeLinkAnchor_5, routeLink_5, txt_9, txt_10, routeLinkAnchor_6, routeLink_6, txt_11, txt_12, routeLinkAnchor_7, routeLink_7, txt_13, hr_1, routerViewAnchor_1, routerView_1;
  _$frag = _$d();
  var RouteLink = children['route-link'] || window['RouteLink'];
  routeLinkAnchor_1 = _$ct();
  routeLink_1 = new RouteLink({
    to: function () {
      return { name: 'home' };
    },
    redirect: '/home'
  }, _$state);
  _$add(_$state, routeLink_1);
  if (routeLink_1.$slots['default'] && routeLink_1.$slots['default'].childNodes.length !== 0) {
    routeLink_1.$slots['default'] = _$d();
  }
  routeLinkAnchor_2 = _$ct();
  routeLink_2 = new RouteLink({
    to: function () {
      return {
        name: 'list',
        params: { author: 'robert' }
      };
    }
  }, _$state);
  _$add(_$state, routeLink_2);
  if (routeLink_2.$slots['default'] && routeLink_2.$slots['default'].childNodes.length !== 0) {
    routeLink_2.$slots['default'] = _$d();
  }
  routeLinkAnchor_3 = _$ct();
  routeLink_3 = new RouteLink({
    to: function () {
      return {
        name: 'list.edit',
        params: { author: 'robert' }
      };
    }
  }, _$state);
  _$add(_$state, routeLink_3);
  if (routeLink_3.$slots['default'] && routeLink_3.$slots['default'].childNodes.length !== 0) {
    routeLink_3.$slots['default'] = _$d();
  }
  routeLinkAnchor_4 = _$ct();
  routeLink_4 = new RouteLink({
    to: function () {
      return {
        name: 'list.view',
        params: { author: 'robert' }
      };
    }
  }, _$state);
  _$add(_$state, routeLink_4);
  if (routeLink_4.$slots['default'] && routeLink_4.$slots['default'].childNodes.length !== 0) {
    routeLink_4.$slots['default'] = _$d();
  }
  routeLinkAnchor_5 = _$ct();
  routeLink_5 = new RouteLink({
    to: function () {
      return {
        name: 'list.view.details',
        params: {
          author: 'robert',
          id: 4
        }
      };
    }
  }, _$state);
  _$add(_$state, routeLink_5);
  if (routeLink_5.$slots['default'] && routeLink_5.$slots['default'].childNodes.length !== 0) {
    routeLink_5.$slots['default'] = _$d();
  }
  routeLinkAnchor_6 = _$ct();
  routeLink_6 = new RouteLink({
    to: function () {
      return { name: 'contact' };
    }
  }, _$state);
  _$add(_$state, routeLink_6);
  if (routeLink_6.$slots['default'] && routeLink_6.$slots['default'].childNodes.length !== 0) {
    routeLink_6.$slots['default'] = _$d();
  }
  routeLinkAnchor_7 = _$ct();
  routeLink_7 = new RouteLink({
    to: function () {
      return { name: 'about' };
    }
  }, _$state);
  _$add(_$state, routeLink_7);
  if (routeLink_7.$slots['default'] && routeLink_7.$slots['default'].childNodes.length !== 0) {
    routeLink_7.$slots['default'] = _$d();
  }
  var RouterView = children['router-view'] || window['RouterView'];
  routerViewAnchor_1 = _$ct();
  routerView_1 = new RouterView({}, _$state);
  _$add(_$state, routerView_1);
  return {
    $create: function () {
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
      routerView_1.$create();
    },
    $mount: function (parent, sibling) {
      this.$unmount();
      _$a(_$(parent), _$frag, _$(sibling));
      this.$siblingEl = _$(sibling);
      this.$parentEl = sibling && _$(sibling).parentElement || _$(parent);
    },
    $update: function () {
      routeLink_1 && routeLink_1.$update();
      routeLink_2 && routeLink_2.$update();
      routeLink_3 && routeLink_3.$update();
      routeLink_4 && routeLink_4.$update();
      routeLink_5 && routeLink_5.$update();
      routeLink_6 && routeLink_6.$update();
      routeLink_7 && routeLink_7.$update();
      routerView_1 && routerView_1.$update();
    },
    $unmount: function () {
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
    $destroy: function () {
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
  _$CompCtr.call(this, _$attrs, _$tplApp, { router: router }, _$parent);
  !_$parent && this.$create();
}
App.plugin = _$plugin;
App.prototype = Object.create(_$CompCtr.prototype);
App.prototype.constructor = App;
export default App;