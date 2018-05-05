import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Users from '@/components/Users'
import Stores from '@/components/Stores'
import Products from '@/components/Products'
import Posts from '@/components/Posts'
import UpgradeRequests from '@/components/UpgradeRequests'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/stores',
      name: 'Stores',
      component: Stores
    },
    {
      path: '/products',
      name: 'Products',
      component: Products
    },
    {
      path: '/posts',
      name: 'Posts',
      component: Posts
    },
    {
      path: '/upgrade-requests',
      name: 'Upgrade Requests',
      component: UpgradeRequests
    }
  ]
})
