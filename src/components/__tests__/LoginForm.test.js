import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import LoginForm from '@/components/LoginForm'

import en from '@/i18n/en'
import loginMock from './__mocks__/login'

Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(Vuetify)

// Because Node.js is not supporting Promise.finally.
// In the future, polyfill can be added.
// eslint-disable-next-line
Promise.prototype.finally = Promise.prototype.finally || {
  finally (fn) {
    const onFinally = cb => Promise.resolve(fn()).then(cb)
    return this.then(
      result => onFinally(() => result),
      reason => onFinally(() => { throw reason })
    )
  }
}.finally

/**
 * Mockup i18n helper.
 */
function mockupI18n () {
  return new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en
    }
  })
}

/**
 * Mockup store helper
 */
function mockupStore () {
  const state = {}

  const actions = {
    login: loginMock
  }

  const store = new Vuex.Store({
    state,
    actions
  })

  return {
    store,
    actions
  }
}

describe('LoginForm.vue', () => {
  let i18n = null
  let store = null
  let actions = null

  beforeEach(() => {
    const vuex = mockupStore()

    actions = vuex.actions
    store = vuex.store

    i18n = mockupI18n()
  })

  it('renders the correct markup', () => {
    const wrapper = shallowMount(LoginForm, {
      i18n,
      store
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should login with passphrase', async () => {
    const wrapper = shallowMount(LoginForm, {
      i18n,
      store
    })

    wrapper.vm.passphrase = 'correct passphrase'

    const promise = wrapper.vm.login()
    await expect(promise).resolves.toEqual(true)

    expect(wrapper.emitted().login).toBeTruthy()
  })

  it('should throw error when login with incorrect passphrase', async () => {
    const wrapper = shallowMount(LoginForm, {
      i18n,
      store
    })

    wrapper.vm.passphrase = 'incorrect passphrase'

    const promise = wrapper.vm.login()

    try {
      await promise
    } catch (e) {
      expect(e.message).toEqual('Incorrect passphrase')
    }
  })

  it('should freeze form when calling freeze()', () => {
    const wrapper = shallowMount(LoginForm, {
      i18n,
      store
    })

    // default values
    expect(wrapper.vm.disabledButton).toBe(false)
    expect(wrapper.vm.showSpinner).toBe(false)

    // freeze
    wrapper.vm.freeze()
    expect(wrapper.vm.disabledButton).toBe(true)
    expect(wrapper.vm.showSpinner).toBe(true)

    // antifreeze
    wrapper.vm.antiFreeze()
    expect(wrapper.vm.disabledButton).toBe(false)
    expect(wrapper.vm.showSpinner).toBe(false)
  })
})
