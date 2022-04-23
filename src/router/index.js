import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Chats from '@/views/Chats.vue'
Vue.use(Router)

const router = new Router({
  mode: process.env.VUE_APP_ELECTRON_MODE === 'production' ? 'hash' : 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/chats',
      name: 'Chats',
      component: Chats
    },
    {
      path: '*',
      redirect: '/chats'
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (to.params.txId) {
      // Don't restore scroll for Transaction details screen
      return { x: 0, y: 0 }
    } else if (savedPosition) {
      return savedPosition
    } else if (to.meta.scrollPosition) {
      return to.meta.scrollPosition
    }
  }
})

export default router
