<template>
  <q-page class="flex flex-center">
    <div
      class="row text-center items-center main-container"
      :style="{ width: `${state.width - 300}px` }"
    >
      <div class="col-12">Hello</div>
      <q-resize-observer @resize="changeMainContainerWidth" />
    </div>
  </q-page>
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
</style>
