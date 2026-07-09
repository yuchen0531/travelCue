<script setup>
const props = defineProps({
  msg: String,
  isFinish: Boolean,
});

const emit = defineEmits(['close', 'next']);
</script>

<template>
  <div class="z-[99] model-frame" v-if="msg !== ''">
    <div class="notice-model px-3 py-8 text-xl">
      <p class="mb-5 font-bold text-center">{{ msg }}</p>
      <p
        class="tracking-widest mx-auto border-2 rounded-lg bg-[#093857] text-white px-3 py-1 w-fit"
        @click="isFinish ? emit('next') : emit('close')"
      >
        關閉
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.model-frame {
  z-index: 101;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  .notice-model{
    width: 80%;
    height: fit-content;
    background: #ffffff;
    border-radius: 22px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
    color: #676767;
  }
}
</style>
