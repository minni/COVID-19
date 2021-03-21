import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/lib/app.scss'

Vue.config.productionTip = false;

// https://stackoverflow.com/questions/43208012/how-do-i-format-currencies-in-a-vue-component
Vue.filter('toNumber', function (value) {
  if (typeof value !== "number") return value;
  return (new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 0
  })).format(value);
});

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
import { NavbarPlugin } from 'bootstrap-vue'
Vue.use(NavbarPlugin)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

