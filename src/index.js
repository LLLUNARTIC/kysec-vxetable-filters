// import Vue from 'vue'
import components from './components'
export default {
  install: function (Vue) {
    Object.keys(components).forEach(key => {
      Vue.component(components[key].name, components[key])
    })
  }
} 