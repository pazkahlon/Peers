/**
 * A socket server for pairing the senders & receivers, via tokens.
 */
module.exports = class PeersSocketServer {
  constructor(io) {
    this.io = io
    this.unpairedSenders = {}
  }

  init() {
    console.log('Successfuly initiated')
    this.io.on('connection', (socket) => {
      /* Initiate sender & give token */
      socket.on('sender-init', async (callback = null) => {
        if (typeof callback != 'function' || socket.tokened) return

        const token = this.generateToken()

        this.unpairedSenders[token] = socket
        socket.tokened = true

        callback(token)
      })

      socket.on('token', (token) => {
        if (socket.tokened || typeof token != 'string') return

        const matchedSender = this.unpairedSenders[token]

        if (!matchedSender) {
          socket.emit('wrong-token')
          return
        }

        delete this.unpairedSenders[token]

        socket.tokened = true
        socket.pairedSocket = matchedSender
        matchedSender.pairedSocket = socket

        socket.emit('connection-established')
      })

      socket.on('receiver-ready', () => {
        if (socket.pairedSocket) {
          socket.pairedSocket.emit('receiver-ready')
        }
      })

      socket.on('init-signal', (signal) => {
        if (typeof signal != 'string') return

        if (socket.pairedSocket) {
          socket.pairedSocket.emit('init-signal', signal)
        }
      })

      socket.on('cancel', () => {
        if (socket.pairedSocket) {
          socket.pairedSocket.emit('peer-canceled')
          delete socket.pairedSocket // so it won't fire a peer-disconnected event
        }
      })

      socket.on('disconnect', () => {
        if (socket.pairedSocket) {
          socket.pairedSocket.emit('peer-disconnected')
        }
      })
    })
  }

  /* Generate a token for a client. */
  generateToken() {
    let a = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('')
    let b = []
    for (let i = 0; i < 6; i++) {
      let j = (Math.random() * (a.length - 1)).toFixed(0)
      b[i] = a[j]
    }

    const token = b.join('')

    if (!this.unpairedSenders[token]) return token
    else return this.generateToken()
  }
}
