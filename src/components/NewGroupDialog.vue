<template>
  <q-dialog :model-value="modelValue" persistent>
    <q-card dark class="new-chat-dialog">
      <q-bar>
        <span> Create new group </span>
        <q-space />
        <q-btn dense flat icon="close" @click="close">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-input
          bg-color="blue-grey-10"
          dark
          clearable
          dense
          rounded
          standout
          placeholder="Search for a username"
          v-model="state.searchQuery"
          @update:model-value="search"
          :loading="state.searching"
        >
          <template #prepend>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>
      </q-card-section>
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
                <q-item-label> {{ `${user.username}#${user.shorthandId}` }} </q-item-label>
                <q-item-label caption> Status </q-item-label>
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
              <q-item-label> No users found. </q-item-label>
              <q-item-label caption> Enter new search criteria. </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-separator dark />
      <q-card-section>
        <template v-if="state.selectedUsers.length !== 0">
          <q-chip
            @remove="removeSelectedUser(user)"
            removable
            color="grey-7"
            text-color="white"
            v-for="(user, i) in state.selectedUsers"
            :key="i"
          >
            <q-avatar>
              <img :src="user.avatarUrl" />
            </q-avatar>
            <div class="ellipsis">
              {{ `${user.username}#${user.shorthandId}` }}
              <q-tooltip> {{ `${user.username}#${user.shorthandId}` }} </q-tooltip>
            </div>
          </q-chip>
        </template>
        <div class="row justify-center" v-else>
          <q-chip color="grey-7" text-color="white">
            No users added, search for possible group members
          </q-chip>
        </div>
      </q-card-section>
      <q-card-section class="row justify-end">
        <q-btn
          :disable="state.selectedUsers.length === 0"
          size="sm"
          color="orange"
          @click="createGroup"
        >
          Create group
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, reactive, computed } from "vue";
import { useStore } from "vuex";
import { debounce } from "debounce";
import UserService from "src/services/users";
import ChatService from "src/services/chats";

export default defineComponent({
  name: "new-group-dialog",
  props: {
    modelValue: {
      type: Boolean
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
      selectedUsers: []
    });

    const close = () => {
      state.selectedUsers = [];
      state.searchQuery = null;
      emit("update:modelValue", false);
    };

    const findUser = async () => {
      state.searching = true;
      state.filteredUsers = await UserService.searchByUsername(props.users, state.searchQuery);
      setTimeout(() => {
        state.searching = false;
      }, 400);
    };

    const search = debounce(findUser, 750);

    const selectUser = (user) => {
      if (!state.selectedUsers.some((u) => u.id === user.id)) {
        state.selectedUsers.push(user);
      }
    };

    const createGroup = async () => {
      await ChatService.createGroup(
        {
          id: state.user.id,
          avatarUrl: state.user.avatarUrl,
          username: state.user.username,
          shorthandId: state.user.shorthandId
        },
        state.selectedUsers
      );
    };

    const removeSelectedUser = (val) => {
      state.selectedUsers = state.selectedUsers.filter((u) => u.id !== val.id);
    };

    return {
      state,
      close,
      search,
      selectUser,
      createGroup,
      removeSelectedUser
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
