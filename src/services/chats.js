import firebase from "src/boot/firebase";

class ChatService {
  constructor() {
    this.chatsCollection = firebase.firestore().collection("/chats");
  }

  async getAll() {
    const chats = await this.chatsCollection.get();
    const retVal = [];
    chats.forEach((snapshot) => {
      const data = snapshot.data();
      retVal.push({
        id: snapshot.id,
        createdAt: new Date(data.createdAt.seconds * 1000),
        name: data.name,
        avatar: data.avatar,
        type: data.type,
        lastMsg: {
          txt: data.lastMsg.txt,
          you: data.lastMsg.you,
          username: data.lastMsg.username,
          sentAt: new Date(data.lastMsg.sentAt.seconds * 1000),
          type: data.lastMsg.type
        }
      });
    });
    return retVal;
  }

  async getDetails(uid) {
    const ref = this.chatsCollection.doc(uid);
    const refGet = await ref.get();
    const data = refGet.data();

    const messages = ref.collection("messages");
    const messagesGet = await messages.get();

    const msgCol = [];

    messagesGet.forEach((m) => {
      msgCol.push(m.data());
    });

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
}

export default new ChatService();
