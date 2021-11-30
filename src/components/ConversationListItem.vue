<template>
  <q-item
    clickable
    v-ripple
    @click="$router.push(getRoute())"
    :style="{ paddingTop: '12px', paddingBottom: '12px' }"
  >
    <q-item-section avatar>
      <q-avatar size="50px">
        <img :src="conversation.avatar" />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label
        lines="1"
        :style="{
          fontSize: '16px',
          marginBottom: '3px'
        }"
      >
        {{ conversation.name }}
      </q-item-label>
      <q-item-label
        v-if="conversation.lastMsg"
        caption
        lines="1"
        :style="{
          fontSize: '12px'
        }"
      >
        {{
          `${conversation.lastMsg.you ? `${t("you")}: ` : `${conversation.lastMsg.username}: `}${
            conversation.lastMsg.txt
          }`
        }}
      </q-item-label>
    </q-item-section>
    <q-item-section side v-if="conversation.lastMsg">
      {{ formatMessageDate(conversation.lastMsg.sentAt) }}
    </q-item-section>
    <q-menu
      dark
      touch-position
      context-menu
      v-if="conversation.type === CHAT_TYPE.PRIVATE || conversation.type === CHAT_TYPE.GROUP"
    >
      <q-list dense style="min-width: 100px">
        <q-item clickable v-close-popup>
          <q-item-section>
            {{ $t("muteNotifications") }}
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup v-if="conversation.type === CHAT_TYPE.PRIVATE">
          <q-item-section>
            {{ $t("deleteChat") }}
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup v-if="conversation.type === CHAT_TYPE.GROUP">
          <q-item-section>
            {{ $t("exitGroup") }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";
import { CHAT_TYPE } from "../utils/constants";
import { formatDistanceToNow, isSameDay, format } from "date-fns";
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
        case CHAT_TYPE.PRIVATE:
          return "mdi-account-supervisor";
        case CHAT_TYPE.GROUP:
          return "mdi-account-group";
        case CHAT_TYPE.SELF:
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
        case CHAT_TYPE.PRIVATE:
          route.name = ROUTE_NAMES.PRIVATE_CHAT;
          break;
        case CHAT_TYPE.GROUP:
          route.name = ROUTE_NAMES.GROUP_CHAT;
          break;
        case CHAT_TYPE.SELF:
          route.name = ROUTE_NAMES.SELF_CHAT;
          break;
        default:
          route.name = ROUTE_NAMES.INDEX;
          break;
      }

      return route;
    };

    const formatMessageDate = (sentAt) => {
      if (isSameDay(new Date(), new Date(sentAt))) {
        return format(new Date(sentAt), "HH:mm");
      }
      return formatDistanceToNow(new Date(sentAt));
    };

    return {
      formatDistanceToNow,
      CHAT_TYPE,
      getConversationIcon,
      getRoute,
      formatMessageDate
    };
  }
});
</script>
