<template>
  <div>
    <navbar />
    <div id="app">
      <Player />
    </div>
  </div>
</template>

<script>
import Player from "./views/Player.vue";
import navbar from "./components/shared/navbar.vue";
import {initCourse,finishCourse} from "@/plugins/scorm/scorm_handler.js"

export default {
  name: "home",
  components: {
    Player,
    navbar
  },
  mounted(){
    initCourse()
    finishCourse("completed")
  }
};
</script>

<style>
@import url("./assets/css/styles.css");
</style>
