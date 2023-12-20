<template>
  <main>
    <main-transition>
      <b-container>
        <div class="progress-wrapper">
          <h1 class="header">{{ $t('progress.progress') }}</h1>

          <!-- Progress -->
          <div class="received-wrap">
            <h2 class="received" v-if="files.length != 1">
              {{
                $t('progress.perecentReceived', { percent: transferredPercent })
              }}
            </h2>
            <span class="received-transferred">{{
              $t('progress.sizeReceived', {
                received: transferredSize,
                total: totalSize,
              })
            }}</span>
          </div>

          <!-- Progress Bar -->
          <main-transition>
            <div
              role="progressbar"
              :aria-valuenow="transferredPercent"
              aria-valuemin="0"
              aria-valuemax="100"
              class="file-progress-bar"
            >
              <div
                class="file-progress-fill"
                :style="{ width: transferredPercent + '%' }"
              ></div>
            </div>
          </main-transition>

          <!-- Progress Soeed -->
          <div class="file-progress-speed">
            <h2 class="speed">{{ $t('progress.speed', { mbPerSecond }) }}</h2>
            <div
              class="file-progress-speed-bar"
              :style="{ 'background-position': speedBackgroundPosition }"
            ></div>
          </div>

          <!-- Files in queue -->
          <div class="files-queue" v-if="files.length > 1">
            <div class="queue-header-wrap">
              <h2 class="queue-header">{{ $t('progress.queue') }}</h2>
              <span class="queue-transferred">{{
                $t('progress.filesReceived', {
                  received: currentFileIndex,
                  total: files.length,
                })
              }}</span>
            </div>
            <ul>
              <li
                v-for="{ name, size, iterator } of filesForQueue"
                :key="iterator"
                :class="{ transferred: iterator <= currentFileIndex }"
              >
                <h3>{{ name }}</h3>
                <div class="single-file-progress-bar">
                  <div
                    v-if="currentFileIndex == iterator"
                    class="single-file-progress-fill"
                    :style="{
                      width: (currentFileTransferred / size) * 100 + '%',
                    }"
                  ></div>
                  <div
                    v-else-if="iterator < currentFileIndex"
                    class="single-file-progress-fill"
                    style="width: 100%"
                  ></div>
                  <div
                    v-else-if="iterator > currentFileIndex"
                    class="single-file-progress-fill"
                    style="width: 0"
                  ></div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Remaining time -->
        <span class="make-sure">
          {{ $t('progress.dontClose') }}
        </span>
        <h2 class="estimated-time-header">
          {{ $t('progress.estimatedTimeRemaining') }}
        </h2>
        <p class="estimated-time">{{ remainingTime }}</p>

        <!-- Cancel button / Done message -->
        <b-button
          v-if="!done"
          class="cancel-button"
          variant="primary black"
          @click="cancel"
          >{{ $t('progress.cancel') }}</b-button
        >
        <main-transition v-else>
          <div class="progress-done">
            <h3 class="progress-done-h">{{ $t('progress.done.header') }}</h3>
            <p class="progress-done-p">{{ $t('progress.done.description') }}</p>
          </div>
        </main-transition>

        <!-- Notes -->
        <span class="note">
          {{ $t('progress.note') }}
        </span>
      </b-container>
    </main-transition>
  </main>
</template>

<script>
export default {
  middleware({ store, redirect }) {
    if (!store.state.paired || !store.state.$nuxtSocket) {
      redirect('/')
    }
  },
  data() {
    return {
      socket: null,
      peer: null,
      files: [],

      currentFileIndex: 0,
      currentFileTransferred: 0,

      streamSaver: null,

      transferred: 0,
      transferredOverTheSecond: 0,
      arrayOfAverage: [],
      done: false,
    }
  },
  created() {
    // reuse the socket
    this.socket = this.$nuxtSocket({
      persist: true,
    })

    const { receiver } = this.$store.state

    this.files = this.$route.params[receiver === true ? 'meta' : 'files']
  },
  async mounted() {
    this.peer = this.$route.params.peer

    const { receiver } = this.$store.state

    const onCancel = (promptName) => {
      this.peer.removeAllListeners('data')
      this.$utils.modal(this.$t(promptName))

      window.onbeforeunload = null

      setTimeout(() => {
        location.reload()
      }, 3000)
    }

    window.onbeforeunload = () =>
      'Are you sure you want to leave? Any existing progress will be gone!'

    // Cancel on peer cancelation
    this.socket.on('peer-canceled', () => onCancel('prompts.peerCanceled'))

    // Cancel on peer disconnection
    this.socket.on('peer-disconnected', () =>
      onCancel('prompts.peerDisconnected')
    )

    // Apply logics
    if (receiver) {
      this.applyReceiverLogic()
    } else {
      this.applySenderLogic()
    }
  },
  computed: {
    total() {
      return this.files.reduce((r, { size }) => r + size, 0)
    },
    totalSize() {
      return this.$utils.formattedSize(this.total)
    },
    transferredSize() {
      return this.$utils.formattedSize(this.transferred)
    },
    transferredPercent() {
      return Math.floor((this.transferred / this.total) * 100)
    },
    speedBackgroundPosition() {
      if (this.mbPerSecond >= 3) {
        return '100%'
      } else {
        return Math.floor((this.mbPerSecond / 3) * 100) + '%'
      }
    },
    mbPerSecond() {
      if (this.arrayOfAverage.length != 0) {
        const sum = this.arrayOfAverage.reduce((a, b) => a + b, 0)
        const avg = sum / this.arrayOfAverage.length
        return Math.round((avg / Math.pow(10, 6)) * 10) / 10
      }
    },
    remainingTime() {
      if (this.done) {
        return this.$t('progress.complete')
      }
      if (this.arrayOfAverage.length != 0) {
        const sum = this.arrayOfAverage.reduce((a, b) => a + b, 0)
        if (sum > 0) {
          const avg = sum / this.arrayOfAverage.length
          return this.formattedTime((this.total - this.transferred) / avg)
        } else {
          return this.$t('progress.calculating')
        }
      }
      return this.$t('progress.calculating')
    },
    filesForQueue() {
      const files = this.files.map((file, index) => ({
        name: file.name,
        size: file.size,
        iterator: index,
      }))

      for (let i = 0; i < this.currentFileIndex; i++) {
        files.push(files.shift())
      }

      return files
    },
  },
  methods: {
    // Cancel prompt
    cancel() {
      if (confirm(this.$t('progress.cancelPrompt'))) {
        this.socket.emit('cancel')
        window.onbeforeunload = null
        location.reload()
      }
    },

    // Formatting time
    formattedTime(s) {
      const seconds = Math.round(s)

      if (seconds < 60) return this.$t('progress.seconds', { seconds })
      else if (seconds < 60 * 60)
        return this.$t('progress.minutes', {
          minutes: Math.round(seconds / 60),
        })
      else if (Math.round((seconds % (60 * 60)) / 60) == 0)
        return this.$t('progress.hours', {
          hours: Math.round(seconds / (60 * 60)),
        })
      else
        return this.$t('progress.hours', {
          hours: Math.round(seconds / (60 * 60)),
          minutes: Math.round((seconds % (60 * 60)) / 60),
        })
    },

    // Logic for Receiver
    async applyReceiverLogic() {
      this.streamSaver = require('streamsaver')
      if (!this.streamSaver.WritableStream) {
        this.streamSaver.WritableStream =
          require('web-streams-polyfill/ponyfill/es6').WritableStream
      }

      var fileStream = this.streamSaver.createWriteStream(
        this.files[this.currentFileIndex].name,
        {
          size: this.files[this.currentFileIndex].size,
        }
      )

      var writer = fileStream.getWriter()

      window.onunload = () => {
        fileStream.abort()
        writer.abort()
      }

      this.peer.removeAllListeners('data')

      this.peer.on('data', async (data) => {
        const chunk = await this.$utils.decrypt(data)
        writer.write(new Uint8Array(chunk))

        this.transferred += chunk.byteLength
        this.currentFileTransferred += chunk.byteLength
        this.transferredOverTheSecond += chunk.byteLength

        const isLast =
          this.currentFileTransferred == this.files[this.currentFileIndex].size

        if (isLast) {
          writer.close()

          this.currentFileIndex++

          if (this.currentFileIndex != this.files.length) {
            fileStream = this.streamSaver.createWriteStream(
              this.files[this.currentFileIndex].name,
              {
                size: this.files[this.currentFileIndex].size,
              }
            )

            writer = fileStream.getWriter()

            window.onunload = () => {
              fileStream.abort()
              writer.abort()
            }

            this.currentFileTransferred = 0

            this.peer.send('more')
          } else {
            window.onunload = null
            window.onbeforeunload = null
            this.done = true
          }
        } else {
          this.peer.send('more')
        }
      })

      this.peer.send('start')

      // creating interval for estimating speed & remaining time
      setInterval(() => {
        this.arrayOfAverage.push(this.transferredOverTheSecond)
        this.transferredOverTheSecond = 0
        if (this.arrayOfAverage.length > 20) {
          this.arrayOfAverage.shift() // shift array to the left (remove first element) so the array would contain only last 30 seconds
        }
      }, 1000)
    },

    // Logic for Sender
    async applySenderLogic() {
      const { transactionHandler } = require('~/plugins/transactionHandler')
      const handler = new transactionHandler(
        this.$store,
        this.$utils,
        this.$route.params.files
      )

      // Send initial chunk
      await this.sendChunkAndUpdate(handler)

      // creating interval for estimating speed & remaining time
      setInterval(() => {
        this.arrayOfAverage.push(this.transferredOverTheSecond)
        this.transferredOverTheSecond = 0
        if (this.arrayOfAverage.length > 30) {
          this.arrayOfAverage.shift() // shift array to the left (remove first element) so the array would contain only last 30 seconds
        }
      }, 1000)

      this.peer.removeAllListeners('data')
      this.peer.on('data', async (data) => {
        await this.sendChunkAndUpdate(handler)
      })
    },

    // Send chunk to receiver
    async sendChunkAndUpdate(handler) {
      const { size, chunk } = await handler.sendChunk()

      this.transferred += size
      this.currentFileTransferred += size
      this.transferredOverTheSecond += size

      if (
        this.currentFileTransferred == this.files[this.currentFileIndex].size
      ) {
        this.currentFileIndex++
        this.currentFileTransferred = 0

        if (this.currentFileIndex === this.files.length) {
          window.onbeforeunload = null
          this.done = true
        }
      }

      this.peer.send(chunk)
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  font-weight: bold;
  font-size: 3rem;
  margin-bottom: 1rem;
}

.container {
  text-align: center;
}

.progress-wrapper {
  display: inline-block;
  margin: auto;

  text-align: initial;
  width: 600px;
  max-width: 100%;

  .file-progress-bar {
    width: 100%;
    height: 45px;
    background-color: #d8d8d8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    border-radius: 5px;

    overflow: hidden;

    .file-progress-fill {
      height: 45px;
      background-color: #5fc232;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

      transition: all 0.5s;
    }
  }

  .file-progress-speed {
    margin: 1.5rem -0.5rem 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .speed {
      font-size: 21px;
      margin: 0 0.5rem;
      flex-shrink: 0;
    }

    .file-progress-speed-bar {
      height: 14px;
      width: 350px;
      margin: 0 0.5rem;

      border-radius: 5px;

      box-shadow: 0 2px 4px 0 rgba(155, 138, 0, 0.5);

      background-image: linear-gradient(270deg, #87e600 0%, #b90000 100%);
      background-size: 500%;

      transition: all 0.2s;
    }
  }
}

.received-wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .received {
    font-size: 21px;
  }

  .received-transferred {
    font-size: 18px;
  }
}

.make-sure {
  display: block;
  font-size: 18px;
  padding: 2rem 0;
}

.estimated-time-header {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 0;
}
.estimated-time {
  font-weight: bold;
  font-size: 24px;
}

.files-queue {
  .queue-header-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;

    .queue-header {
      font-size: 21px;
    }

    .queue-transferred {
      font-size: 1rem;
    }
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

    max-height: 150px;
    overflow: auto;
    overflow-x: hidden;

    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      padding: 0.5rem 0;
      border-bottom: 1px solid #ddd;
      margin: 0 -0.5rem;

      &.transferred h3 {
        color: #5fc232;
      }

      h3 {
        margin: 0 0.5rem;

        font-size: 1rem;
        color: #444;

        flex-shrink: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .single-file-progress-bar {
        margin: 0 0.5rem;

        width: 200px;
        max-width: 30vw;
        height: 7px;
        background-color: #d8d8d8;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        border-radius: 5px;

        flex-grow: 0;
        flex-shrink: 0;

        overflow: hidden;

        .single-file-progress-fill {
          height: 45px;
          background-color: #5fc232;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}

.cancel-button {
  display: block;
  margin: 10vh auto 2rem;
}

.progress-done {
  color: #3ba327;
  margin: 10vh auto 2rem;
  .progress-done-h {
    font-size: 21px;
    font-weight: 500;
    margin: 0;
    padding: 0;
  }
  .progress-done-p {
    font-size: 1rem;
    margin: 0;
    padding: 0;
  }
}
</style>
