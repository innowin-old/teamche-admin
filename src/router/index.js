import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import Users from '@/components/Users'
import UserForm from '@/components/users/Form'

import Stores from '@/components/stores/List'
import OwnerConfirmation from '@/components/stores/OwnerRequestConfirmation'
import OfferConfirmation from '@/components/stores/OfferRequestConfirmation'
import StoreUpdateRequestConfirmation from '@/components/stores/UpdateRequestConfirmation'
import StoreForm from '@/components/stores/Form'

import Products from '@/components/Products'
import ProductCreateRequestConfirmation from '@/components/products/CreateRequestConfirmation'
import ProductUpdateRequestConfirmation from '@/components/products/UpdateRequestConfirmation'

import Posts from '@/components/Posts'
import PostCreateRequestConfirmation from '@/components/posts/CreateRequestConfirmation'
import PostUpdateRequestConfirmation from '@/components/posts/UpdateRequestConfirmation'

import UpgradeRequests from '@/components/upgrade-requests/List'

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
      path: '/create-user',
      name: 'Create User',
      component: UserForm
    },
    {
      path: '/update-user',
      name: 'Update User',
      component: UserForm
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
      path: '/stores/update-request-confirmation',
      name: 'Update Request Confirmation',
      component: StoreUpdateRequestConfirmation
    },
    {
      path: '/stores/create',
      name: 'Create Store',
      component: StoreForm
    },
    {
      path: '/stores/update',
      name: 'Update Store',
      component: StoreForm
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
      path: '/posts/create-request-confirmation',
      name: 'Create Request Confirmation',
      component: PostCreateRequestConfirmation
    },
    {
      path: '/posts/update-request-confirmation',
      name: 'Update Request Confirmation',
      component: PostUpdateRequestConfirmation
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
