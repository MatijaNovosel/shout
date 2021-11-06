import firebase from "firebase";
import firebaseConfig from "./firebaseConfig";
import store from "src/store/index";

firebase.initializeApp(firebaseConfig);

firebase.getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      const storeRef = await store();
      await storeRef.dispatch("user/fetchUser", {
        id: user.uid,
        email: user.email,
        username: user.displayName
      });
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export default firebase;
