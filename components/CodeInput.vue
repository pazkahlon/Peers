<template>
  <div :class="{ 'code-enterance': true, 'wrong-code': this.isWrong }">
    <b-input
      v-for="(input, index) in inputs"
      :ref="'i-' + index"
      :key="'i-' + index"
      @focus="SelectFocusedInput(index)"
      @paste.prevent="PasteInput"
      @input="InputChange($event, index)"
      @keyup="KeyupCalled($event, index)"
      v-model="input.value"
      type="text"
      maxlength="1"
      class="code-input"
    />
  </div>
</template>

<script>
export default {
  model: {
    prop: 'code',
    event: 'change',
  },
  props: {
    code: String,
  },
  data() {
    return {
      inputs: [
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
      ],
      isWrong: false, // Is token wrong?
    }
  },
  created() {
    this.$nuxt.$on('wrong-token', () => {
      this.isWrong = true
    })

    // sync the v-model
    for (let i = 0; i < Math.min(this.code.length, 6); i++) {
      this.inputs[i].value = this.code[i]
    }
  },
  mounted() {
    // focus on the first input
    this.$nextTick(() => {
      this.$refs['i-0'][0].focus()
    })
  },
  beforeDestroy() {
    this.$nuxt.$off('wrong-token', () => {
      this.isWrong = true
    })
  },
  methods: {
    // Focus on the next input on command given it's index.
    InputChange(value, index) {
      if (index < 5) {
        if (value.trim() !== '') {
          this.$nextTick(() => {
            this.$refs['i-' + (index + 1)][0].focus()
          })
        }
      }

      // notify of input change
      const code = this.inputs.map((i) => i.value).join('')
      this.$emit('change', code)
    },

    // If enter is pressed, emit the input.
    KeyupCalled(e, index) {
      if (e.code == 'Enter') {
        this.$emit('enter')
        this.$refs['i-' + index][0].blur()
      }

      if (e.code == 'Backspace' && index != 0) {
        this.$refs['i-' + (index - 1)][0].focus()
      }
    },

    // Pasting user's clipboard into the codeEnterance inputs.
    PasteInput(e) {
      const clipboard = e.clipboardData.getData('text/plain')
      for (let i = 0; i < Math.min(clipboard.length, 6); i++) {
        this.inputs[i].value = clipboard[i]
      }

      const code = this.inputs.map((i) => i.value).join('')
      this.$emit('change', code)
    },

    // Select the content of the focused input given its index.
    SelectFocusedInput(index) {
      this.$nextTick(() => {
        this.$refs['i-' + index][0].select()
      })

      // if the inputs are red, once the user starts editing again it reverts.
      if (this.isWrong) this.isWrong = false
    },

    // Emitting the input (for its parent component)
    EmitInput() {
      const n = this.inputs.map((i) => i.value)
      this.$nuxt.$emit('thatsTheInput', n.join(''))
    },
  },
}
</script>

<style lang="scss" scoped>
.code-enterance {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 90%;
  max-width: 500px;

  margin: 2rem -5px 0;
  input {
    min-width: 0;
    margin: 0 5px;
    height: 50px;
    max-width: 35px;
    border-radius: 5px;
    background-color: #dfdfdf;
    border: 2px solid #ebebeb;
    box-shadow: 0 0 0 1px #bbb;
    padding: 0;

    font-size: 24px;
    text-align: center;

    text-transform: uppercase;
    color: #444;

    flex-shrink: 0;

    &:focus,
    &.focus,
    &:not(:disabled):not(.disabled):active:focus {
      background-color: #ddd;
      border: 2px solid #ebebeb;
      box-shadow: 0 0 0 2px $product-color;
    }
  }
  &.wrong-code {
    input {
      box-shadow: 0 0 0 2px rgb(241, 52, 52);
    }
  }
}

[dir='rtl'] .code-enterance {
  flex-direction: row-reverse;
}
</style>
