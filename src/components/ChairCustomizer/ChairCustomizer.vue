<script lang="ts" src="./ChairCustomizer.ts"></script>

<template>
  <div class="container">
    <canvas id="canvas"></canvas>
    <div class="left_side">
      <button @click="selectPart('SEAT')">SEAT</button>
      <button @click="selectPart('ARMS')">ARM</button>
      <button @click="selectPart('LEGS')">LEG</button>
      <button @click="selectPart('BASE')">BASE</button>
      <button @click="selectPart('BACK')">BACK</button>
    </div>
    <div class="bottom_side">
      <button @click="changeChair()">Change Chair</button>
      <button @click="togglePart()">{{currentPartName}} Show/Hide</button>
      <img src="/assets/textures/wood-1.jpg" @click="changeMat(1)" />
      <img src="/assets/textures/wood-2.jpg" @click="changeMat(2)" />
      <img src="/assets/textures/wood-3.jpg" @click="changeMat(3)" />
      <img src="/assets/textures/wood-4.jpg" @click="changeMat(4)" />
      <img src="/assets/textures/color-1.jpg" @click="changeMat(5)" />
      <img src="/assets/textures/color-2.jpg" @click="changeMat(6)" />
    </div>
    <div class="screen-loading" v-if="isLoading">
        <p>Loading...</p>
        <p>{{loadingAmount}} / {{loadingTotal}}</p>
    </div>
  </div>
</template>

<style>
button{
    outline: 0;
}

.left_side {
  position: absolute;
  height: 100%;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0px 30px;
}

.left_side > button {
  background-color: #3498db;
  color: white;
  height: 50px;
  width: 100px;
  border-radius: 5px;
  border: none;
  margin: 2px 0px;
  cursor: pointer;
}

.left_side > button:hover {
  background-color: #5caadf;
}

.left_side > button:focus {
  background-color: #0688df;
}

.bottom_side {
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0px;
}

.bottom_side > button {
  background-color: #db345e;
  color: white;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  margin: 2px 0px;
  cursor: pointer;
  margin: 0px 10px;
}

.bottom_side > button:hover {
  background-color: #df5e7e;
}

.bottom_side > button:focus {
  background-color: #e01246;
}

.bottom_side > img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  cursor: pointer;
}

.bottom_side > img:hover {
  border-style: solid;
  border-color: darkolivegreen;
  border-width: 5px;
}

.screen-loading{
    position: absolute;
    top: 0;
    color: red;
    font-size: 2em;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    background: wheat;
}
</style>
