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
    <q-list dark>
      <q-item v-if="state.foundMessages.length === 0">
        <q-item-section>
          <q-item-label class="text-red-4"> No messages found. </q-item-label>
          <q-item-label caption> Try a different search query. </q-item-label>
        </q-item-section>
      </q-item>
      <template v-else>
        <div class="row justify-center">{{ state.foundMessages.length }} messages found.</div>
        <q-item
          clickable
          @click="selectMessage(msg)"
          v-for="(msg, i) in state.foundMessages"
          :key="i"
        >
          <q-item-section>
            <q-item-label class="text-orange"> {{ msg.username }} </q-item-label>
            <q-item-label class="text-grey-7" caption> {{ msg.txt }} </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label side> {{ format(msg.sentAt, "dd.MM.yyyy. HH:mm") }} </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { debounce } from "debounce";
import { MSG_TYPE } from "src/utils/constants";
import { format } from "date-fns";

const emit = defineEmits(["close", "scroll-to-message"]);

const props = defineProps({
  messages: {
    type: Array
  }
});

const state = reactive({
  searching: false,
  foundMessages: [],
  searchQuery: null
});

const searchMessages = async () => {
  if (state.searchQuery !== null && state.searchQuery !== "") {
    state.searching = true;
    state.foundMessages = props.messages.filter((msg) => {
      if (msg.type === MSG_TYPE.TXT) {
        return msg.txt.toLowerCase().includes(state.searchQuery.toLowerCase());
      }
      return false;
    });
    setTimeout(() => {
      state.searching = false;
    }, 400);
  } else {
    state.foundMessages = [];
  }
};

const search = debounce(searchMessages, 750);

const selectMessage = (msg) => {
  emit("scroll-to-message", msg.id);
};
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
