<template>
  <div class="emoji-list">
    {{ state.emojis }}
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
      required: false,
      default: ""
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      visible: false,
      emojis: computed(() => {
        if (props.search) {
          const obj = {};
          for (const category in emojis) {
            obj[category] = {};
            for (const emoji in emojis[category]) {
              if (new RegExp(`.*${escapeRegExp(props.search)}.*`).test(emoji)) {
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
      if (state.visible === true && e.keyCode === 27) {
        state.visible = false;
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
      insert
    };
  }
});
</script>

<style scoped lang="scss">
.emoji-list {
  max-height: 200px;
  overflow-y: auto;
}
</style>
