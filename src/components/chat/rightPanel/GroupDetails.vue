<template>
  <div class="column items-center full-height bg">
    <div
      class="self-start justify-between row items-center q-pl-sm back-button-container full-width"
    >
      <div>
        <q-btn size="sm" color="grey" icon="mdi-close" round flat @click="$emit('close')" />
        <span class="text-white q-ml-sm"> Group details </span>
      </div>
      <div class="q-mr-md">
        <q-btn flat round color="red-5" icon="mdi-exit-to-app" />
      </div>
    </div>
    <q-avatar size="200px" class="q-my-lg">
      <img src="../../../assets/gopniks.jpg" />
    </q-avatar>
    <q-input
      dark
      label="Group name"
      :model-value="groupDetails.name"
      label-color="teal"
      class="full-width q-px-lg"
      readonly
    >
      <template #append>
        <q-icon size="xs" name="mdi-pencil" />
      </template>
    </q-input>
    <span class="text-grey self-start q-mt-sm q-ml-lg"> Created {{ groupDetails.createdAt }} </span>
    <q-input
      dark
      label="Description"
      :model-value="groupDetails.description"
      label-color="teal"
      class="full-width q-px-lg q-mt-md"
      readonly
    >
      <template #append>
        <q-icon size="xs" name="mdi-pencil" />
      </template>
    </q-input>
    <div class="column self-start q-pl-sm full-width">
      <q-list dark>
        <q-item>
          <q-item-section> Mute notifications </q-item-section>
          <q-item-section side>
            <q-checkbox dark v-model="state.muteNotifications" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="column self-start q-px-sm full-width q-mt-sm">
      <div class="row text-teal justify-between q-pl-md">
        <span> {{ groupDetails.users.length }} users </span>
        <q-btn color="grey" flat round size="sm" icon="mdi-magnify" />
      </div>
      <q-list dark>
        <q-item clickable v-for="(user, i) in groupDetails.users" :key="i">
          <q-item-section top avatar>
            <q-avatar>
              <img src="../../../assets/me.jpg" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ user.username }}
            </q-item-label>
            <q-item-label caption class="text-grey">
              {{ user.status }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "group-details",
  emits: ["close"],
  props: {
    groupDetails: {
      type: Object,
      required: true
    }
  },
  setup() {
    const state = reactive({
      muteNotifications: false
    });

    return {
      state
    };
  }
});
</script>

<style scoped lang="scss">
.bg {
  background-color: #131c21 !important;
}

.back-button-container {
  background-color: #323739;
  height: 58px;
}
</style>
