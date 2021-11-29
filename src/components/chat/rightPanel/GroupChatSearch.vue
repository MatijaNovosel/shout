<template>
  <div class="column full-height bg">
    <div
      class="self-start justify-between row items-center q-pl-sm back-button-container full-width"
    >
      <div>
        <q-btn size="sm" color="grey" icon="mdi-close" round flat @click="$emit('close')" />
        <span class="text-white q-ml-sm"> Search messages </span>
      </div>
    </div>
    <q-input
      v-model="state.searchQuery"
      @update:model-value="search"
      :loading="state.searching"
      dark
      placeholder="Search messages"
      label-color="orange"
      class="full-width q-px-lg q-my-md"
      bg-color="blue-grey-10"
      dense
      rounded
      standout
    >
      <template #append>
        <q-icon size="xs" name="mdi-magnify" />
      </template>
    </q-input>
    <q-list dark class="q-ml-sm">
      <q-item v-if="state.foundMessages.length === 0">
        <q-item-section>
          <q-item-label class="text-red-4"> No messages found. </q-item-label>
          <q-item-label caption> Try a different search query. </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { debounce } from "debounce";

export default defineComponent({
  name: "group-chat-search",
  emits: ["close"],
  props: {
    messages: {
      type: Array
    }
  },
  setup() {
    const state = reactive({
      searching: false,
      foundMessages: [],
      searchQuery: null
    });

    const searchMessages = async () => {
      state.searching = true;
      state.foundMessages = [];
      setTimeout(() => {
        state.searching = false;
      }, 400);
    };

    const search = debounce(searchMessages, 750);

    return {
      state,
      search
    };
  }
});
</script>

<style scoped lang="scss">
@import "src/utils/variables";

.bg {
  background-color: $bg-dark-2 !important;
}

.back-button-container {
  background-color: $bg-dark-1;
  height: 58px;
}
</style>
