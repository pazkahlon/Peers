<template>
  <main>
    <!-- File selection -->
    <files-box v-if="!hasSelectedFiles" @files="initiateSocket" />

    <!-- Steps after file selection -->
    <send-steps :token="token" v-else />
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
      files: [],
      token: '',
    }
  },
  computed: {
    hasSelectedFiles() {
      return this.files.length > 0
    },
  },
  methods: {
    // Initiate socket & listeners
    initiateSocket(files) {
      this.files = files

      this.socket = this.$nuxtSocket({
        persist: true,
      })

      this.socket.on('init-signal', (data) =>
        this.peer.signal(JSON.parse(data))
      )

      this.socket.on('connection-established', () => {
        this.$utils.modal(this.$t('prompts.waitingForPeer'))
      })

      this.socket.on('receiver-ready', () => {
        this.$utils.modal(this.$t('prompts.pairedAndWaiting'))

        this.initiatePeer()
      })

      this.socket.emit('sender-init', (token) => {
        this.token = token
        this.$store.commit('initialcommunication', { receiver: false })
      })
    },
    // Initiate peer & listeners
    initiatePeer() {
      this.peer = new SimplePeer({
        initiator: true,
        ...this.$utils.simplePeerProperties,
      })

      this.peer.on('signal', (data) =>
        this.socket.emit('init-signal', JSON.stringify(data))
      )

      this.peer.on('error', (err) => console.log('error', err))

      /* on connection, start key exchange. */
      this.peer.on('connect', () => {
        this.$utils.modal(this.$t('prompts.connectedAndExchanging'))
      })

      this.peer.on('data', async (data) => {
        if (data == 'start') {
          this.$utils.hideModal()

          return this.$router.push(
            this.localeLocation({
              name: 'progress',
              params: { peer: this.peer, files: this.files },
            })
          )
        }

        if (data == 'meta') {
          this.$utils.modal(this.$t('prompts.sendingFilesMeta'))

          const meta = this.files.map((x) => {
            const { name, size } = x
            return { name, size }
          })

          const metaBuffer = new TextEncoder().encode(JSON.stringify(meta))
          return this.peer.send(await this.$utils.encrypt(metaBuffer))
        }

        /* Received Public Key */

        const publicKey = forge.pki.publicKeyFromPem(data)
        const AesKey = forge.util
          .createBuffer(await this.$utils.createKey())
          .getBytes()

        const encryptedKey = publicKey.encrypt(AesKey)
        const encryptedIv = publicKey.encrypt(
          forge.util.createBuffer(this.$store.state.iv).getBytes()
        )

        this.peer.send('key' + encryptedIv + encryptedKey)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
main {
  text-align: center;
}
</style>
