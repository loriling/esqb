import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import VueCodemirror from 'vue-codemirror'

// require styles
import 'codemirror/lib/codemirror.css'

Vue.use(ElementUI);
Vue.use(VueCodemirror);

new Vue({
  el: '#app',
  render: h => h(App)
})
