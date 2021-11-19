<template>
  <q-dialog :model-value="modelValue" persistent>
    <q-card dark class="new-chat-dialog">
      <q-bar>
        <span> Edit privileges </span>
        <q-space />
        <q-btn dense flat icon="close" @click="close">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-option-group
          v-model="state.selectedPrivileges"
          :options="privileges"
          color="teal"
          type="checkbox"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, reactive, computed, watch } from "vue";
import { useStore } from "vuex";
import { CHAT_PRIVILEGES } from "src/utils/constants";
// import UserService from "src/services/users";

export default defineComponent({
  name: "edit-privileges-dialog",
  props: {
    modelValue: {
      type: Boolean
    },
    privilges: {
      type: Array
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const store = useStore();

    const state = reactive({
      user: computed(() => store.getters["user/user"]),
      filteredUsers: [],
      searchQuery: null,
      searching: false,
      selectedPrivileges: []
    });

    const close = () => {
      emit("update:modelValue", false);
    };

    const privileges = Object.entries(CHAT_PRIVILEGES).map((entry) => ({
      label: entry[0],
      value: entry[1]
    }));

    watch(
      () => props.privileges,
      (val) => {
        if (val) {
          console.log(val);
          state.selectedPrivileges = val;
        }
      },
      {
        deep: true,
        immediate: true
      }
    );

    return {
      state,
      close,
      privileges,
      CHAT_PRIVILEGES
    };
  }
});
</script>

<style scoped lang="scss">
@import "src/utils/variables";

.new-chat-dialog {
  width: 600px;
}
</style>
