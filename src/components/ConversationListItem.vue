<template>
  <q-item clickable v-ripple>
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
          `${conversation.lastMsg.you ? "You: " : conversation.lastMsg.userName}${
            conversation.lastMsg.txt
          }`
        }}
      </q-item-label>
    </q-item-section>
    <q-item-section side top>
      {{ formatDistanceToNow(conversation.lastMsg.sentAt) }} ago
    </q-item-section>
    <q-menu dark touch-position context-menu>
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

    return {
      formatDistanceToNow,
      CONVERSTATION_TYPE,
      getConversationIcon
    };
  }
});
</script>