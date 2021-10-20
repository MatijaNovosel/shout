import { firebaseConfig } from "./config";
import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp(firebaseConfig);
export default firebase.firestore();
