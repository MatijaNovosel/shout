<template>
  <div class="row justify-center items-center text-center full-height">Hello</div>
</template>

<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "PageIndex",
  setup() {
    const state = reactive({
      width: 0
    });

    const changeMainContainerWidth = () => {
      state.width = window.innerWidth - 100;
      console.log(state.width);
    };

    return {
      changeMainContainerWidth,
      state
    };
  }
});
</script>

<style scoped lang="scss">
.main-container {
  height: calc(100vh - 38px);
  background-color: #262d31;
}
.user-list {
  background-color: #131c21;
}
.chat-top {
  background-color: #2a2f32;
}
.chat-panel {
  border-left: 1px solid rgba(241, 241, 242, 0.11);
}
</style>
