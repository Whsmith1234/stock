import Vue from 'vue'

import Default from '@/layouts/default'
import Toolbar from '@/layouts/toolbar'
import Chat from '@/layouts/chat'

// Register layouts globally
Vue.component('default', Default)
Vue.component('toolbar', Toolbar)
Vue.component('chat', Chat)