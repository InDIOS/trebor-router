import App from './app.es';
import Router from '../../lib/router.esm';

App.plugin(Router.plugin);

let app = new App();

app.$mount('main');