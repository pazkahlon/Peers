<template>
  <main-transition>
    <b-container>
      <!-- Sender steps -->
      <div class="steps-wrapper">
        <h1 class="header">{{ $t('receive.stepsHeader') }}</h1>
        <steps :steps-count="3">
          <template #step-1>
            {{ $t('receive.stepOne') }}
          </template>

          <template #step-2>
            {{ $t('receive.stepTwo[0]') }}
            <span class="marked-button">{{ $t('sendFiles') }}</span>
            {{ $t('receive.stepTwo[1]') }}
          </template>

          <template #step-3>
            <span>{{ $t('receive.stepThree') }}</span>
            <code-input v-model="code" @enter="$emit('try-token', code)" />
          </template>
        </steps>
      </div>

      <!-- Connect Button -->
      <b-button
        ref="connect"
        class="connect-button"
        variant="primary"
        @click="$emit('try-token', code)"
      >
        {{ $t('connect') }}
      </b-button>

      <!-- Notes -->
      <main-transition>
        <div class="mt-5">
          <p class="note">{{ $t('makeSure') }}</p>
          <p class="note">{{ $t('allEndToEnd') }}</p>
        </div>
      </main-transition>
    </b-container>
  </main-transition>
</template>

<script>
export default {
  data() {
    return {
      code: '',
    }
  },
  created() {
    if (this.$route.query.code) {
      this.code = this.$route.query.code
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.header {
  font-weight: bold;
  font-size: 3rem;
  margin-bottom: 2rem;
}

.container {
  text-align: center;
}

.steps-wrapper {
  display: inline-block;
  margin: auto;

  text-align: initial;
}

.connect-button {
  display: block;
  margin: 3rem auto 2rem;
}

.marked-button {
  font-size: 22px;
  color: #444;
  background-color: #ddd;
  border-radius: 7px;
  padding: 3px 7px;
  white-space: nowrap;
}

.steps-wrap {
  text-align: center;

  .steps {
    display: inline-block;
    text-align: left;
  }
}
</style>
