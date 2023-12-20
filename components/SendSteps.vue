<template>
  <main-transition>
    <b-container>
      <!-- Sender steps -->
      <div class="steps-wrapper">
        <main-transition>
          <h1 class="header">{{ $t('send.stepsHeader') }}</h1>
        </main-transition>

        <steps :steps-count="3">
          <template #step-1>
            {{ $t('send.stepOne') }}
          </template>

          <template #step-2>
            {{ $t('send.stepTwo[0]') }}
            <span class="marked-button">{{ $t('receiveFiles') }}</span>
            {{ $t('send.stepTwo[1]') }}
          </template>

          <template #step-3>
            <span>{{ $t('send.stepThree') }}</span>

            <!-- Token -->
            <div v-if="token">
              <h2 class="code">{{ token.toUpperCase() }}</h2>
              <span class="or-copy-link">
                <span>{{ $t('send.or') }}</span>
                <b-button @click="copyLink">
                  {{ $t('send.copyLink') }}
                </b-button>
              </span>
            </div>
            <div v-else class="code">
              <div class="skeleton-block">000000</div>
            </div>
          </template>
        </steps>
      </div>

      <!-- Notes -->
      <main-transition>
        <div class="mt-5">
          <p class="note">{{ $t('send.whenStepsDone') }}</p>
          <p class="note">{{ $t('makeSure') }}</p>
          <p class="note">{{ $t('allEndToEnd') }}</p>
        </div>
      </main-transition>

      <!-- Loading throbber -->
      <main-transition>
        <img
          src="~assets/images/throbber.svg"
          width="52"
          class="main-throbber"
          alt="Loading"
        />
      </main-transition>
    </b-container>
  </main-transition>
</template>

<script>
export default {
  props: {
    token: {
      type: String,
      required: true,
    },
  },
  methods: {
    copyLink() {
      const text = document.location.origin + '/receive?code=' + this.token

      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      document.body.appendChild(textarea)

      textarea.select()
      document.execCommand('copy')

      document.body.removeChild(textarea)
    },
  },
}
</script>

<style lang="scss" scoped>
.main-throbber {
  display: block;
  margin: auto;
  margin-top: 2rem;

  filter: brightness(0%);
}

.header {
  font-weight: bold;
  font-size: 3rem;
  margin-bottom: 2rem;
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

.or-copy-link {
  display: flex;
  flex-direction: row;
  align-items: center;

  margin-top: 1.5rem;

  .btn {
    font-size: 24px;
    padding: 1px 8px;
    margin: 0 9px;
  }
}

.code {
  font-size: 48px;
  height: 60px;
  font-weight: bold;
  letter-spacing: 8px;
  display: block;
  padding-top: 15px;

  position: relative;
  .skeleton-block {
    display: inline-block;
    border-radius: 3px;
    color: transparent;
    user-select: none;

    animation: shimmer 2s infinite;
    animation-timing-function: linear;
    background: linear-gradient(to right, #bbb 0%, #ddd 50%, #bbb 100%);
    background-size: 200% 100%;

    height: 60px;

    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: 0 0;
      }
    }
  }
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
