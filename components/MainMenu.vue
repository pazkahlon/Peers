<template>
  <header class="main-menu">
    <a :href="localePath('/')">
      <img src="~assets/images/logo.svg" alt="Peers" />
    </a>
    <div class="side-menu">
      <b-button variant="link">{{ $t('removeAds') }}</b-button>
      <b-dropdown
        id="dropdown-1"
        :text="chosenLocaleFlag"
        class="langswitcher"
        :right="$t('dir') != 'rtl'"
      >
        <b-dropdown-item
          v-for="{ code, name, flag } of $i18n.locales"
          :key="code"
          :active="$i18n.locale == code"
          @click="$i18n.setLocale(code)"
          >{{ flag + ' ' + name }}</b-dropdown-item
        >
      </b-dropdown>
    </div>
  </header>
</template>

<script>
export default {
  name: 'MainMenu',
  computed: {
    chosenLocaleFlag() {
      return this.$i18n.locales.find((l) => l.code == this.$i18n.locale).flag
    },
  },
  methods: {
    changeLocale(locale) {
      this.$i18n.setLocale(locale)
    },
  },
}
</script>

<style lang="scss" scoped>
.main-menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  z-index: 5;

  .side-menu {
    margin: 0 -0.5rem;
    ::v-deep .btn {
      height: 47px;
      padding-top: 0;
      padding-bottom: 0;
      margin: 0 0.5rem;
    }
  }

  ::v-deep .langswitcher .btn {
    font-size: 21px;
  }
}
@include media-breakpoint-down(md) {
  .main-menu {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
