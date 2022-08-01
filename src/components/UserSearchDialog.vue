<template>
  <q-dialog :model-value="modelValue" persistent>
    <q-card dark class="new-chat-dialog">
      <q-bar>
        <span> {{ $t("searchUsers") }} </span>
        <q-space />
        <q-btn dense flat icon="close" @click="close">
          <q-tooltip>
            {{ $t("close") }}
          </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-input
          clearable
          bg-color="blue-grey-10"
          dark
          dense
          rounded
          standout
          :placeholder="$t('searchForAUsername')"
          v-model="state.searchQuery"
          @update:model-value="search"
          :loading="state.searching"
        >
          <template #prepend>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
      </q-card-section>
      <q-separator dark />
      <q-card-section>
        <q-list dense dark>
          <template v-if="state.filteredUsers.length != 0">
            <q-item
              clickable
              v-ripple
              v-for="(user, i) in state.filteredUsers"
              :key="i"
              @click="selectUser(user)"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img :src="user.avatarUrl" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ `${user.username}#${user.shorthandId}` }}
                </q-item-label>
                <q-item-label caption>
                  {{ user.status }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <q-item v-else>
            <q-item-section avatar>
              <q-avatar>
                <img src="../assets/unknown.jpg" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label> {{ $t("noUsersFound") }}. </q-item-label>
              <q-item-label caption> {{ $t("enterNewSearchCriteria") }}. </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useStore } from "vuex";
import { debounce } from "quasar";
import UserService from "src/services/users";

defineProps({
  modelValue: {
    type: Boolean
  }
});

const emit = defineEmits(["update:modelValue", "user-selected"]);

const store = useStore();

const state = reactive({
  user: computed(() => store.getters["user/user"]),
  filteredUsers: [],
  searchQuery: null,
  searching: false
});

const close = () => {
  emit("update:modelValue", false);
};

const findUser = async () => {
  state.searching = true;
  state.filteredUsers = (await UserService.searchByUsername(state.searchQuery)).map((u) => ({
    username: u.username,
    avatarUrl: u.avatar_url,
    shorthandId: u.shorthand_id,
    status: u.status
  }));
  setTimeout(() => {
    state.searching = false;
  }, 400);
};

const search = debounce(findUser, 750);

const selectUser = (user) => {
  emit("user-selected", user);
};
</script>

<style scoped lang="scss">
@import "src/utils/variables";

.new-chat-dialog {
  width: 600px;
}
</style>
