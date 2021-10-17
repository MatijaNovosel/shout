<template>
  <div class="column justify-center items-center">
    <div class="col self-start q-pa-md">
      <q-btn
        @click="$emit('set-left-panel', 'conversations')"
        color="grey"
        icon="mdi-chevron-left"
        round
        flat
      />
    </div>
    <div class="col">
      <q-avatar size="200px">
        <img src="../../assets/me.jpg" />
      </q-avatar>
    </div>
    <div class="col q-pt-md">
      <span class="text-h6 text-grey"> Matija Novosel </span>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "profile",
  emits: ["set-left-panel"],
  setup() {
    const state = reactive({});

    return {
      state
    };
  }
});
</script>

<style scoped lang="scss"></style>
