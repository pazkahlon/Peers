export const state = () => ({
  receiver: false,
  paired: false,
  connected: false,
  peer: null,
  key: '',
  iv: '',
})

export const mutations = {
  initialcommunication(state, { receiver }) {
    state.receiver = receiver
    state.paired = true
  },

  connected(state) {
    state.connected = true
  },

  peer(state, peer) {
    state.peer = peer
  },

  keyAndIv(state, { key, iv }) {
    state.key = key
    state.iv = iv
    delete state.privateKey
  },
}
