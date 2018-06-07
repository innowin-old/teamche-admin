import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import Users from '@/components/users/List'
import UserForm from '@/components/users/Form'

import Stores from '@/components/stores/List'
import OwnerConfirmation from '@/components/stores/OwnerRequestConfirmation'
import OfferConfirmation from '@/components/stores/OfferRequestConfirmation'
import StoreUpdateRequestConfirmation from '@/components/stores/UpdateRequestConfirmation'
import StoreForm from '@/components/stores/Form'

import Products from '@/components/products/List'
import ProductCreateRequestConfirmation from '@/components/products/CreateRequestConfirmation'
import ProductUpdateRequestConfirmation from '@/components/products/UpdateRequestConfirmation'
import ProductForm from '@/components/products/Form'

import ProductCategories from '@/components/products/CategoriesList'
import ProductCategoryForm from '@/components/products/CategoryForm'

import ProductOffers from '@/components/products/OffersList'
import ProductOfferCreateRequestConfirmation from '@/components/products/OfferCreateRequestConfirmation'
import ProductOfferUpdateRequestConfirmation from '@/components/products/OfferUpdateRequestConfirmation'

import Posts from '@/components/posts/List'
import PostCreateRequestConfirmation from '@/components/posts/CreateRequestConfirmation'
import PostUpdateRequestConfirmation from '@/components/posts/UpdateRequestConfirmation'
import PostForm from '@/components/posts/Form'

import UpgradeRequests from '@/components/upgrade-requests/List'

import Comments from '@/components/comments/List'
import CommentsCreateRequestConfirmation from '@/components/comments/CreateRequestConfirmation'
import CommentsUpdateRequestConfirmation from '@/components/comments/UpdateRequestConfirmation'

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
      path: '/users/create',
      name: 'Create User',
      component: UserForm
    },
    {
      path: '/users/update',
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
      path: '/products/create',
      name: 'Product Update Form',
      component: ProductForm
    },
    {
      path: '/products/update',
      name: 'Product Create Form',
      component: ProductForm
    },
    {
      path: '/products/categories',
      name: 'Product Categories',
      component: ProductCategories
    },
    {
      path: '/products/categories/create',
      name: 'Create Product Category',
      component: ProductCategoryForm
    },
    {
      path: '/products/categories/update',
      name: 'Update Product Category',
      component: ProductCategoryForm
    },
    {
      path: '/products/offers',
      name: 'Product Offers',
      component: ProductOffers
    },
    {
      path: '/products/offers/create_confirmation',
      name: 'Create offers confirmation',
      component: ProductOfferCreateRequestConfirmation
    },
    {
      path: '/products/offers/update_confirmation',
      name: 'Update offers confirmation',
      component: ProductOfferUpdateRequestConfirmation
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
      path: '/posts/create',
      name: 'Post Create Form',
      component: PostForm
    },
    {
      path: '/posts/update',
      name: 'Post Update Form',
      component: PostForm
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
    },
    {
      path: '/comments',
      name: 'Comments',
      component: Comments
    },
    {
      path: '/comments/create-request-confirmation',
      name: 'Create Comment Confirmation',
      component: CommentsCreateRequestConfirmation
    },
    {
      path: '/comments/update-request-confirmation',
      name: 'Update Comment Confirmation',
      component: CommentsUpdateRequestConfirmation
    }
  ]
})
