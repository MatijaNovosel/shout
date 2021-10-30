import { firebaseConfig } from "./config";
import firebase from "firebase";
import store from "src/store/index";

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
  store().dispatch("user/fetchUser", user);
});

export default firebase.firestore();
