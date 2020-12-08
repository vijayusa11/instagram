import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCwZ_5lLgksSzSpwUBdNGtbYtAoNf-Oocw",
  authDomain: "instagram-clone-2d3ae.firebaseapp.com",
  databaseURL: "https://instagram-clone-2d3ae.firebaseio.com",
  projectId: "instagram-clone-2d3ae",
  storageBucket: "instagram-clone-2d3ae.appspot.com",
  messagingSenderId: "884566725664",
  appId: "1:884566725664:web:d3efc1e26ab1f09df95845",
  measurementId: "G-2L6TGLZPKN"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };