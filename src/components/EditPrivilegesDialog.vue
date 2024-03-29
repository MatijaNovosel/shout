<template>
  <q-dialog :model-value="modelValue" persistent>
    <q-card dark class="new-chat-dialog">
      <q-bar>
        <span> {{ $t("editPrivileges") }} </span>
        <q-space />
        <q-btn dense flat icon="close" @click="close">
          <q-tooltip>
            {{ $t("close") }}
          </q-tooltip>
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

<script setup>
import { reactive, computed, watch } from "vue";
import { useStore } from "vuex";
import { CHAT_PRIVILEGES } from "src/utils/constants";
import { useI18n } from "vue-i18n";
import UserService from "src/services/users";
import { Notify } from "quasar";

const props = defineProps({
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
});

const emit = defineEmits(["update:modelValue"]);
const store = useStore();
const { t } = useI18n({ useScope: "global" });

const state = reactive({
  filteredUsers: [],
  searchQuery: null,
  searching: false,
  selectedPrivileges: []
});

const close = () => {
  emit("update:modelValue", false);
};

const privilegesEnum = Object.entries(CHAT_PRIVILEGES).map((entry) => ({
  label: t(`privileges.${entry[0]}`),
  value: entry[1]
}));

const privilegesChanged = async () => {
  const newPrivileges = [...state.selectedPrivileges];
  try {
    await UserService.updatePrivileges(newPrivileges, props.userId, props.chatId);
    Notify.create({
      message: t("successfullyChangedPrivileges"),
      position: "top",
      color: "dark",
      textColor: "orange"
    });
  } catch (e) {
    Notify.create({
      message: t("failedToChangePrivileges"),
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
</script>

<style scoped lang="scss">
@import "src/utils/variables";

.new-chat-dialog {
  width: 600px;
}
</style>
