import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentAccount: ""
  },
  mutations: {
    setCurrentAccount(state, currentAccount) {
      state.currentAccount = currentAccount;
    }
  },
  actions: {
    setCurrentAccount(context, currentAccount) {
      context.commit('setCurrentAccount', currentAccount)
    }
  },
  modules: {
  },
  getters: {
    currentAccount: state => {
      return state.currentAccount
    }
  }
})
