<template>
  <main>
    <b-container>
      <transition-group
        tag="div"
        class="buttons"
        enter-active-class="slideInUp"
        appear
      >
        <b-button key="t-1" class="transfer-button" :to="localePath('send')">
          <span class="down-arrow reverse"></span>
          <span class="button-label">{{ $t('sendFiles') }}</span>
        </b-button>

        <b-button key="t-2" class="transfer-button" :to="localePath('receive')">
          <span class="down-arrow"></span>
          <span class="button-label">{{ $t('receiveFiles') }}</span>
        </b-button>
      </transition-group>

      <p class="end-to-end">
        <span class="lock"></span>{{ $t('allEndToEnd') }}
      </p>
    </b-container>
  </main>
</template>
<script>
export default {}
</script>

<style lang="scss" scoped>
main {
  text-align: center;
}

.end-to-end {
  margin: 10vh 0 0;
  color: #777;
  font-size: 1rem;
  font-weight: 500;
  .lock {
    display: inline-block;
    width: 14px;
    height: 18px;
    background-image: url('~assets/images/lock.svg');
    background-size: 14px 18px;
    margin: 0 6px -2px;
  }
}

.container {
  flex-direction: column;
}

.buttons {
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;

  .transfer-button {
    @include button-variant(#fff, rgba(0, 0, 0, 0.15));
    font-size: 42px;
    color: $product-color;
    padding: 1.5rem;

    box-shadow: 0 10px 20px -4px rgba(0, 0, 0, 0.15);

    transition: all 0.2s, border 0.1s;

    display: flex;
    flex-direction: row;
    align-items: center;

    &:hover {
      scale: 1.07;
      box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.3), 0 0 0 2px $product-color;
      color: $product-color;
      border: 1px solid $product-color;
    }

    &:active {
      scale: 1.03;
    }

    &:focus,
    &.focus,
    &:not(:disabled):not(.disabled):active:focus {
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3), 0 0 0 2px $product-color;
      border: 1px solid $product-color;
      color: $product-color;
    }

    &:first-of-type {
      margin-bottom: 3rem;
    }

    .button-label {
      margin: auto;
      padding: 0 10px;
    }
  }

  .down-arrow {
    width: 45px;
    height: 42px;
    background-image: url('~assets/images/down-arrow.svg');

    display: block;
    margin: 0 10px;
    flex-shrink: 0;

    &.reverse {
      transform: rotateX(180deg);
    }
  }
}

@include media-breakpoint-down(sm) {
  .buttons {
    .transfer-button {
      font-size: 24px;
      padding: 1rem;
    }
    .down-arrow {
      width: calc(45px * 0.66);
      height: calc(42px * 0.66);
      background-size: calc(45px * 0.66) calc(42px * 0.66);
    }
  }
}
</style>
