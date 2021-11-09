import firebase from "src/boot/firebase";
import { range, sample } from "src/utils/helpers";

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
      email: user.email,
      shorthandId: range(6).map(() => sample(range(6)).toString())
    });
  }

  async getDetails(uid) {
    const user = await this.userCollection.doc(uid).get();
    return user.data();
  }
}

export default new UserService();
