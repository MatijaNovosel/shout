<template>
  <q-dialog :model-value="modelValue" @hide="$emit('update:modelValue', false)" persistent>
    <q-card dark class="language-select-dialog">
      <q-bar>
        <span> {{ $t("selectLanguage") }} </span>
        <q-space />
        <q-btn dense flat icon="close" @click="close">
          <q-tooltip>
            {{ $t("close") }}
          </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-option-group
          @update:model-value="languageChanged"
          v-model="state.selectedLang"
          :options="state.languages"
          color="orange"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, computed, watch } from "vue";
import { LANGUAGES } from "src/utils/constants";
import { Notify } from "quasar";
import UserService from "src/services/users";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

const props = defineProps({
  modelValue: {
    type: Boolean
  }
});

const emit = defineEmits(["update:modelValue"]);

const store = useStore();
const { t, locale } = useI18n({ useScope: "global" });

const state = reactive({
  selectedLang: "hr",
  languages: computed(() => {
    return [
      {
        label: t("english"),
        value: LANGUAGES.ENGLISH
      },
      {
        label: t("croatian"),
        value: LANGUAGES.CROATIAN
      }
    ];
  })
});

const close = () => {
  emit("update:modelValue", false);
};

const languageChanged = async () => {
  try {
    await UserService.updateLanguage(state.selectedLang, store.getters["user/user"].id);
    locale.value = state.selectedLang;
    await store.dispatch("user/changeLang", state.selectedLang);
    Notify.create({
      message: t("successfullyChangedLanguage"),
      position: "top",
      color: "dark",
      textColor: "orange"
    });
  } catch (e) {
    Notify.create({
      message: t("failedToChangeLanguage"),
      position: "top",
      color: "dark",
      textColor: "orange"
    });
  }
};

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      state.selectedLang = store.getters["user/user"].lang;
    }
  }
);
</script>

<style scoped lang="scss">
@import "src/utils/variables";

.language-select-dialog {
  width: 600px;
}
</style>
