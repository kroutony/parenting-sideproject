<template>
  <div class="container"
       @drop.prevent.stop="dropTimelineEvent($event)"
       @dragenter.prevent.stop
       @dragover.prevent.stop
       ref="container"
       @touchend="touchEndAction($event)"
  >
    <audio src="src/assets/audio/bgm.mp3" ref="bgm"></audio>
    <div class="playground" :class="[playgroundOrientation()]" ref="playground">
      <div class="video-wrap" v-for="(c, i) in stageCharacters"
           :class="[{active: c === currentCharacterName && stageCharacters.length > 1}, `s${i+1}-${stageCharacters.length}`]"
           :style="videoWrapStyle(c)"
           @click="setCurrentCharacter(c)">
        <video :src="videoSource(c)" style="width: 100%" :class="`video_${i}`" muted="muted" playsinline preload=""></video>
      </div>
    </div>
    <div class="controls">
      <div class="add" @click="addCharacter($event)">
        <img src="src/assets/icons/toggle.png" alt="">
      </div>
      <div class="panel" :class="{'hide': hidePanel}">
        <div class="control-buttons">
          <div class="block">
            <div class="button icon" @click="hidePanel = !hidePanel">
              <img src="src/assets/icons/more.png" alt="">
            </div>
            <div class="button icon" @click="download">
              <img src="src/assets/icons/download.png" alt="">
            </div>
            <div class="button icon" @click="restart">
              <img src="src/assets/icons/restart.png" alt="">
            </div>
            <div class="button icon" @click="play" v-if="!playing">
              <img src="src/assets/icons/play.png" alt="">
            </div>
            <div class="button icon" @click="pause" v-if="playing">
              <img src="src/assets/icons/pause.png" alt="">
            </div>
          </div>
<!--          <div class="left block">-->
<!--            <div class="button icon" @click="download">-->
<!--              <img src="src/assets/icons/download.png" alt="">-->
<!--            </div>-->
<!--            <div class="button icon" @click="restart">-->
<!--              <img src="src/assets/icons/restart.png" alt="">-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="right block">-->
<!--            <div class="button icon" @click="play">-->
<!--              <img src="src/assets/icons/play.png" alt="">-->
<!--            </div>-->
<!--            <div class="button icon" @click="pause">-->
<!--              <img src="src/assets/icons/pause.png" alt="">-->
<!--            </div>-->
<!--          </div>-->

        </div>
        <div class="collapse" @click="hidePanel = !hidePanel">
          <div class="button">
            <img src="src/assets/icons/collpase.png" alt="">
          </div>
        </div>
        <div class="timeline" ref="timeline">
          <div class="progress-bar">
            <div class="indicator" :style="{'left': `${indicatorLeft}%`}"></div>
            <div class="action-wrap" ref="actionWrap">
              <div class="action" v-for="(action, i) in currentCharacter.timeline"
                   @drop.prevent.stop="dropAction($event, i)"
                   @dragenter.prevent.stop @dragover.prevent.stop
              >

                <div class="slot" draggable="true"
                     @dragstart="dragTimelineAction($event, i)"
                     @touchstart="touchTimelineAction($event, i)"
                     @touchmove="touchMoveAction($event)"
                     :data-timeline-index="i">
                  <img :src="actionIcon(action.actionType)" alt="" draggable="false" v-if="action.actionType !== 1">
                </div>
                <div class="bar" :style="timelineBarStyle(action)"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="action-wrap" draggable="false">
            <div class="action" draggable="true"
                 v-for="action in currentCharacter.actions.filter(action => action.type > 1)"
                 @dragstart="dragAction($event, action)"
                  @touchstart="touchAction($event, action)"
                  @touchmove="touchMoveAction($event)"
            >
              <img :src="action.icon" draggable="false">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    let defaultTimeline = [
      {actionType: 1},
      {actionType: 1},
      {actionType: 1},
      {actionType: 1},
      {actionType: 1},
      {actionType: 1},
      {actionType: 1},
      {actionType: 1},
      {actionType: 1},
      {actionType: 1},
    ]
    return {
      totalVideoLength: 60,
      lengthPerFrame: 6,
      totalFrames: 10,
      currentVideoTime: 0,
      currentFrame: 0,
      currentTimeInFrame: 0,
      playing: false,
      timer: null,
      hidePanel: true,
      indicatorLeft: 0,
      currentCharacterName: 'a',
      allCharacters: ['a', 'b', 'c', 'd'],
      stageCharacters: ['a'],
      characters: {
        a: {
          name: '康康',
          timeline: JSON.parse(JSON.stringify(defaultTimeline)),
          actions: [
            {
              type: 1,
              icon: 'http://fakeimg.pl/200x200',
              video: 'src/assets/video/a-1.mp4',
              background: 'rgb(247 183 136)'
            },
            {
              type: 2,
              icon: 'src/assets/img/action-2.jpg',
              video: 'src/assets/video/a-2.mp4',
              background: 'rgb(223 179 212)'
            },
            {
              type: 3,
              icon: 'src/assets/img/action-3.jpg',
              video: 'src/assets/video/a-3.mp4',
              background: 'rgb(164 216 204)'
            },
            {
              type: 4,
              icon: 'src/assets/img/action-4.jpg',
              video: 'src/assets/video/a-4.mp4',
              background: 'rgb(208 225 121)'
            },
          ]
        },
        b: {
          name: '心心',
          timeline: JSON.parse(JSON.stringify(defaultTimeline)),
          actions: [
            {
              type: 1,
              icon: 'http://fakeimg.pl/200x200',
              video: 'src/assets/video/b-1.mp4',
              background: 'rgb(208 225 121)'
            },
            {
              type: 2,
              icon: 'src/assets/img/action-1.jpg',
              video: 'src/assets/video/b-2.mp4',
              background: 'rgb(247 183 136)'
            },
            {
              type: 3,
              icon: 'src/assets/img/action-2.jpg',
              video: 'src/assets/video/b-3.mp4',
              background: 'rgb(223 179 212)'
            },
            {
              type: 4,
              icon: 'src/assets/img/action-3.jpg',
              video: 'src/assets/video/b-4.mp4',
              background: 'rgb(164 216 204)'
            },
          ]
        },
        c: {
          name: '樂樂',
          timeline: JSON.parse(JSON.stringify(defaultTimeline)),
          actions: [
            {
              type: 1,
              icon: 'http://fakeimg.pl/200x200',
              video: 'src/assets/video/c-1.mp4',
              background: 'rgb(164 216 204)'
            },
            {
              type: 2,
              icon: 'src/assets/img/action-4.jpg',
              video: 'src/assets/video/c-2.mp4',
              background: 'rgb(208 225 121)'
            },
            {
              type: 3,
              icon: 'src/assets/img/action-1.jpg',
              video: 'src/assets/video/c-3.mp4',
              background: 'rgb(247 183 136)'
            },
            {
              type: 4,
              icon: 'src/assets/img/action-2.jpg',
              video: 'src/assets/video/c-4.mp4',
              background: 'rgb(223 179 212)'
            },
          ]
        },
        d: {
          name: '奇奇',
          timeline: JSON.parse(JSON.stringify(defaultTimeline)),
          actions: [
            {
              type: 1,
              icon: 'http://fakeimg.pl/200x200',
              video: 'src/assets/video/d-1.mp4',
              background: 'rgb(223 179 212)'
            },
            {
              type: 2,
              icon: 'src/assets/img/action-3.jpg',
              video: 'src/assets/video/d-2.mp4',
              background: 'rgb(164 216 204)'
            },
            {
              type: 3,
              icon: 'src/assets/img/action-4.jpg',
              video: 'src/assets/video/d-3.mp4',
              background: 'rgb(208 225 121)'
            },
            {
              type: 4,
              icon: 'src/assets/img/action-1.jpg',
              video: 'src/assets/video/d-4.mp4',
              background: 'rgb(247 183 136)'
            },
          ]
        },
      },
      touchingAction: null,
      touchingTimelineAction: null
    }
  },
  mounted() {
    let progress = 0
    // setInterval(() => {
    //   this.setProgress(progress++)
    // }, 50)
    // this.play()
    // let orientationInitTimer()
  },
  computed: {
    currentCharacter() {
      return this.characters[this.currentCharacterName]
    }
  },
  watch: {
    currentVideoTime(value) {
      this.currentFrame = Math.floor(value / (this.lengthPerFrame * 1000))
      this.currentTimeInFrame = value - (this.currentFrame * this.lengthPerFrame) * 1000
      this.setProgress(value / (this.totalVideoLength * 1000) * 100)
      // console.log(value, this.currentFrame, this.currentTimeInFrame);

      this.stageCharacters.forEach((c, i) => {
        // this.playVideo(i)
        let time = this.currentTimeInFrame % 2000
        if(time % 1000 === 0 || time < 100) {
          this.setVideoTime(i, this.currentTimeInFrame)
          if(this.playing) {
            this.playVideo(i)
          }
        }
      })
    },
    playing(value) {
      if (value) {
        this.stageCharacters.forEach((c, i) => {
          this.playVideo(i)
        })
      } else {
        this.stageCharacters.forEach((c, i) => {
          this.stopVideo(i)
        })
      }
    },
    currentFrame() {

    },
  },
  methods: {
    addCharacter(e) {
      console.log(e);
      let c = this.allCharacters[this.stageCharacters.length]
      if(c) {
        this.stageCharacters.push(c)
      }
    },
    timelineBarStyle(timelineAction) {
      if(timelineAction.actionType === 1) {
        return {}
      }
      return {
        background: timelineAction.background
      }
    },
    setCurrentCharacter(name) {
      this.currentCharacterName = name
    },
    videoWrapStyle(name) {
      let action = this.getTimelineAction(name)
      if(!action) {
        return {}
      }
      return {
        background: action.background
      }
    },
    actionIcon(type) {
      if(type === 1) {
        return null
      }
      let action = this.currentCharacter.actions.find((action) => {
        return action.type === type
      })
      return action?.icon
    },
    getTimelineActionType(characterName) {
      let type = this.characters[characterName].timeline[this.currentFrame].actionType
      if(type === null) {
        type = 1
      }
      return type;
    },
    getTimelineAction(characterName) {
      let timelineActionType = this.getTimelineActionType(characterName)
      return this.characters[characterName].actions.find(action => action.type === timelineActionType)
    },
    getVideoDom(stageCharacterIndex) {
      return document.querySelector(`.video_${stageCharacterIndex}`)
    },
    setVideoTime(stageCharacterIndex, time) {
      let video = this.getVideoDom(stageCharacterIndex)
      time = time % 2000
      video.currentTime = time / 1000
    },
    playVideo(stageCharacterIndex) {
      let video = this.getVideoDom(stageCharacterIndex)
      if (video.src) {
        video.play()
      }
    },
    stopVideo(stageCharacterIndex) {
      let video = this.getVideoDom(stageCharacterIndex)
      if (video.src) {
        video.pause()
      }
    },
    playBgm() {
      this.$refs.bgm.play()
    },
    stopBgm() {
      this.$refs.bgm.pause()
    },
    resetBgm() {
      this.$refs.bgm.currentTime = 0
    },
    play() {
      if(this.timer) return
      this.playBgm()
      this.timer = setInterval(() => {
        this.currentVideoTime += 50
        this.playing = true
        if (this.currentVideoTime >= this.totalVideoLength * 1000) {
          this.stop()
        }
      }, 50)
    },
    pause() {
      clearInterval(this.timer)
      this.timer = null
      this.playing = false
      this.stopBgm()
    },
    stop() {
      clearInterval(this.timer)
      this.timer = null
      this.currentVideoTime = 0
      this.playing = false
      this.stopBgm()
    },
    download() {
      let payload = {
        sequence: this.stageCharacters,
        timeline: [

        ]
      }

      this.stageCharacters.forEach(name => {
        payload.timeline.push(this.characters[name].timeline.map(t => t.actionType))
      })
      console.log(JSON.stringify(payload));
      fetch('src/assets/video/a-1.mp4')
          .then(resp => {
            resp.blob()
                .then(blob => {
                  var url = window.URL.createObjectURL(blob)
                  var fileLink = document.createElement('a')
                  fileLink.href = url
                  fileLink.target = '_blank'
                  document.body.appendChild(fileLink)
                  fileLink.click()
                  // fileLink.remove()
                })

          })
    },
    restart() {
      clearInterval(this.timer)
      this.timer = null
      this.currentVideoTime = 0
      this.play()
      this.resetBgm()
    },
    videoSource(characterName) {
      let action = this.getTimelineAction(characterName)
      if(!action) {
        return null
      }

      return action.video
    },
    playgroundOrientation() {
      if (window.innerWidth >= window.innerWidth) {
        return `landscape c-${this.stageCharacters.length}`
      } else {
        return `portrait c-${this.stageCharacters.length}`
      }
      return '';
    },
    setProgress(progress) {
      if (progress > 100) {
        progress = 100
      }
      if (progress < 0) {
        progress = 0
      }
      let timeline = this.$refs.timeline,
          wrap = this.$refs.actionWrap,
          totalWidth = wrap.clientWidth

      let setProgressBarLeft = (left) => {
        this.indicatorLeft = left
      }

      let setTimelineScrollLeft = (left) => {
        timeline.scrollLeft = left
      }

      let overflowWidth = totalWidth - timeline.clientWidth + 20
      setProgressBarLeft(progress)

      if (overflowWidth <= 0) {
        // setProgressBarLeft(progress)
        setTimelineScrollLeft(0)
      } else {
        if (progress > 50) {
          let pixelPerUnit = totalWidth / 100;
          if (timeline.scrollLeft < overflowWidth) {
            // setProgressBarLeft(50)
            setTimelineScrollLeft((progress - 50) * pixelPerUnit)
          } else {
            setTimelineScrollLeft(overflowWidth)
            // setProgressBarLeft(50 + progress - (overflowWidth / wrap.clientWidth))
          }
        } else {
          // setProgressBarLeft(progress)
          setTimelineScrollLeft(0)
        }
      }
    },
    dragAction(e, action) {
      e.dataTransfer.setData('application/json', JSON.stringify(action))
    },
    touchAction(e, action) {
      // let actionEl = e.path.find(el => {
      //   return el.classList.contains('action')
      // })
      let actionEl = e.target.parentElement.classList.contains('action') ? e.target.parentElement : null
      if(actionEl) {
        this.touchingAction = action
        this.appendTouchingIcon(actionEl, {x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY})
      }
    },
    touchEndAction(e) {
      let dropTargets = document.elementsFromPoint(
          e.changedTouches[0].clientX,
          e.changedTouches[0].clientY
      );

      if(this.touchingAction) {
        let dropTarget = dropTargets.find(el => {
          return el.classList.contains('slot')
        })

        if(dropTarget) {
          let action = this.touchingAction
          let timelineIndex = parseInt(dropTarget.dataset.timelineIndex)
          this.characters[this.currentCharacterName].timeline[timelineIndex].actionType = action.type
          this.characters[this.currentCharacterName].timeline[timelineIndex].background = action.background
        }

        this.touchingAction = null
      } else if(this.touchingTimelineAction !== null)  {
        let dropInPanel = dropTargets.find(el => {
          return el.classList.contains('panel')
        })

        if(!dropInPanel) {
          this.characters[this.currentCharacterName].timeline[this.touchingTimelineAction].actionType = 1
          this.touchingTimelineAction = null
        }
      }
      this.removeTouchIcon()
    },
    touchMoveAction(e) {
      let el = document.querySelector('.dragging')
      if(el) {
        let pos = {x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY}
        el.style.left = `${pos.x - 30}px`
        el.style.top = `${pos.y - 30}px`
      }
    },
    removeTouchIcon() {
      let el = document.querySelector('.dragging')
      if(el) {
        el.remove()
      }
    },
    appendTouchingIcon(appendEl, pos) {
      if(!document.querySelector('.dragging')) {
        let el = appendEl.cloneNode(true)
        el.classList.add('dragging')
        el.style.left = `${pos.x - 30}px`
        el.style.top = `${pos.y - 30}px`
        document.body.append(el)
      }
    },
    dropAction(e, timelineIndex) {
      let action = JSON.parse(e.dataTransfer.getData('application/json'))
      this.characters[this.currentCharacterName].timeline[timelineIndex].actionType = action.type
      this.characters[this.currentCharacterName].timeline[timelineIndex].background = action.background
    },
    touchTimelineAction(e, timelineIndex) {
      this.touchingTimelineAction = timelineIndex
      let actionEl = document.querySelector(`[data-timeline-index="${timelineIndex}"]`)
      if(actionEl) {
        this.appendTouchingIcon(actionEl, {x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY})
      }

    },
    dragTimelineAction(e, timelineIndex) {
      e.dataTransfer.setData('text/plain', timelineIndex)
    },
    dropTimelineEvent(e) {
      let timelineIndex = e.dataTransfer.getData('text/plain')
      this.characters[this.currentCharacterName].timeline[timelineIndex].actionType = 1
    },
  }
}
</script>

<style scoped>

</style>