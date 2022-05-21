<template>
  <transition name="stage1" enter-from-class="enter-from" enter-to-class="enter-to" leave-from-class="leave-from" leave-to-class="leave-to">
    <div class="master-box" v-if="stage == 'submitting' || stage == 'ready'">
      <div class="content">
        <div class="cover" v-if="stage == 'submitting'"></div>
        <div class="content-inner" :class="{ disabled: stage == 'submitting' }">
          <div class="uploader" :class="{ limit: files.length >= 5 }">
            <file-upload accept=".pdf" @upload="upload" v-show="(files.length < 5)" />
            <div class="upload-limit" v-show="(files.length >= 5)">文件数量已达到上限（5个）。</div>
          </div>
          <LineBreak v-show="files.length">上传的文件</LineBreak>
          <ProgressIndicator v-for="(file, index) in files" :key="index" :manifest="file" @remove="removeFile(file)"></ProgressIndicator>
          <LineBreak v-show="files.length">选项</LineBreak>
          <div class="switch-group" v-show="files.length">
            <SwitchBar class="switch" :active="color" @click="color = !color">彩色打印</SwitchBar>
            <SwitchBar class="switch" :active="duplex" @click="duplex = !duplex">双面打印</SwitchBar>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="error">
          <span v-if="serverDuplex">似乎有人正在执行双面打印，<br />请稍后提交打印。</span>
          <span v-else>{{ errmsg }}</span>
        </div>
        <AnimatedButton class="animated-button" :active="stage != 'ready'" :disabled="!printReady || serverDuplex" @click="submitPrint()">提交打印</AnimatedButton>
      </div>
    </div>
  </transition>
  <transition name="stage2" enter-from-class="enter-from" enter-to-class="enter-to" leave-from-class="leave-from" leave-to-class="leave-to">
    <div class="master-box" v-if="stage == 'duplexSubmitting' || stage == 'duplexWaiting'">
      <div class="duplex-info">需要将纸张翻面以继续双面打印。</div>
      <FlipAnimation class="flip-animation"></FlipAnimation>
      <div class="bottom">
        <div class="error">
          <span>{{ errmsg }}</span>
        </div>
        <AnimatedButton class="animated-button" :active="stage != 'duplexWaiting'" @click="continueDuplex()">继续双面打印</AnimatedButton>
      </div>
    </div>
  </transition>
  <transition name="stage3" enter-from-class="enter-from" enter-to-class="enter-to" leave-from-class="leave-from" leave-to-class="leave-to">
    <div class="master-box" v-if="stage == 'finished'">
      <div class="duplex-info">打印操作完毕，谢谢惠顾。</div>
      <LineBreak>观星</LineBreak>
      <div class="duplex-info stargaze">天高云耀彗赫隐，际远风啸流龙吟。</div>
      <PrintCompletion class="flip-animation"></PrintCompletion>
      <div class="bottom">
        <AnimatedButton class="animated-button" @click="reload()">再打印些什么</AnimatedButton>
      </div>
    </div>
  </transition>
</template>

<script>
import FileUpload from './components/FileUpload.vue';
import ProgressIndicator from './components/ProgressIndicator.vue';
import axios from 'axios';
import { ref } from 'vue';
import SwitchBar from './components/SwitchBar.vue';
import LineBreak from './components/LineBreak.vue';
import AnimatedButton from './components/animatedButton.vue';
import FlipAnimation from './components/FlipAnimation.vue';
import PrintCompletion from './components/PrintCompletion.vue';

function asyncModal(text) {
  return new Promise((resolve, reject) => {
    if (window.confirm(text)) resolve()
    else reject()
  })
}

export default {
  name: 'App',
  data() {
    return {
      stage: '',
      files: [],
      socket: {
        status: 3
      },
      duplex: false,
      color: false,
      errmsg: '',
      serverDuplex: false,
    };
  },
  components: {
    FileUpload,
    ProgressIndicator,
    SwitchBar,
    LineBreak,
    AnimatedButton,
    FlipAnimation,
    PrintCompletion
  },
  methods: {
    reload() {
      location.reload();
    },
    update() {
      if (this.stage == 'submitting' || this.stage == 'duplexSubmitting') return;
      axios.get('http://' + location.host + '/api/status').then(res => {
        this.serverDuplex = res.data.duplex.active;
        if (res.data.duplex.uuid && res.data.duplex.uuid == localStorage.getItem('duplexUuid')) {
          if (this.stage != 'duplexWaiting' && this.stage != 'duplexSubmitting') {
            this.stage = 'duplexWaiting'
          }
        }
      }).catch(err => {
        this.errmsg = err.toString()
      })
    },
    async upload(files) {
      if (!files) return;
      if (files.length + this.files.length > 5) {
        files = files.slice(0, 5 - this.files.length)
      }
      files.forEach(async file => {
        let e = {
          name: file.name,
          progress: ref(0),
          completed: ref(false),
          controller: new AbortController(),
          remoteName: ''
        }
        this.files.push(e)
        let form = new FormData();
        form.append('file', file);
        let { data } = await axios({
          method: 'post',
          url: 'http://' + location.host + '/api/upload',
          data: form,
          signal: e.controller.signal,
          onUploadProgress: p => {
            e.progress.value = 100 * p.loaded / p.total
          },
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (data.success) {
          setTimeout(() => {
            e.completed.value = true;
          }, 300);
          e.remoteName = data.path
        }
      });
    },
    submitPrint() {
      if (!this.files.length) return;
      asyncModal('要打印这' + this.files.length + '个文件吗？').then(() => {
        this.stage = 'submitting';
        let paths = []
        for (let i = this.files.length - 1; i >= 0; i--) {
          paths.push(this.files[i].remoteName)
        }
        console.log(paths);
        axios({
          method: 'post',
          url: 'http://' + location.host + '/api/print',
          data: {
            config: {
              paths,
              duplex: this.duplex,
              mono: !this.color,
            },
          },
        }).then((res) => {
          if (res.data.success) {
            if (res.data.uuid) {
              localStorage.setItem('duplexUuid', res.data.uuid);
              this.stage = 'duplexWaiting'
            }
            else this.stage = 'finished'
          } else {
            this.errmsg = res.data.err
            this.stage = 'ready'
            this.update()
          }
        }).catch(err => {
          this.errmsg = err.toString()
          this.stage = 'ready'
          this.update()
        })

      })
    },
    continueDuplex() {
      asyncModal('你确定全部偶数页已经打印完毕，并且已经入内按照提示翻转纸张了吗？').then(() => {
        this.stage = 'duplexSubmitting'
        axios({
          method: 'post',
          url: 'http://' + location.host + '/api/duplex',
        }).then(res => {
          if (res.data.success) this.stage = 'finished'
          else {
            this.errmsg = res.data.err
            this.stage = 'duplexWaiting'
            this.update()
          }
        }).catch(err => {
          this.errmsg = err.toString()
          this.stage = 'duplexWaiting'
          this.update()
        })
      })
    },
    removeFile(file) {
      asyncModal('要删除列表中的“' + file.name + '”吗？').then(() => {
        if (!file.completed.value) {
          file.controller.abort()
        }
        this.files.splice(this.files.indexOf(file), 1)
      })
    }
  },
  computed: {
    printReady() {
      if (this.files.length) {
        for (let i = 0; i < this.files.length; i++) {
          if (!this.files[i].completed) return false
        }
        return true
      } else return false
    }
  },
  mounted() {
    this.stage = 'ready'
    this.update()
    setInterval(() => {
      this.update()
    }, 5000);
  },
};
</script>

<style>
html,
body {
  background-color: black;
  padding: 0;
  margin: 0;
  font-size: 0.2vw;
}

#app {
  background-color: #202020;
  position: absolute;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #f0f0f0;
  max-width: 100vh;
  width: 100%;
  height: 100vh;
  left: 0;
  overflow: hidden;
}

@media (min-aspect-ratio: 1/1) {
  html {
    font-size: 0.2vh;
  }

  #app {
    left: calc(50vw - 50vh);
  }
}

.master-box {
  position: absolute;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  box-sizing: border-box;
  padding: 10rem 0;
  width: 100%;
  height: 100%;
  transition: all 420ms;
}

.enter-from {
  transform: translateX(15rem);
  opacity: 0;
}

.enter-to {
  transform: translateX(0);
  opacity: 1;
}

.leave-from {
  transform: translateX(0);
  opacity: 1;
}

.leave-to {
  transform: translateX(-15rem);
  opacity: 0;
}

.content {
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  position: relative;
}

.cover {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 255;
}


.content-inner {
  height: 100%;
  overflow-y: auto;
  transition: all 360ms;
}

.disabled {
  opacity: 0.4;
}


.uploader {
  border-radius: 8rem;
  box-sizing: border-box;
  background: linear-gradient(45deg, #32b573, #36AAB0);
  overflow: hidden;
  margin: 0 10rem 10rem;
  user-select: none;
}

.uploader.limit {
  background: #454545;
}

.upload-limit {
  box-sizing: border-box;
  padding: 8rem 0 7rem;
  font-size: 24rem;
  line-height: 42rem;
  transform: skewX(-15deg);
  text-align: left;
  padding-left: 16rem;
}

.progress-indicator {
  box-sizing: border-box;
  border-radius: 8rem;
  margin: 0 10rem 10rem;
}

.switch-group {
  display: flex;
  flex-flow: row wrap;
  box-sizing: border-box;
  margin: 0 5rem;
}

.switch {
  border-radius: 8rem;
  margin: 0 5rem 10rem;
  flex-grow: 1;
  min-width: 180rem;
  box-sizing: border-box;
  padding: 21rem 8rem 21rem 15rem;
  background-color: #454545;
  user-select: none;
}

.bottom {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  padding: 10rem 10rem 0;
}

.error {
  flex-grow: 1;
  text-align: left;
  font-size: 16rem;
  line-height: 24rem;
  margin-left: 5rem;
  color: #FF5050;
}

.animated-button {
  background: linear-gradient(45deg, #379FE0, #908FEE);
  font-size: 28rem;
  line-height: 32rem;
  border-radius: 8rem;
  letter-spacing: 2rem;
  user-select: none;
  flex-shrink: 0;
}

.duplex-info {
  flex-grow: 0;
  flex-shrink: 0;
  border-radius: 8rem;
  box-sizing: border-box;
  letter-spacing: 1rem;
  overflow: hidden;
  margin: 0 10rem 10rem;
  user-select: none;
  background: linear-gradient(45deg, #476FF0, #604FFF);
  box-sizing: border-box;
  padding: 10rem 0 9rem;
  font-size: 24rem;
  line-height: 42rem;
  text-align: left;
  padding-left: 16rem;
}

.flip-animation {
  flex-grow: 1;
  flex-shrink: 0;
}

.stargaze {
  background: radial-gradient(circle at left 500%, #3070D8 40%, #9AB4CF 59%, #48ABCF 62%, #3B406F);
}
</style>
