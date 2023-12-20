export class transactionHandler {
  constructor(store, utils, filesOrMeta) {
    this.encrypt = utils.encrypt
    this.decrypt = utils.decrypt

    //this.MAX_CHUNK_SIZE = 262144 - 16 // minus padding of encryption
    this.MAX_CHUNK_SIZE = 100000
    this.bytesRead = 0
    this.currentFile = 0

    this.receiver = store.state.receiver
    this.files = filesOrMeta
  }

  async sendChunk() {
    var chunkBuffer
    await new Promise((resolve, reject) => {
      let reader = new FileReader()

      reader.onload = (e) => {
        if (e.target.error != null) return reject()

        chunkBuffer = new Uint8Array(e.target.result)
        this.bytesRead += chunkBuffer.byteLength
        resolve()
      }

      const slice = this.files[this.currentFile].slice(
        this.bytesRead,
        this.bytesRead + this.MAX_CHUNK_SIZE
      )
      reader.readAsArrayBuffer(slice)
    })

    const sizeBeforeEnc = chunkBuffer.byteLength

    const encryptedChunk = await this.encrypt(chunkBuffer)

    if (this.bytesRead == this.files[this.currentFile].size) {
      if (this.currentFile != this.files.length - 1) {
        this.bytesRead = 0
        this.currentFile++
      }
    }

    return { size: sizeBeforeEnc, chunk: encryptedChunk }
  }
}
