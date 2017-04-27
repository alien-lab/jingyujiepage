import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import NotFound from '@/components/404.vue'
import Home from '@/components/Home.vue'
import Table from '@/components/nav1/Table.vue'
import Form from '@/components/nav1/Form.vue'
import user from '@/components/nav1/user.vue'
import Page4 from '@/components/nav2/Page4.vue'
import Page5 from '@/components/nav2/Page5.vue'
import Artwork from '@/components/nav3/artwork.vue'
import echarts from '@/components/charts/echarts.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      component: Login,
      name: '',
      hidden: true
    },
    {
      path: '/404',
      component: NotFound,
      name: '',
      hidden: true
    },
    {
      path: '/',
      component: Home,
      name: '导航一',
      iconCls: 'el-icon-message',//图标样式class
      children: [
        { path: '/table', component: Table, name: 'Table' },
        { path: '/form', component: Form, name: 'Form' },
        { path: '/user', component: user, name: '列表' },
      ]
    },
    {
      path: '/',
      component: Home,
      name: '导航二',
      iconCls: 'fa fa-id-card-o',
      children: [
        { path: '/page4', component: Page4, name: '页面4' },
        { path: '/page5', component: Page5, name: '页面5' }
      ]
    },
    {
      path: '/',
      component: Home,
      name: '',
      iconCls: 'el-icon-picture',
      leaf: true,//只有一个节点
      children: [
        { path: '/artwork', component: Artwork, name: '艺术品' }
      ]
    },
    {
      path: '/',
      component: Home,
      name: 'Charts',
      iconCls: 'fa fa-bar-chart',
      children: [
        { path: '/echarts', component: echarts, name: 'echarts' }
      ]
    },
    {
      path: '*',
      hidden: true,
      redirect: { path: '/404' }
    }
  ]
})
// router.beforeEach((to, from, next) => {
//   //NProgress.start();
//   if (to.path == '/login') {
//     sessionStorage.removeItem('user');
//   }
//   let user = JSON.parse(sessionStorage.getItem('user'));
//   if (!user && to.path != '/login') {
//     next({ path: '/login' })
//   } else {
//     next()
//   }
// })
export default router
