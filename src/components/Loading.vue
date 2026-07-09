<template>
  <div class="loading">
    <div class="circle circle-1"></div>
    <div class="circle circle-2"></div>
    <div class="circle circle-3"></div>
    <div class="circle circle-4"></div>
    <div class="circle circle-5"></div>
    <div class="circle circle-6"></div>
    <div class="circle circle-7"></div>
    <div class="circle circle-8"></div>
  </div>
</template>

<style lang="scss" scoped>
.loading {
  display: flex;
  place-items: center;
  place-content: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.5);
  .circle {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ffffff;
    margin: 5px;
    animation:color infinite 2s linear;
    position: absolute;
  }
  .circle-1 {
    transform: translate(0px ,-18px);
    animation-delay: 0s;
  }
  .circle-2 {
    transform: translate(13px ,-13px);
    animation-delay: 0.25s;
  }
  .circle-3 {
    transform: translate(18px ,0px);
    animation-delay: 0.5s;
  }
  .circle-4 {
    transform: translate(13px ,13px);
    animation-delay: 0.75s;
  }
  .circle-5 {
    transform: translate(0px ,18px);
    animation-delay: 1s;
  }
  .circle-6 {
    transform: translate(-13px ,13px);
    animation-delay: 1.25s;
  }
  .circle-7 {
    transform: translate(-18px ,0px);
    animation-delay: 1.5s;
  }
  .circle-8 {
    transform: translate(-13px ,-13px);
    animation-delay: 1.75s;
  }
  
  @keyframes color {
    0% {
      background-color: #ff7912;
    }
    100% {
      background-color: #f4f4f4;
    }
  }
}
</style>
