import List from './list.html';
import Page from './page.html';
import Home from './home.html';
import About from './about.html';
import Details from './details.html';
import Contact from './contact.html';
import NotFound from './notFound.html';
import Router from '../../lib/router.esm';

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

/* router.beforeEach(function (routes, next) {
  routes.from && console.log(routes.from.path);
  console.log(routes.to.path);
  if (routes.to.path === '/about') {
    routes.to.go({ name: 'home' });
  } else {
    next();
  }
});

router.afterEach(function (routes) {
  routes.from && console.log('After:', routes.from.path);
  console.log('After:', routes.to.path);
}); */

export default router;