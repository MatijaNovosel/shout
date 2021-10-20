import firebase from "../firebase";

const db = firebase.collection("/users");

class UserService {
  getAll() {
    return db;
  }
}

export default new UserService();
