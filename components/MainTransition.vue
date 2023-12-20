<template>
  <transition
    enter-active-class="slideInUp"
    appear
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'MainTransition',
}
</script>

<style lang="scss"></style>
