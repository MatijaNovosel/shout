<template>
  <q-dialog :model-value="modelValue" @hide="$emit('update:modelValue', false)" persistent>
    <q-card dark class="language-select-dialog">
      <q-bar>
        <span> Select language </span>
        <q-space />
        <q-btn dense flat icon="close" @click="close">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-option-group
          @update:model-value="languageChanged"
          v-model="state.selectedLang"
          :options="languages"
          color="primary"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { LANGUAGES } from "src/utils/constants";
import { Notify } from "quasar";
import UserService from "src/services/users";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "language-select-dialog",
  props: {
    modelValue: {
      type: Boolean
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const store = useStore();
    const i18n = useI18n();

    const state = reactive({
      selectedLang: "en"
    });

    const close = () => {
      emit("update:modelValue", false);
    };

    const languages = [
      {
        label: i18n.t("english"),
        value: LANGUAGES.ENGLISH
      },
      {
        label: i18n.t("croatian"),
        value: LANGUAGES.CROATIAN
      }
    ];

    const languageChanged = async () => {
      try {
        await UserService.updateLanguage(state.selectedLang, store.getters["user/user"].id);
        i18n.locale.value = "hr";
        Notify.create({
          message: "Successfully changed language",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      } catch (e) {
        Notify.create({
          message: "Failed to change language",
          position: "top",
          color: "dark",
          textColor: "orange"
        });
      }
    };

    return {
      state,
      close,
      languages,
      languageChanged
    };
  }
});
</script>

<style scoped lang="scss">
@import "src/utils/variables";

.language-select-dialog {
  width: 600px;
}
</style>
