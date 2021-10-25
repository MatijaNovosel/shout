import firebase from "../firebase";

const chatsCollection = firebase.collection("/chats");

class ChatService {
  getAll() {
    return chatsCollection.get();
  }
}

export default new ChatService();
