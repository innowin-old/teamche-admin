import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Users from '@/components/Users'
import Stores from '@/components/stores/List'
import OwnerConfirmation from '@/components/stores/OwnerRequestConfirmation'
import OfferConfirmation from '@/components/stores/OfferRequestConfirmation'

import Products from '@/components/Products'
import ProductCreateRequestConfirmation from '@/components/products/CreateRequestConfirmation'
import ProductUpdateRequestConfirmation from '@/components/products/UpdateRequestConfirmation'

import Posts from '@/components/Posts'
import UpgradeRequests from '@/components/UpgradeRequests'
import UserForm from '@/components/UserForm'

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
      path: '/owner-request-confirmation',
      name: 'Owner Request Confirmation',
      component: OwnerConfirmation
    },
    {
      path: '/offer-request-confirmation',
      name: 'Offer Request Confirmation',
      component: OfferConfirmation
    },
    {
      path: '/products',
      name: 'Products',
      component: Products
    },
    {
      path: '/products/create-request-confirmation',
      name: 'Create Request Confirmation',
      component: ProductCreateRequestConfirmation
    },
    {
      path: '/products/update-request-confirmation',
      name: 'Update Request Confirmation',
      component: ProductUpdateRequestConfirmation
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
    },
    {
      path: '/new-user',
      name: 'New User',
      component: UserForm
    },
    {
      path: '/update-user',
      name: 'Update User',
      component: UserForm
    }
  ]
})
