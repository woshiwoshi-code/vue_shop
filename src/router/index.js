import {
  createRouter,
  createWebHistory
} from 'vue-router'

const routes = [{
    path: "/",
    redirect: "login"
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/login.vue'),
  }, {
    path: '/home',
    name: 'home',
    redirect: "welcome",
    component: () => import('../components/home.vue'),
    children: [{
      path: '/welcome',
      name: 'welcome',
      component: () => import('../components/welcome.vue')
    }, {
      path: '/users',
      name: 'users',
      component: () => import('../components/user/Users.vue')
    }]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

//挂在路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem("token")
  if (!token) return next("/login")
  next()
})

export default router