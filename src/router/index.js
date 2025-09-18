import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../screens/Login.vue'
import Signup from '../screens/Signup.vue'
import Main from '../screens/Main.vue'
import Profile from '../screens/Profile.vue'
import History from '../screens/History.vue'
import Chart from '../screens/Chart.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/signup', component: Signup },
  { path: '/main', component: Main },
  { path: '/profile', component: Profile },
  { path: '/history', component: History },
  { path: '/chart',component: Chart}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

