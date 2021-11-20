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
          :options="privilegesEnum"
          color="orange"
          type="checkbox"
          @update:model-value="privilegesChanged"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, reactive, computed, watch } from "vue";
import { useStore } from "vuex";
import { CHAT_PRIVILEGES } from "src/utils/constants";
import { useI18n } from "vue-i18n";
import UserService from "src/services/users";
import { Notify } from "quasar";

export default defineComponent({
  name: "edit-privileges-dialog",
  props: {
    modelValue: {
      type: Boolean
    },
    privileges: {
      type: Array
    },
    userId: {
      type: String
    },
    chatId: {
      type: String
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const store = useStore();
    const i18n = useI18n();

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

    const privilegesEnum = Object.entries(CHAT_PRIVILEGES).map((entry) => ({
      label: i18n.t(`privileges.${entry[0]}`),
      value: entry[1]
    }));

    const privilegesChanged = async () => {
      const newPrivileges = [...state.selectedPrivileges];
      try {
        await UserService.updatePrivileges(newPrivileges, props.userId, props.chatId);
        Notify.create({
          message: "Successfully changed privileges",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      } catch (e) {
        Notify.create({
          message: "Failed to change privileges",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      }
    };

    watch(
      () => props.privileges,
      (val) => {
        if (val) {
          state.selectedPrivileges = val;
        }
      }
    );

    return {
      state,
      close,
      privilegesEnum,
      CHAT_PRIVILEGES,
      privilegesChanged
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
