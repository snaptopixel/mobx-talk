<template>
  <nav class="panel">
    <p class="panel-heading">
      repositories
    </p>
    <div class="panel-block">
      <p class="control has-icons-left">
        <input class="input is-small" type="text" placeholder="search" v-model="state.query">
        <span class="icon is-small is-left">
          <i class="fas fa-search" aria-hidden="true"></i>
        </span>
      </p>
    </div>
    <p class="panel-tabs">
      <a
        v-for="cat in state.categories" :key="cat"
        :class="{'is-active': state.selectedCategory === cat}"
        @click="() => state.selectedCategory = cat"
      >{{cat}}</a>
    </p>
    <a class="panel-block" v-for="item in state.visibleItems" :key="item.label">
      <span class="panel-icon">
        <i class="fas fa-book" aria-hidden="true"></i>
      </span>
      {{item.label}}
    </a>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import { AppState } from './state';
import { autorun } from 'mobx';
export default Vue.extend({
  props: ['state'],
  mounted() {
    autorun(() => {
      console.log(this.state.query)
    })
  }
})
</script>