<template>
  <div
    class="file-upload"
    @drop.prevent="dropped"
    @click="clicked"
    @focus="this.inputActive = false"
  >
    <input
      type="file"
      class="file-input"
      ref="input"
      multiple
      @change="inputUpload"
      :accept="InputFormats"
    />
    <div class="add-icon"></div>
    <!-- <div class="add-text">上传{{ acceptedFormats.join(' ') }}文件</div> -->
    <div class="add-text">上传PDF文件</div>
  </div>
</template>
<script>
export default {
  props: ['accept'],
  data() {
    return {
      files: [],
    };
  },
  computed: {
    acceptedFormats() {
      let formats = [];
      if (this.accept) {
        let a = this.accept;
        if (!Array.isArray(a)) {
          a = [a];
        }
        for (let i = 0; i < a.length; i++) {
          if (a[i].indexOf('.') == 0) {
            formats.push(a[i]);
          } else void 0;
        }
      }
      return formats;
    },
    InputFormats() {
      let formats = '';
      if (this.accept) {
        let a = this.accept;
        if (!Array.isArray(a)) {
          a = [a];
        }
        for (let i = 0; i < a.length; i++) {
          if (formats.length) {
            formats += ',';
          }
          if (a[i].indexOf('.') == 0) {
            formats += a[i];
          } else {
            switch (a[i]) {
              case 'image':
                formats += 'image/*';
                break;
              default:
                break;
            }
          }
        }
      }
      return formats;
    },
  },
  methods: {
    clicked() {
      this.$refs.input.click();
    },
    inputUpload() {
      this.emitFiles(this.$refs.input.files);
      this.$refs.input.value = ""
    },
    dropped(e) {
      this.emitFiles(e.dataTransfer.files);
    },
    emitFiles(fileList) {
      let files = [];
      for (let i = 0; i < fileList.length; i++) {
        if (
          this.acceptedFormats.indexOf(
            fileList[i].name.slice(fileList[i].name.lastIndexOf('.')),
          ) != -1
        )
          files.push(fileList[i]);
      }
      if (files.length) this.$emit('upload', files);
    },
  },
};
</script>
<style>
.file-upload {
  box-sizing: border-box;
  height: 100%;
  padding: 15rem 16rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
}
.file-input {
  position: absolute;
  display: none;
}
.add-text {
  flex-grow: 1;
  text-align: left;
  margin-left: 7rem;
  font-size: 28rem;
  line-height: 28rem;
  margin-top: 2rem;
  font-weight: bold;
  letter-spacing: 1rem;
}
.add-icon {
  width: 60rem;
  height: 60rem;
  flex-grow: 0;
  flex-shrink: 0;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.95;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48cGF0aCBkPSJNMTgsMTV2M0g2di0zSDR2M2MwLDEuMSwwLjksMiwyLDJoMTJjMS4xLDAsMi0wLjksMi0ydi0zSDE4eiBNNyw5bDEuNDEsMS40MUwxMSw3LjgzVjE2aDJWNy44M2wyLjU5LDIuNThMMTcsOWwtNS01TDcsOXoiLz48L2c+PC9zdmc+');
}
</style>
