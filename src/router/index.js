import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import WorkFlow from '@/views/WorkFlow'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/workFlow'
    },
    {
      path: '/helloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/workFlow',
      name: 'WorkFlow',
      component: WorkFlow
    }
  ]
})
