// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import $ from 'jquery'
import 'iview/dist/styles/iview.css';
import locale from 'iview/dist/locale/en-US';
import './assets/css/animate.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import vueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(vueQuillEditor)

Vue.use(iView, { locale });
Vue.use(VueAwesomeSwiper);
Vue.use(ElementUI);
Vue.config.productionTip = false

sessionStorage.setItem('API','https://www.sunwou.com/sunwou/')
//sessionStorage.setItem('API','http://192.168.1.186:8080/sunwou/');
sessionStorage.setItem('API2','https://www.sunwou.com/sunwou/');
sessionStorage.setItem('STATIC_API','https://www.sunwou.com/upload/');
//sessionStorage.setItem('API','http://192.168.1.66/sunwou/')
//sessionStorage.setItem('API','http://192.168.0.103/sunwou/')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
