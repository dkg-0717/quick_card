<template>
  <div class="player" @mouseover="over" @mouseleave="leave">
    <div class="shadow"></div>
    <div id="loader" class="loader-anim">
      <div class="loader-anim-obj loader-4"></div>
    </div>
    <div class="playButton" @click="playSound">
      <figure>
        <template v-if="isLoaded && !playing">
          <img class="playButton--img" src="../assets/play.png" alt="">
        </template>
        <template v-if="isLoaded && playing">
          <img class="playButton--img" src="../assets/pause.png" alt="">
        </template>
      </figure>
    </div>
    <div class="info">
      <p class="title">{{ getsoundName }}</p>
    </div>
    <!-- <div class="progress"></div> -->
  </div>
</template>

<script>
// @ is an alias to /src
import { createjs } from "../../node_modules/soundjs/lib/soundjs";
import { TimelineMax, Elastic } from "gsap";

export default {
  name: "player",
  data(){
    return {
      sound: null,
      segundos: 0,
      player: null,
      playing: false,
      interval: null,
      progress: null,
      playButton: null,
      progressBar: null,
      sounds:["estilosdeaprendizaje"],
      shadow: null,
      loader: null,
      info: null,
      isLoaded: false
    }
  },
  components: {},
  computed:{
    getsoundName(){
      return this.sounds[0]
    },
    // getImage(){
    //   if(!this.playing){
    //     return play;
    //   }else{
    //     return pause;
    //   }
    // },
  },
  methods:{
    playSound(){
      this.stopAnimation()
      this.isPlaying()
      this.leave()
      this.setBackground()
    },
    isPlaying(){
       if(!this.playing){
         if(this.sound){
           this.resumeSound()
         }else{
           this.initSound()
         }
      }else{
        this.pauseSound()
      }
    },
    resumeSound(){
      this.playing = true;
      this.sound.paused = false;
      this.initInterval(this.sound)
    },
    pauseSound(){
        this.playing = false;
        this.sound.paused = true
        // this.stopInterval()
        this.tl.progress(0.25)
    },   
    progressEvent(sound){
      this.initInterval(sound)
    },
    incrementProgress(){
      this.progressBar.style.width = `${this.segundos}%`;
    },
    initInterval(sound){
      this.progress = (sound.duration/1000);
      this.interval = setInterval(()=>{
          this.segundos += 100/this.progress;
          // this.incrementProgress()
      },1000)
    },
    stopInterval(){
      clearInterval(this.interval)
    },
    initSound(){
      this.playing = true;
      this.sound = createjs.Sound.play("estilosdeaprendizaje")
      this.sound.on("complete", this.stopInterval)
      this.initInterval(this.sound)    
    },
    setBackground(){
      let image = require("../assets/estilos.png")
      this.player.style.background = `url(${image}) no-repeat center`;
      this.player.style.backgroundSize  = "cover";
    },
    over(){
      this.shadow.style.opacity = "1";
      this.playButton.style.opacity = "1";
    },
    leave(){
      if(this.playing){
        this.shadow.style.opacity = "0";
        this.playButton.style.opacity = "0";
      }
    },
    loaded(){
      this.loader.style.display = "none";
      this.isLoaded = true;
      this.startAnimation()
    },
    stopAnimation(){
      this.tl.kill()
    },
    startAnimation(){
      this.tl = new TimelineMax()
      this.tl.set(this.playButton,{opacity:1,cursor:"pointer"})
             .from(this.playButton,1,{scale:0, ease: Elastic.easeOut.config(1, 0.3)})
             .fromTo(this.info,0.7,{opacity:0},{opacity:1})
             .fromTo(this.playButton,1,{scale:1},{scale:1.1, yoyo:true, repeat:-1})
    },
    loadSounds(){
      this.sounds.map((sound)=>{
        let complete_path = require(`../assets/sounds/${sound}.mp3`);
            createjs.Sound.registerSound(complete_path, sound);
            createjs.Sound.on("fileload",this.loaded)
      })
    }
  },
  mounted(){
    this.loadSounds()
    this.player = document.querySelector('.player')
    this.shadow = document.querySelector(".shadow")
    this.playButton = document.querySelector(".playButton")
    this.progressBar = document.querySelector(".progress")
    this.loader = document.getElementById("loader")
    this.info = document.querySelector(".info")
  }
};
</script>

<style scoped>
@import url("../assets/css/loader.css");
@import url("../assets/css/player.css");

.player {
  width: 500px;
  height: 500px;
  max-width: 500px;
  max-height: 500px;
  border-radius: 2%;
  overflow: hidden;
  position: relative;
  transition: all 400ms;
  box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.2);
  background-size: cover;
  background: url("../assets/cinepolis.png");
  background-repeat: no-repeat;
  background-position: center;
}

.player:hover{
  transform: scale(1.01);
  box-shadow: 0 25px 55px rgba(0,0,0,.2), 0 16px 28px rgba(0,0,0,.24);
}

.playButton {
  top: 50%;
  left: 50%;
  height: 300px;
  width: 300px;
  border-radius: 50%;
  display: flex;
  position: absolute;
  transition: opacity 700ms;
  transform: translate(-50%, -50%);
  background: #ffffff;
  justify-content: center;
  align-items: center;
  opacity: 0;
  cursor: pointer;
}

.playButton--img{
  width:100%;
  height: 100%;
  transition: all 400ms;
}

.info {
  left: 30px;
  bottom: 30px;
  color: #ffffff;
  position: absolute;
}

.title{
  font-size: 1.3em;
}

.progress {
  width: 0%;
  height: 5px;
  bottom: 0;
  transition: width 700ms;
  position: absolute;
  background: #FFFFFF;
}
.shadow {
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  opacity: 1;
  position: absolute;
  transition: all 700ms;
  background: rgba(0, 0, 0, 0.5);
}

</style>
