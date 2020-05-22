import Vue from 'vue'
import 'es6-promise/auto'
import VueX from 'vuex'
import Element from 'element-ui'
import LightTimeLine from 'vue-light-timeline'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import 'default-passive-events'

import App from './App.vue'

import components from '@/components/components'
import router from './router'
import store from './store'

import 'normalize.css'
import './styles/element-variables.scss'
import './styles/main.scss'
import './permission'
import './vue-filters'

Vue.config.productionTip = false
// import default_logo_url from './assets/system.png'
import default_avatar_url from './assets/avatar.png'
// import default_video_small from './assets/img_video_small.png'
// import default_image_small from './assets/default_image_small.png'
Vue.prototype.errorImg = function (e, type) {
    if (type) {
        switch (type) {
            // case 'logo':
            //     e.target.src = default_logo_url;
            //     break;
            case 'avatar':
                e.target.src = default_avatar_url;
                break;
            // case 'video':
            //     e.target.src = default_video_small;
            //     break;
            // case 'image':
            //     e.target.src = default_image_small;
            //     break;
            default:
                e.target.src = default_avatar_url;
                break;
        }
    }
    // console.log(e)
}

Vue.use(Element)
Vue.use(LightTimeLine)
Vue.use(VueX)
new Vue({
  store,
  components,
  router,
  render: h => h(App),
}).$mount('#app')
