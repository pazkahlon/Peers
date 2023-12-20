import path from 'path'
import fs from 'fs'

export default {
  server: {
    port: process.env.PORT || 3000,
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Peers',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/assets/scss/global.scss'],

  // Sharing variables, functions and mixins globally
  styleResources: {
    scss: [
      '~assets/scss/variables.scss',
      'bootstrap/scss/_functions.scss',
      'bootstrap/scss/_variables.scss',
      'bootstrap/scss/_mixins.scss',
    ],
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['@/plugins/utilities'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/style-resources',
    //'@nuxtjs/google-analytics'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    [
      'bootstrap-vue/nuxt',
      {
        bootstrapCSS: false,
        bootstrapVueCSS: false,
      },
    ],
    '@nuxtjs/axios',
    'nuxt-socket-io',
    'nuxt-i18n',
    /*[
      '@nuxtjs/google-adsense',
      {
        id: 'ca-pub-xxxx',
        test: true,
      },
    ],*/
  ],

  // Nuxt SocketIO settings
  io: {
    sockets: [
      {
        name: 'main',
        url: `http://localhost:${process.env.SOCKET_PORT || 5000}`,
      },
    ],
  },

  /*googleAnalytics: {
    id: 'xxxxxxxxx'
  },*/

  i18n: {
    locales: [
      {
        code: 'en',
        flag: '🇺🇸',
        name: 'English',
        iso: 'en-US',
        file: 'en.js',
      },
      {
        code: 'he',
        flag: '🇮🇱',
        name: 'עברית',
        iso: 'he-IL',
        file: 'he.js',
      },
    ],
    lazy: true,
    defaultLocale: 'en',
    langDir: 'locales/',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      onlyOnRoot: true,
    },
    seo: true,
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  // Running socket server through a middleware for it to run on the same session.
  serverMiddleware: [{ path: '/server', handler: '~/server/index.js' }],

  /*server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
    }
  }*/
}
