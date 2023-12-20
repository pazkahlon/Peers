<template>
  <b-container>
    <transition enter-active-class="zoomIn" appear>
      <!-- Box to upload files (when no file has been uploaded) -->
      <div
        v-if="files.length == 0"
        class="file-box"
        :class="{ hover: hoveringFileBox, 'bad-input': badInput }"
        key="t-1"
        @drop.prevent="addFiles"
        @dragenter.prevent="dragCounter++"
        @dragleave.prevent="dragCounter--"
        @dragover.prevent
      >
        <!-- Three dots on each side -->
        <div
          v-for="side of [
            'top-right',
            'top-left',
            'bottom-right',
            'bottom-left',
          ]"
          :key="side"
          class="balls-border"
          :class="side"
        >
          <div class="c c-one"></div>
          <div class="c c-two"></div>
          <div class="c c-three"></div>
        </div>

        <!-- Box content -->
        <main-transition>
          <div class="file-box-header">
            <h1 class="drag-here">{{ $t('send.dragHere') }}</h1>
            <h2 class="click-the-upload">{{ $t('send.orClickUpload') }}</h2>
          </div>
        </main-transition>
        <main-transition>
          <div class="file-box-upload-wrapper">
            <h2 class="maximum-limit">{{ $t('send.limit') }}</h2>
            <b-button class="upload-button" @click="$refs.files.click()">
              {{ $t('send.upload') }}
            </b-button>
          </div>
        </main-transition>
      </div>

      <!-- File list (after uploading at least 1 file) -->
      <div
        v-else
        class="file-box file-list"
        :class="{ hover: hoveringFileBox, 'bad-input': badInput }"
        key="t-2"
        @drop.prevent="addFiles"
        @dragenter.prevent="dragCounter++"
        @dragleave.prevent="dragCounter--"
        @dragover.prevent
      >
        <b-table
          class="files-table"
          :items="tableItems"
          :fields="fields"
          thead-class="d-none"
          responsive
        >
          <template #cell(removeBtn)="data">
            <b-button
              class="remove-file"
              @click="removeFile(data.index)"
              :title="$t('send.removeFile')"
              >{{ $t('send.removeFile') }}<span class="remove"></span
            ></b-button>
          </template>
          <template #cell(name)="data">
            <span class="file-name">{{ data.value }}</span>
          </template>
          <template #cell(type)="data">
            <span class="file-type">{{ data.value }}</span>
          </template>
          <template #cell(size)="data">
            <span class="file-size">{{ data.value }}</span>
          </template>
        </b-table>
        <div class="file-box-header">
          <h1 class="drag-here">{{ $t('send.dragToAdd') }}</h1>
          <h2 class="click-the-upload">{{ $t('send.orClickAdd') }}</h2>
        </div>
      </div>
    </transition>

    <!-- Buttons -->
    <div class="actions-with-files" v-if="files.length != 0">
      <transition-group
        enter-active-class="slideInUp"
        leave-active-class="slideOutDown"
        appear
      >
        <b-button key="t-3" variant="primary" @click="$refs.files.click()">
          {{ $t('send.addMore') }}
        </b-button>
        <b-button key="t-4" variant="primary" @click="$emit('files', files)">
          {{ $t('send.acceptAndContinue') }}
        </b-button>
      </transition-group>
    </div>

    <input
      type="file"
      ref="files"
      @change="addFiles"
      style="display: none"
      multiple
    />
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      dragCounter: 0,
      files: [],
      badInput: false,
      fields: [
        {
          key: 'removeBtn',
          tdClass: 'remove-file-td',
        },
        { key: 'name' },
        { key: 'type' },
        { key: 'size' },
      ],
    }
  },
  computed: {
    hoveringFileBox() {
      return this.dragCounter != 0
    },
    totalSize() {
      return this.files.reduce((r, c) => r + c.size, 0)
    },
    tableItems() {
      return this.files.map((file) => ({
        removeBtn: 0,
        name: file.name,
        type: this.$utils.fileType(file),
        size: this.$utils.formattedSize(file?.size),
      }))
    },
  },
  methods: {
    addFiles(e) {
      this.badInput = false
      this.dragCounter = 0

      const files = e.target.files || e.dataTransfer.files
      if (!files) return

      const sizes = this.totalSize + [...files].reduce((r, c) => r + c.size, 0)

      if (sizes > 20000000000) {
        this.badInput = true
        return
      }

      const areFilesIdentical = (fileOne, fileTwo) => {
        return (
          fileOne.name == fileTwo.name &&
          fileOne.size == fileTwo.size &&
          fileOne.lastModified == fileTwo.lastModified
        )
      }

      const notDuplicated = [...files].filter(
        (f) => !this.files.find((x) => areFilesIdentical(x, f))
      )

      this.files.push(...notDuplicated)
    },

    removeFile(i) {
      this.files.splice(i, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
.actions-with-files {
  margin-top: 1rem;
  .btn {
    margin: 0.5rem;
  }
}

.file-box {
  &.bad-input {
    box-shadow: 0 0 0 2px #e47e7e;
  }

  background-color: rgba(0, 0, 0, 0.03);
  border: 4px solid #ebebeb;
  box-shadow: 0 0 0 2px #d9d9d9;

  border-radius: 10px;

  height: 500px;
  max-height: calc(95vh - 320px);
  min-height: 350px;

  width: 800px;
  max-width: 100%;

  margin: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: $product-color;

  position: relative;

  transition: 0.2s all;

  .drag-here {
    font-size: 42px;
    margin-top: -2rem;
  }
  .click-the-upload {
    font-size: 24px;
  }

  .file-box-upload-wrapper {
    position: absolute;
    bottom: 1rem;

    .maximum-limit {
      font-size: 1rem;
      font-weight: normal;
    }

    .upload-button {
      font-size: 24px;
      padding: 12px 3rem;
    }
  }

  &.file-list {
    height: auto;
    color: #444;

    .file-box-header {
      width: calc(100% + 8px);
      border-top: 2px solid #d9d9d9;
      padding: 1rem 0;

      margin-top: auto;

      .drag-here {
        font-size: 21px;
        margin-top: 0;
      }
      .click-the-upload {
        font-size: 1rem;
        margin-bottom: 0;
      }
    }

    .files-table {
      width: 100%;

      ::v-deep tr:first-child td {
        border-top: none;
      }
      ::v-deep tr:not(:first-child) td {
        border-top: 1px solid #d4d4d4;
      }

      font-size: 21px;
      word-break: break-word;

      ::v-deep .remove-file-td {
        width: 31px;
      }

      .remove-file {
        font-size: 0;

        width: 31px;
        height: 31px;
        border-radius: 7px;

        flex-shrink: 0;
        padding: 2px 0 0;

        .remove {
          display: block;
          margin: auto;
          width: 21px;
          height: 21px;
          background-image: url('~assets/images/remove.svg');
          filter: brightness(0) invert(0.3);
        }
      }

      .file-type,
      .file-size {
        font-size: 1rem;
        padding: 3px 7px;
        white-space: nowrap;

        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
      }

      .file-size {
        background-color: transparent;
        border-color: #aaa;
        white-space: nowrap;
      }
    }
  }

  &.hover {
    scale: 1.1;
    background-color: rgba(0, 0, 0, 0.1);
    .balls-border .c {
      animation-iteration-count: infinite;
      &.c-one {
        animation-delay: 0s;
      }
      &.c-two {
        animation-delay: 0.16666s;
      }
      &.c-three {
        animation-delay: 0.33333s;
      }
    }
  }
}

.balls-border {
  position: absolute;

  .c {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: #bebebe;

    animation-name: loading-balls;
    animation-duration: calc(0.5s + 0.5s); // delay + iteration time
    animation-iteration-count: 1;

    &.c-one {
      animation-delay: calc(1s + 0.33333s);
    }

    &.c-two {
      animation-delay: calc(1s + 0.16666s);
      margin-top: -1;
      margin-left: 11px;
    }

    &.c-three {
      animation-delay: 1s;
      margin-top: -1;
      margin-left: 22px;
    }
  }

  &.top-left {
    top: 10px;
    left: 10px;
  }

  &.top-right {
    top: 10px;
    right: 10px;
    transform: rotateY(180deg);
  }

  &.bottom-left {
    bottom: 10px;
    left: 10px;
    transform: rotateX(180deg);
  }

  &.bottom-right {
    bottom: 10px;
    right: 10px;
    transform: rotateX(180deg) rotateY(180deg);
  }
}

[dir='rtl'] .balls-border {
  .c-two {
    animation-delay: calc(1s + 0.16666s);
    margin-left: 0;
    margin-right: 11px;
  }

  .c-three {
    animation-delay: 1s;
    margin-left: 0;
    margin-right: 22px;
  }

  &.top-left {
    left: 0;
    right: 10px;
  }

  &.top-right {
    right: 0;
    left: 10px;
    transform: rotateY(180deg);
  }

  &.bottom-left {
    left: 0;
    right: 10px;
    transform: rotateX(180deg);
  }

  &.bottom-right {
    right: 0;
    left: 10px;
    transform: rotateX(180deg) rotateY(180deg);
  }
}

@keyframes loading-balls {
  0% {
    background-color: #777;
  }

  50% {
    background-color: #bebebe;
  }

  100% {
    background-color: #bebebe;
  }
}
</style>
