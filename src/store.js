import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title: null,
    isTrue: true,
    value: null,
    token: null,
    importUsersList: []
  },
  getters: {
    title: function (state) {
      return state.title
    },
    isTrue: function (state) {
      return state.isTrue
    },
    value: function (state) {
      return state.value
    },
    token: function (state) {
      return state.token
    },
    importUsersList: function(state) {
      return state.importUsersList
    }
  },
  mutations: {
    setTitle: function (state, value) {
      state.title = value
    },
    toggle: function (state) {
      state.isTrue = !state.isTrue
    },
    change: function (state, value) {
      state.value = value
    },
    setToken: function (state, token) {
      state.token = token
    },
    setImportUsersList: function(state, value) {
      state.importUsersList = value
    }
  },
  actions: {
    setTitle: function(context, value) {
      context.commit('setTitle', value)
    },
    toggle: function(context) {
      context.commit('toggle')
    },
    change: function(context, value) {
      context.commit('change', value)
    },
    setToken: function(context, token) {
      context.commit('setToken', token)
    },
    setImportUsersList: function(context, value) {
      context.commit('setImportUsersList', value)
    }
  }
})
