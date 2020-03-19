import Vue from 'vue';
import App from './App.vue';
import router from './router';

import '@/plugins/VueBootstrap';
import '@/plugins/VueSkycons';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
