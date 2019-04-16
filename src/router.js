import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login'
import cPassword from './views/cPassword'
import Home from './views/Home'
// 路由懒加载
const getComponentS = (name) => () => import(`./views/system/${name}`)//System系统管理
const getComponent = (name) => () => import(`./views/Information/${name}`)//Information信息服务
const getComponentB = (name) => () => import(`./views/business/${name}`)//Business业务管理
const getComponentF = (path,name) => () => import(`./views/business/floodforecast/${path}/${name}`)//floodforecast洪水预报
const getComponentP = (path,name) => () => import(`./views/business/predictionScheme/${path}/${name}`)//predictionScheme方案构造
const getComponentR = (path,name) => () => import(`./views/business/riskAnalysis/${path}/${name}`)//riskAnalysis风险分析


Vue.use(Router)

const router =  new Router({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/Home'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/cPassword',
      component: cPassword
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      redirect: '/overview',
      children: [
        {
          path: '/overview',
          name: 'overview',
          component: getComponent('overview')
        }, 
        {
          path: '/weather',
          component: getComponent('weather')
        }, 
        {
          path: '/rain',
          component: getComponent('rain')
        }, 
        {
          path: '/water',
          component: getComponent('water')
        }, 
        {
          path: '/warning',
          component: getComponent('warning')
        }, 
        {
          path: '/dispatch',
          component: getComponent('dispatch')
        }, 
        {
          path: '/risk',
          component: getComponent('risk')
        },
        {
          path: '/floodforecast', //Business业务管理
          component: getComponentB('index'),
          redirect: '/Jobforecast',
          children: [
            {
              path: '/Jobforecast',
              component: getComponentF('Jobforecast','index'),
            },
            {
              path: '/realprediction',
              component: getComponentF('realprediction','index'),
            },
            {
              path: '/amanagement',
              component: getComponentF('amanagement','index'),
            },
            {
              path: '/autosetting',
              component: getComponentF('autosetting','index'),
            },
            {
              path: '/warningmodel',
              component: getComponentF('warningmodel','index'),
            },
            {
              path: '/schemeConstruction',
              component: getComponentP('schemeConstruction','index'),
            },
            {
              path: '/projectManagement',
              component: getComponentP('projectManagement','index'),
            },
            {
              path: '/realtimeAnalysis',
              component: getComponentR('realtimeAnalysis','index'),
            },
            {
              path: '/AchievementM',
              component: getComponentR('AchievementM','index'),
            }
          ]
        },
        {
          path: '/System', //System系统管理
          component: getComponentS('usermanage'),
          redirect: '/usermanage',
          children: [
            {
              path: '/usermanage',
              component: getComponentS('usermanage'),
            }
          ]
        }
      ]
    }
  ]
})

//注册全局前置守卫  未登录或失去登录信息时 跳转到登录页面
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    sessionStorage.removeItem('samm-auth')
    sessionStorage.removeItem('samm-userinfo')
  }
  let user = JSON.parse(sessionStorage.getItem('samm-userinfo'))
  if (!user && to.path !== '/login') {
  // if (0) {
    next({
      path: '/login'
    })
  } else {
    next()
  }
})

export default router
