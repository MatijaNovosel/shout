import firebase from "firebase";
import firebaseConfig from "./firebaseConfig";
import store from "src/store/index";
import UserService from "src/services/users";

firebase.initializeApp(firebaseConfig);

firebase.getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      const storeRef = await store();
      const userDetails = await UserService.getDetails(user.uid);
      await storeRef.dispatch("user/fetchUser", { id: user.uid, ...userDetails });
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export default firebase;
