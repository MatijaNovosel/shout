<template>
  <q-item clickable v-ripple @click="$router.push(getRoute())">
    <q-item-section avatar>
      <q-avatar>
        <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label lines="1">
        <q-icon :name="getConversationIcon()" class="q-mb-xs" color="grey-6" />
        {{ conversation.name }}
      </q-item-label>
      <q-item-label caption lines="1">
        {{
          `${conversation.lastMsg.you ? "You: " : `${conversation.lastMsg.username}: `}${
            conversation.lastMsg.txt
          }`
        }}
      </q-item-label>
    </q-item-section>
    <q-item-section side top>
      {{ formatDistanceToNow(new Date(conversation.lastMsg.sentAt)) }} ago
    </q-item-section>
    <q-menu
      dark
      touch-position
      context-menu
      v-if="
        conversation.type === CONVERSTATION_TYPE.PRIVATE ||
        conversation.type === CONVERSTATION_TYPE.GROUP
      "
    >
      <q-list dense style="min-width: 100px">
        <q-item clickable v-close-popup>
          <q-item-section>Archive chat</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>Mute notifications</q-item-section>
        </q-item>
        <q-item clickable v-close-popup v-if="conversation.type === CONVERSTATION_TYPE.PRIVATE">
          <q-item-section>Delete chat</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>Pin chat</q-item-section>
        </q-item>
        <q-item clickable v-close-popup v-if="conversation.type === CONVERSTATION_TYPE.GROUP">
          <q-item-section>Exit group</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>Mark as unread</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";
import { CONVERSTATION_TYPE } from "../utils/constants";
import { formatDistanceToNow } from "date-fns";
import { ROUTE_NAMES } from "src/router/routeNames";

export default defineComponent({
  name: "conversation-list-item",
  props: {
    conversation: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const getConversationIcon = () => {
      switch (props.conversation.type) {
        case CONVERSTATION_TYPE.PRIVATE:
          return "mdi-account-supervisor";
        case CONVERSTATION_TYPE.GROUP:
          return "mdi-account-group";
        case CONVERSTATION_TYPE.SELF:
          return "mdi-account";
        default:
          return "mdi-circle";
      }
    };

    const getRoute = () => {
      const route = {
        params: {
          id: props.conversation.id
        }
      };

      switch (props.conversation.type) {
        case CONVERSTATION_TYPE.PRIVATE:
          route.name = ROUTE_NAMES.PRIVATE_CHAT;
          break;
        case CONVERSTATION_TYPE.GROUP:
          route.name = ROUTE_NAMES.GROUP_CHAT;
          break;
        case CONVERSTATION_TYPE.SELF:
          route.name = ROUTE_NAMES.SELF_CHAT;
          break;
        default:
          route.name = ROUTE_NAMES.INDEX;
          break;
      }

      return route;
    };

    return {
      formatDistanceToNow,
      CONVERSTATION_TYPE,
      getConversationIcon,
      getRoute
    };
  }
});
</script>
