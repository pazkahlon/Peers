<template>
  <main>
    <receive-steps @try-token="attemptConnection" />
  </main>
</template>

<script>
import SimplePeer from 'simple-peer'
import forge from 'node-forge'

export default {
  data() {
    return {
      socket: null,
      peer: null,
    }
  },
  methods: {
    // Try to connect to peer using the token via socket server
    attemptConnection(token) {
      if (token.length < 6) {
        this.$nuxt.$emit('wrong-token')
        return
      }

      if (!this.socket) {
        this.initiateSocket()
      }

      this.socket.emit('token', token.toLowerCase())
    },
    // Initiate socket & listeners
    initiateSocket() {
      this.socket = this.$nuxtSocket({
        persist: true,
      })

      this.socket.on('init-signal', (data) =>
        this.peer.signal(JSON.parse(data))
      )

      this.socket.on('connection-established', async () => {
        this.$utils.modal(this.$t('prompts.pairedAndWaiting'))

        this.$store.commit('initialcommunication', { receiver: true })

        this.initiatePeer()

        this.socket.emit('receiver-ready')
      })

      this.socket.on('wrong-token', () => {
        this.$nuxt.$emit('wrong-token')
      })
    },
    // Initiate peer & listeners
    initiatePeer() {
      this.peer = new SimplePeer({
        initiator: false,
        ...this.$utils.simplePeerProperties,
      })

      this.peer.on('signal', (data) =>
        this.socket.emit('init-signal', JSON.stringify(data))
      )

      this.peer.on('error', (err) => console.log('error', err))

      var publicKey, privateKey

      /** Generate Async keys on connection & Initiate handshake */
      this.peer.on('connect', async () => {
        this.$utils.modal(this.$t('prompts.connectedAndExchanging'))

        await forge.pki.rsa.generateKeyPair(
          { bits: 2048, workers: 2 },
          function (err, keypair) {
            publicKey = forge.pki.publicKeyToPem(keypair.publicKey)
            privateKey = keypair.privateKey
          }
        )

        this.peer.send(publicKey)
      })

      this.peer.on('data', async (data) => {
        // At this point, receiving only AES key or meta.
        const gotKey = data.slice(0, 3) == 'key'
        if (gotKey) {
          // Got Encrypted AES key
          data = data.slice(3)

          const iv = Buffer.from(
            privateKey.decrypt(data.toString().slice(0, 256)),
            'binary'
          )

          const rawKey = Buffer.from(
            privateKey.decrypt(data.toString().slice(256)),
            'binary'
          )

          const key = await window.crypto.subtle.importKey(
            'raw',
            rawKey,
            'AES-CBC',
            false,
            ['encrypt', 'decrypt']
          )

          this.$store.commit('keyAndIv', { key, iv })

          this.peer.send('meta')

          this.$utils.modal(this.$t('prompts.gettingFilesMeta'))
        } else {
          // Got Meta Information
          const meta = JSON.parse(
            new TextDecoder().decode(await this.$utils.decrypt(data))
          )

          this.$utils.hideModal()

          this.$router.push(
            this.localeLocation({
              name: 'progress',
              params: { peer: this.peer, meta },
            })
          )
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
