<template>
  <ol class="steps">
    <main-transition v-for="i in stepsCount" :key="i">
      <li>
        <span class="step-num-wrapper"></span>
        <span class="step-content">
          <slot :name="`step-${i}`"></slot>
        </span>
      </li>
    </main-transition>
  </ol>
</template>

<script>
export default {
  name: 'Steps',
  props: {
    stepsCount: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
ol {
  list-style: none;
  counter-reset: peer-counter;
  padding: 0;
  margin: 0;

  font-size: 24px;

  li {
    position: relative;
    counter-increment: peer-counter;

    display: flex;
    flex-direction: row;
    align-items: flex-start;

    font-weight: 500;

    .step-content {
      padding: 20px 2rem 0;
    }

    &:not(:last-child) {
      padding-bottom: 24px;
    }

    .step-num-wrapper {
      display: block;

      width: 62px;
      height: 62px;

      background-color: #d6d6d6;
      color: $product-color;
      font-weight: bold;
      font-size: 48px;

      border-radius: 5px;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;

      flex-shrink: 0;

      &:before {
        content: counter(peer-counter) '.';
        position: relative;
        right: -6px;
      }
    }
  }
}

[dir='rtl'] ol li .step-num-wrapper:before {
  right: initial;
  left: -6px;
}
</style>
