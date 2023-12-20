export default ({ app, store }, inject) => {
  const utils = {
    // Properties for SimplePeer
    get simplePeerProperties() {
      return {
        trickle: true,
        config: {
          iceServers: [
            // https://gist.github.com/yetithefoot/7592580
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            { urls: 'stun:stun.l.google.com:19305' },
            { urls: 'stun:stun1.l.google.com:19305' },
            { urls: 'stun:stun2.l.google.com:19305' },
            { urls: 'stun:stun3.l.google.com:19305' },
            { urls: 'stun:stun4.l.google.com:19305' },
            { urls: 'stun:stun.services.mozilla.org' },
            {
              urls: 'turn:numb.viagenie.ca',
              credential: 'muazkh',
              username: 'webrtc@live.com',
            },
            {
              urls: 'turn:192.158.29.39:3478?transport=udp',
              credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
              username: '28224511:1379330808',
            },
            {
              urls: 'turn:192.158.29.39:3478?transport=tcp',
              credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
              username: '28224511:1379330808',
            },
          ],
        },
      }
    },

    // Returns file's type in user's language
    fileType(file) {
      const { type } = file

      if (type.slice(0, 5) == 'video') {
        return app.i18n.t('fileTypes.video')
      }

      return app.i18n.t('fileTypes.file')
    },

    // Returns formatted file size
    formattedSize(size) {
      if (size < 1000) return size + ' bytes'
      else if (size < Math.pow(1000, 2))
        return Math.round((size / 1000) * 100) / 100 + 'KB'
      else if (size < Math.pow(1000, 3))
        return Math.round((size / Math.pow(1000, 2)) * 100) / 100 + 'MB'
      else return Math.round((size / Math.pow(1000, 3)) * 100) / 100 + 'GB'
    },

    /* ENCRYPTIONS */

    // Create AES key
    async createKey() {
      const key = await window.crypto.subtle.generateKey(
        {
          name: 'AES-CBC',
          length: 256, //can be  128, 192, or 256
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ['encrypt', 'decrypt']
      )

      const iv = window.crypto.getRandomValues(new Uint8Array(16))

      store.commit('keyAndIv', { key, iv })

      return await window.crypto.subtle.exportKey('raw', key)
    },

    // Encrypt data
    async encrypt(data) {
      return await window.crypto.subtle.encrypt(
        {
          name: 'AES-CBC',
          iv: store.state.iv,
        },
        store.state.key,
        data
      )
    },

    // Decrypt data
    async decrypt(data) {
      return await window.crypto.subtle.decrypt(
        {
          name: 'AES-CBC',
          iv: store.state.iv,
        },
        store.state.key,
        data
      )
    },

    /* MODALS */

    // Show modal
    modal(overlayContent, aLoadingOverlay = true) {
      $nuxt.$emit('modal', {
        showOverlay: true,
        overlayContent,
        aLoadingOverlay,
      })
    },

    // Hide modal
    hideModal() {
      $nuxt.$emit('modal', {
        showOverlay: false,
        overlayContent: '',
        aLoadingOverlay: false,
      })
    },
  }

  inject('utils', utils)
}
