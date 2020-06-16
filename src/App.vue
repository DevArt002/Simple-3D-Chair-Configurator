<template>
  <div id="app">
    <chair-customizer></chair-customizer>
  </div>
</template>

<script>
import ChairCustomizer from "./components/ChairCustomizer/ChairCustomizer";

export default {
  name: "app",
  components: {
    ChairCustomizer
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>