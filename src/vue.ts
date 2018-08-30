import Vue from 'vue';
import App from './app.vue';
import MobXPlugin from './mobx-vue';
import { AppState } from './state';

Vue.use(MobXPlugin);

export function init(el: HTMLElement, state: AppState) {
  new Vue({
    el,
    render(h) {
      return h(App, {
        props: {state}
      })
    }
  })
}