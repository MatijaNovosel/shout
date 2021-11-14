<template>
  <div class="column full-height index-bg justify-center items-center text-center">
    <img class="q-mb-lg" width="250" height="250" src="../assets/humanSitting.png" />
    <span class="text-grey-7"> Select a chat from the left pane or start a new one </span>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Index",
  setup() {
    return {};
  }
});
</script>

<style scoped lang="scss">
.index-bg {
  background-color: #262d31;
}
</style>
