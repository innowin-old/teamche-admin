// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueSocketio from 'vue-socket.io';
var VueCookie = require('vue-cookie');
import store from './store';
import VueSweetalert2 from 'vue-sweetalert2';

Vue.use(VueCookie);
//Vue.use(VueSocketio, 'http://socket.daneshboom.ir');
Vue.use(VueSocketio, 'http://89.42.210.20:9095')
Vue.use(Vuetify);
Vue.use(VueSweetalert2);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  sockets:{
    connect: function(){
      console.log('socket connected')
    }
  }
})
