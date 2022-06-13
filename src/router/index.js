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
      }, {
        path: '/rights',
        name: 'rights',
        component: () => import('../components/power/rights.vue')
      }, {
        path: '/roles',
        name: 'roles',
        component: () => import('../components/power/roles.vue')
      },
      {
        path: '/categories',
        name: 'categories',
        component: () => import('../components/goods/cate.vue')
      }, {
        path: '/params',
        name: 'params',
        component: () => import('../components/goods/params.vue')
      }, {
        path: '/goods',
        name: 'goods',
        component: () => import('../components/goods/list.vue')
      }, {
        path: '/add',
        name: 'add',
        component: () => import('../components/goods/add.vue')
      }, {
        path: '/orders',
        name: '/orders',
        component: () => import('../components/order/order.vue')
      }, {
        path: '/reports',
        name: '/reports',
        component: () => import('../components/report/report.vue')
      }
    ]
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