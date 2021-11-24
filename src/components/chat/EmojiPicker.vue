<template>
  <div class="emoji-list">
    <q-tabs
      v-model="state.tab"
      dense
      class="text-grey"
      active-color="orange"
      indicator-color="orange"
      align="left"
    >
      <q-tab
        :name="category"
        :icon="formatTabIcon(category)"
        v-for="(category, i) in state.categories"
        :key="i"
      />
    </q-tabs>
    <q-input
      dark
      dense
      rounded
      clearable
      standout
      placeholder="Search emojis"
      class="q-pa-md emoji-search"
      v-model="state.emojiSearchText"
    >
      <template #prepend>
        <q-icon name="mdi-magnify" />
      </template>
    </q-input>
    <q-tab-panels v-model="state.tab" style="height: 92px" class="emoji-tab-panels q-pb-sm">
      <q-tab-panel
        class="q-py-none text-center"
        :name="category"
        v-for="(category, i) in state.categories"
        :key="i"
      >
        <template v-if="state.emojisComputed[category]">
          <span
            v-for="(emoji, i) in Object.entries(state.emojisComputed[category])"
            :key="i"
            class="cursor-pointer emoji"
            @click="insert(emoji[1])"
          >
            {{ emoji[1] }}
            <q-tooltip anchor="top middle" self="bottom middle"> :{{ emoji[0] }}: </q-tooltip>
          </span>
        </template>
        <span class="text-white" v-else> No emojis found. </span>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { defineComponent, reactive, computed, onMounted, onUnmounted } from "vue";
import emojis from "src/utils/emojis";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default defineComponent({
  name: "emoji-picker",
  props: {
    search: {
      type: String,
      default: ""
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      tab: "People",
      emojiSearchText: null,
      categories: ["People", "Nature", "Objects", "Places", "Symbols"],
      emojisComputed: computed(() => {
        if (state.emojiSearchText !== null && state.emojiSearchText !== "") {
          const obj = {};
          for (const category in emojis) {
            obj[category] = {};
            for (const emoji in emojis[category]) {
              if (new RegExp(`.*${escapeRegExp(state.emojiSearchText)}.*`).test(emoji)) {
                obj[category][emoji] = emojis[category][emoji];
              }
            }
            if (Object.keys(obj[category]).length === 0) {
              delete obj[category];
            }
          }
          return obj;
        }
        return emojis;
      })
    });

    const insert = (emoji) => {
      emit("emoji", emoji);
    };

    const escape = (e) => {
      if (e.keyCode === 27) {
        emit("close");
      }
    };

    const formatTabIcon = (category) => {
      switch (category) {
        case "People":
          return "mdi-emoticon";
        case "Nature":
          return "mdi-leaf";
        case "Objects":
          return "mdi-book-open-blank-variant";
        case "Places":
          return "mdi-map-marker";
        case "Symbols":
          return "mdi-triangle";
        default:
          return "mdi-circle";
      }
    };

    onMounted(() => {
      document.addEventListener("keyup", escape);
    });

    onUnmounted(() => {
      document.removeEventListener("keyup", escape);
    });

    return {
      state,
      insert,
      formatTabIcon
    };
  }
});
</script>

<style scoped lang="scss">
@import "src/utils/variables.scss";

.emoji-list {
  max-height: 200px;
  overflow-y: auto;
  background-color: $bg-dark-3;
}

.emoji-tab-panels {
  background-color: #1d2022;
}

.emoji-search {
  background-color: #1d2022;
}

.emoji {
  font-size: 26px;
}
</style>
