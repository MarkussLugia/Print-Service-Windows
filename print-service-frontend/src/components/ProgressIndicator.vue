<template>
  <div class="progress-indicator">
    <div class="file-icon"></div>
    <div class="info">
      <div class="filename">{{ manifest.name }}</div>
      <div class="progress">
        <div class="progress-text">{{ manifest.completed ? "上传完成" : Math.floor(manifest.progress) + "%" }}</div>
        <div class="progress-box" v-show="!manifest.completed">
          <div class="progress-bar" :style="'width:' + manifest.progress + '%'"></div>
        </div>
      </div>
    </div>
    <div class="remove-icon" @click="remove"></div>
  </div>
</template>
<script>
export default {
  name: 'ProgressIndicator',
  props: ['manifest'],
  methods: {
    remove() {
      this.$emit("remove")
    }
  },
};
</script>
<style>
.progress-indicator {
  box-sizing: border-box;
  margin: 10rem 0;
  padding: 0 16rem 0 2rem;
  height: 72rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  justify-content: flex-start;
  background-color: #454545;
}

.file-icon {
  width: 40rem;
  margin: 0 8rem 0 10rem;
  flex-grow: 0;
  flex-shrink: 0;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTggMTZoOHYySDh6bTAtNGg4djJIOHptNi0xMEg2Yy0xLjEgMC0yIC45LTIgMnYxNmMwIDEuMS44OSAyIDEuOTkgMkgxOGMxLjEgMCAyLS45IDItMlY4bC02LTZ6bTQgMThINlY0aDd2NWg1djExeiIvPjwvc3ZnPg==");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.info {
  flex-grow: 1;
  display: flex;
  flex-flow: column nowrap;
  text-align: left;
  justify-content: flex-start;
  margin: 8rem 0 0 2rem;
  overflow-x: hidden;
  letter-spacing: 0.5rem;
}

.filename {
  width: 100%;
  font-size: 20rem;
  line-height: 32rem;
  margin-top: 1rem;
  text-overflow: ellipsis;
  overflow: hidden;
  overflow-wrap: normal;
  white-space: nowrap;
}

.progress {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.progress-box {
  height: 10rem;
  border-radius: 8rem;
  margin-top: 3rem;
  background-color: #303030;
  overflow: hidden;
  flex-grow: 1;
  flex-shrink: 1;
}

.progress-bar {
  height: 100%;
  background-color: rgb(143, 143, 255);
  border-radius: 0 8rem 8rem 0;
  transition: all 300ms;
}

.progress-text {
  font-size: 18rem;
  line-height: 20rem;
  transform: skewX(-15deg);
  opacity: 0.7;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 54rem;
  max-width: 54rem;
  white-space: nowrap;
}

.remove-icon {
  width: 40rem;
  margin: 0 0 0 10rem;
  flex-grow: 0;
  flex-shrink: 0;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.95;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE2IDl2MTBIOFY5aDhtLTEuNS02aC01bC0xIDFINXYyaDE0VjRoLTMuNWwtMS0xek0xOCA3SDZ2MTJjMCAxLjEuOSAyIDIgMmg4YzEuMSAwIDItLjkgMi0yVjd6Ii8+PC9zdmc+")
}
</style>
