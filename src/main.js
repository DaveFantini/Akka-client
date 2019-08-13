import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueNativeSock from 'vue-native-websocket'
Vue.config.productionTip = false

Vue.use(VueNativeSock, "ws://localhost:4567/engine/socket", {
  connectManually: true,
  format: 'json' 
})

new Vue({
  render: h => h(App),
}).$mount('#app')
