import { firebase } from "src/boot/firebase";
import { generateGuid, blobToFile, uploadTaskPromise, stripHtml } from "src/utils/helpers";
import { CHAT_PRIVILEGES, MSG_TYPE, GROUP_CHANGE_TYPE } from "src/utils/constants";
import { format } from "date-fns";

class ChatService {
  constructor() {
    this.chatsCollection = firebase.firestore().collection("/chats");
  }

  async getAll(userId) {
    const chatsData = await this.chatsCollection.where("userIds", "array-contains", userId).get();
    const chats = [];
    const retVal = [];

    chatsData.forEach((snapshot) => {
      chats.push({ id: snapshot.id, ...snapshot.data() });
    });

    for (let i = 0; i < chats.length; i++) {
      let lastMsg = null;

      const lastMsgData = await this.chatsCollection
        .doc(chats[i].id)
        .collection("/messages")
        .orderBy("sentAt", "desc")
        .limit(1)
        .get();

      if (!lastMsgData.empty) {
        lastMsg = {};
        lastMsgData.forEach((doc) => {
          const d = doc.data();
          let txt = "";

          if (d.type === MSG_TYPE.AUDIO) {
            txt = "🎵 Audio file";
          } else if (d.type === MSG_TYPE.FILE) {
            txt = "📁 File";
          } else if (d.type === MSG_TYPE.INFO || d.type === MSG_TYPE.TXT) {
            txt = stripHtml(d.txt);
          }

          lastMsg = {
            txt,
            you: false,
            sentAt: new Date(d.sentAt.seconds * 1000),
            type: d.type,
            userId: d.userId,
            pinned: d.pinned
          };
        });

        if (lastMsg.type === MSG_TYPE.INFO) {
          lastMsg.username = "System";
        } else {
          const user = await firebase.firestore().collection("/users").doc(lastMsg.userId).get();
          lastMsg.username = `${user.data().username}#${user.data().shorthandId}`;
        }
      }

      retVal.push({
        id: chats[i].id,
        createdAt: new Date(chats[i].createdAt.seconds * 1000),
        name: chats[i].name,
        avatar: chats[i].avatar,
        type: chats[i].type,
        lastMsg
      });
    }

    return retVal;
  }

  async getDetails(uid) {
    const ref = this.chatsCollection.doc(uid);
    const refGet = await ref.get();
    const data = refGet.data();
    const messages = await ref.collection("messages").orderBy("sentAt", "asc").get();
    const msgCol = [];
    const userIds = {};

    messages.forEach((m) => {
      const msgData = m.data();
      if (!(m.data().userId in userIds)) {
        userIds[m.data().userId] = null;
      }
      msgData.sentAt = new Date(msgData.sentAt.seconds * 1000);
      msgData.id = m.id;
      msgData.chatId = uid;
      msgCol.push(msgData);
    });

    const userIdEntries = Object.keys(userIds);

    for (let i = 0; i < userIdEntries.length; i++) {
      const user = await firebase.firestore().collection("/users").doc(userIdEntries[i]).get();
      userIds[userIdEntries[i]] = `${user.data().username}#${user.data().shorthandId}`;
    }

    for (let i = 0; i < msgCol.length; i++) {
      msgCol[i].username = userIds[msgCol[i].userId];
      if (msgCol[i].type === MSG_TYPE.FILE || msgCol[i].type === MSG_TYPE.AUDIO) {
        const file = firebase.storage().ref(msgCol[i].fileId);
        const url = await file.getDownloadURL();
        const fileInfo = await ref.collection("files").doc(msgCol[i].fileId).get();
        msgCol[i].fileUrl = url;
        msgCol[i].fileName = fileInfo.data().name;
        msgCol[i].fileSize = fileInfo.data().size;
      }
    }

    return {
      id: uid,
      createdAt: new Date(data.createdAt.seconds * 1000),
      name: data.name,
      avatar: data.avatar,
      type: data.type,
      users: data.users,
      description: data.description,
      messages: msgCol
    };
  }

  async uploadFile(file, chatId, userId) {
    const guid = generateGuid();
    const chatsRef = this.chatsCollection.doc(chatId);
    const messages = chatsRef.collection("messages");
    const chatFiles = chatsRef.collection("files");
    chatFiles.doc(guid).set({
      name: file.name,
      size: file.size
    });
    await uploadTaskPromise(guid, file);
    await messages.add({
      userId: userId,
      sent: true,
      type: MSG_TYPE.FILE,
      sentAt: new Date(),
      fileId: guid,
      pinned: false
    });
    await this.chatsCollection.doc(chatId).update({
      lastChangedAt: new Date(),
      changeType: GROUP_CHANGE_TYPE.MESSAGE_SENT
    });
  }

  async sendMessage(msg) {
    const messages = this.chatsCollection.doc(msg.chatId).collection("messages");
    const data = await messages.add({
      userId: msg.userId,
      type: MSG_TYPE.TXT,
      sentAt: new Date(),
      txt: msg.txt,
      pinned: false
    });
    await this.chatsCollection.doc(msg.chatId).update({
      lastChangedAt: new Date(),
      changeType: GROUP_CHANGE_TYPE.MESSAGE_SENT
    });
    return data.id;
  }

  async deleteMessage(chatId, msgId) {
    const chatsRef = this.chatsCollection.doc(chatId);
    const messages = chatsRef.collection("messages");
    const doc = await messages.where(firebase.firestore.FieldPath.documentId(), "==", msgId).get();

    const fileIds = [];

    doc.forEach((doc) => {
      const data = doc.data();

      if (data.type === MSG_TYPE.FILE || data.type === MSG_TYPE.AUDIO) {
        fileIds.push(data.fileId);
      }

      doc.ref.delete();
    });

    for (let i = 0; i < fileIds.length; i++) {
      const storageRef = firebase.storage().ref(fileIds[i]);
      await storageRef.delete(storageRef);
    }

    await this.chatsCollection.doc(chatId).update({
      lastChangedAt: new Date(),
      changeType: GROUP_CHANGE_TYPE.MESSAGE_SENT
    });
  }

  async sendAudioMessage(audioBlob, chatId, userId) {
    const guid = generateGuid();
    const chatsRef = this.chatsCollection.doc(chatId);
    const messages = chatsRef.collection("messages");
    const audioFile = blobToFile(audioBlob, `${guid}.wav`);
    const chatFiles = chatsRef.collection("files");
    chatFiles.doc(guid).set({
      name: `${guid}.wav`
    });
    await uploadTaskPromise(guid, audioFile);
    await messages.add({
      userId: userId,
      sent: true,
      type: MSG_TYPE.AUDIO,
      sentAt: new Date(),
      fileId: guid,
      pinned: false
    });
    await this.chatsCollection.doc(chatId).update({
      lastChangedAt: new Date(),
      changeType: GROUP_CHANGE_TYPE.MESSAGE_SENT
    });
  }

  async changeGroupProfilePicture(file, groupId) {
    const guid = generateGuid();
    const retVal = await firebase.storage().ref(guid).put(file);
    const url = await retVal.ref.getDownloadURL();
    await this.chatsCollection.doc(groupId).update({
      avatar: url,
      lastChangedAt: new Date(),
      changeType: GROUP_CHANGE_TYPE.AVATAR
    });
    return url;
  }

  async sendInfoMessage(msg) {
    const messages = this.chatsCollection.doc(msg.chatId).collection("messages");
    const data = await messages.add({
      userId: msg.userId,
      type: MSG_TYPE.INFO,
      sentAt: new Date(),
      txt: msg.txt,
      pinned: false
    });
    return data.id;
  }

  async sendGroupInviteResponse(response, inviteId, user, chatId) {
    if (response) {
      const chatDetails = await this.chatsCollection.doc(chatId).get();
      const chatData = chatDetails.data();
      const users = chatData.users;
      const userIds = chatData.userIds;
      users.push({
        id: user.id,
        about: user.about,
        avatarUrl: user.avatarUrl,
        privileges: [CHAT_PRIVILEGES.ALL],
        username: user.username
      });
      userIds.push(user.id);
      await this.chatsCollection.doc(chatId).update({
        users,
        userIds
      });
      await this.sendInfoMessage({
        userId: user.id,
        txt: `<span class="info-date">[${format(new Date(), "dd.MM.yyyy. HH:mm")}]</span> ${
          user.username
        } has joined the chat`,
        chatId
      });
    }
    await firebase
      .firestore()
      .collection("/users")
      .doc(user.id)
      .collection("/invites")
      .doc(inviteId)
      .update({
        confirmed: true
      });
  }

  async sendGroupInvite(userId, chatId, chatName) {
    await firebase
      .firestore()
      .collection("/users")
      .doc(userId)
      .collection("/invites")
      .add({
        chatId,
        txt: `You have been invited to join <b>${chatName}</b>`,
        confirmed: false
      });
  }

  async removeFromGroup(userInitiatorId, user, chatId) {
    const chatDetails = await this.chatsCollection.doc(chatId).get();
    const chatData = chatDetails.data();
    const users = chatData.users.filter((u) => u.id !== user.id);
    const userIds = chatData.userIds.filter((u) => u !== user.id);
    await this.chatsCollection.doc(chatId).update({
      users,
      userIds
    });
    await this.sendInfoMessage({
      userId: userInitiatorId,
      txt: `<span class="info-date">[${format(new Date(), "dd.MM.yyyy. HH:mm")}]</span> ${
        user.username
      } has been removed from the chat`,
      chatId
    });
  }

  async leaveGroup(user, chatId) {
    const chatDetails = await this.chatsCollection.doc(chatId).get();
    const chatData = chatDetails.data();
    const users = chatData.users.filter((u) => u.id !== user.id);
    const userIds = chatData.userIds.filter((u) => u !== user.id);
    await this.chatsCollection.doc(chatId).update({
      users,
      userIds
    });
    await this.sendInfoMessage({
      userId: user.id,
      txt: `<span class="info-date">[${format(new Date(), "dd.MM.yyyy. HH:mm")}]</span> ${
        user.username
      } has left the chat`,
      chatId
    });
  }

  async createGroup(initiator, invitedUsers) {
    const data = await this.chatsCollection.add({
      avatar:
        "https://clipartbarn.com/wp-content/uploads/2017/02/Question-face-face-with-question-mark-clipart-kid-8.jpg",
      changeType: 1,
      createdAt: new Date(),
      description: "Group description",
      lastChangedAt: new Date(),
      lastMsg: null,
      name: "Group name",
      type: 2,
      userIds: [initiator.id],
      users: [
        {
          about: "About",
          avatarUrl: initiator.avatarUrl,
          id: initiator.id,
          privileges: [1],
          username: `${initiator.username}#${initiator.shorthandId}`
        }
      ]
    });
    for (let i = 0; i < invitedUsers.length; i++) {
      await this.sendGroupInvite(invitedUsers[i].id, data.id, "Group name");
    }
  }

  async disbandGroup(initiatorUserId, chatId) {
    //
  }

  async changeGroupName(newGroupName, chatId, initiatorUserId) {
    await this.chatsCollection.doc(chatId).update({
      name: newGroupName,
      lastChangedAt: new Date(),
      changeType: GROUP_CHANGE_TYPE.NAME
    });
    await this.sendInfoMessage({
      userId: initiatorUserId,
      txt: `<span class="info-date">[${format(
        new Date(),
        "dd.MM.yyyy. HH:mm"
      )}]</span> Group name was changed to <b>${newGroupName}</b>`,
      chatId
    });
  }

  async changeGroupDescription(newGroupDescription, chatId, initiatorUserId) {
    await this.chatsCollection.doc(chatId).update({
      description: newGroupDescription,
      lastChangedAt: new Date(),
      changeType: GROUP_CHANGE_TYPE.DESCRIPTION
    });
    await this.sendInfoMessage({
      userId: initiatorUserId,
      txt: `<span class="info-date">[${format(
        new Date(),
        "dd.MM.yyyy. HH:mm"
      )}]</span> Group description was changed to <b>${newGroupDescription}</b>`,
      chatId
    });
  }

  async pinMessage(messageId, chatId) {
    //
  }

  async unpinMessage(messageId, chatId) {
    //
  }
}

export default new ChatService();
