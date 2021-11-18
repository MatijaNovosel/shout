import { firebase } from "src/boot/firebase";
import {
  range,
  sample,
  readDocuments,
  checkUsernamePattern,
  generateGuid
} from "src/utils/helpers";

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
    const { id, email, username } = user;
    await this.userCollection.doc(id).set({
      username,
      email,
      shorthandId: range(6)
        .map(() => sample(range(6)).toString())
        .join()
    });
  }

  async getDetails(uid) {
    const user = await this.userCollection.doc(uid).get();
    const invites = await this.userCollection.doc(uid).collection("/invites").get();

    const invitesMapped = [];
    invites.forEach((i) => {
      invitesMapped.push({ id: i.id, ...i.data() });
    });

    return { invites: invitesMapped, ...user.data() };
  }

  async searchByUsername(users, searchQuery) {
    if (checkUsernamePattern(searchQuery)) {
      const username = searchQuery.split("#")[0];
      const shorthandId = searchQuery.split("#")[1];

      const res = await readDocuments("users", {
        where: [
          ["username", "==", username],
          ["shorthandId", "==", shorthandId]
        ]
      });

      const users = [];

      res.forEach((r) => {
        const data = r.data();

        if (!users.some((u) => u === `${data.username}#${data.shorthandId}`)) {
          users.push(r.data());
        }
      });

      return users;
    }
    return [];
  }

  async uploadProfilePicture(file, userId) {
    const guid = generateGuid();
    const retVal = await firebase.storage().ref(guid).put(file);
    const url = await retVal.ref.getDownloadURL();
    await this.userCollection.doc(userId).update({
      avatarUrl: url
    });
    return url;
  }
}

export default new UserService();
