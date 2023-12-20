<template>
  <div class="peers" ref="wrapper">
    <main-menu />
    <Nuxt />
    <!--<adsbygoogle class="ad" ad-format="fluid" />-->
    <footer>
      <p>{{ $t('copyright') }}</p>
    </footer>

    <!-- Transitions Overlays -->
    <b-overlay bg-color="black" :show="showOverlay" no-wrap>
      <template #overlay>
        <main-transition>
          <p>{{ overlayContent }}</p>
        </main-transition>
        <main-transition>
          <img
            v-if="aLoadingOverlay"
            :src="require('@/assets/images/throbber.svg')"
            width="52"
            class="main-throbber"
            alt="loading"
          />
        </main-transition>
      </template>
    </b-overlay>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showOverlay: false,
      overlayContent: '',
      aLoadingOverlay: false,
    }
  },
  head() {
    return {
      bodyAttrs: {
        dir: this.$t('dir'),
      },
    }
  },
  created() {
    this.$nuxt.$on('modal', this.mutateModal)
  },
  beforeDestroy() {
    this.$nuxt.$off('modal', this.mutateModal)
  },
  mounted() {
    let wrapper = this.$refs.wrapper
    const observer = new MutationObserver(function (mutations, observer) {
      wrapper.style.height = ''
      wrapper.style.minHeight = ''
    })
    observer.observe(wrapper, {
      attributes: true,
      attributeFilter: ['style'],
    })
  },
  methods: {
    mutateModal({ showOverlay, overlayContent, aLoadingOverlay }) {
      this.showOverlay = showOverlay
      this.overlayContent = overlayContent
      this.aLoadingOverlay = aLoadingOverlay
    },
  },
}
</script>

<style lang="scss">
html,
body {
  font-family: 'Rubik', sans-serif;
}

body {
  background-color: $background;
  color: $product-color;
}

footer {
  p {
    margin: 0 auto 6px;
    padding: 0;
    text-align: center;
    font-size: 14px;
  }
}

.ad {
  display: block;
  margin: auto;

  width: 780px;
  height: 90px;
  margin-bottom: 7vh;
}

.peers {
  padding: 2rem 42px 0;
  min-height: 100vh;

  display: flex;
  flex-direction: column;

  main {
    flex: 1;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }
}
.b-overlay {
  text-align: center;
  p {
    color: #fff;
    font-weight: 500;
    font-size: 18px;
  }

  .main-throbber {
    display: block;
    margin: auto;
    margin-top: 2rem;
  }
}

.container {
  padding: 0 !important;
}

@include media-breakpoint-down(md) {
  .peers {
    padding: 2rem 1rem 0;
  }
}
</style>
