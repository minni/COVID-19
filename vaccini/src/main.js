import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

Vue.config.productionTip = false

// https://stackoverflow.com/questions/43208012/how-do-i-format-currencies-in-a-vue-component
Vue.filter('toNumber', function (value) {
  if (typeof value !== "number") return value;
  return (new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 0
  })).format(value);
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
