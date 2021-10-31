import firebase from "src/boot/firebase";

const chatsCollection = firebase.firestore().collection("/chats");

class ChatService {
  getAll() {
    return chatsCollection.get();
  }
}

export default new ChatService();
