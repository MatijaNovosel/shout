import firebase from "src/boot/firebase";
import { doc, setDoc } from "firebase/firestore";

class UserService {
  constructor() {
    this.userCollection = firebase.firestore().collection("/users");
  }

  async getAll() {
    const users = await this.chatsCollection.get();
    const retVal = [];
    users.forEach((snapshot) => {
      const data = snapshot.data();
      retVal.push({
        username: data.username,
        email: data.email
      });
    });
    return retVal;
  }

  async addUser(user) {
    await this.userCollection.doc(user.id).set({
      username: user.username,
      email: user.email
    });
  }
}

export default new UserService();
