import { initializeApp } from "firebase/app";
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAOva59RNuSW-AYo9uTaZfaimO1I3Sfkho",
  authDomain: "full-stack-blog-website.firebaseapp.com",
  projectId: "full-stack-blog-website",
  storageBucket: "full-stack-blog-website.appspot.com",
  messagingSenderId: "372751392969",
  appId: "1:372751392969:web:b21b71c895581e484c2d18"
};

const app = initializeApp(firebaseConfig);

// google auth

const Provider = new  GoogleAuthProvider();

const auth = getAuth();

 export const authwithGoogle = async () =>{
    let user = null;

    await signInWithPopup(auth, Provider)
    .then((result) =>{
        user = result.user
    })
    .catch((err) =>{
      console.log(err)
    })
    return user;
}