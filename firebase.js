import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';



const firebaseConfig = {
    apiKey: "AIzaSyBp7KEuXbIHSyaLxAc4024ZiDHWR3LDP0s",
    authDomain: "whatsapp-2-e1681.firebaseapp.com",
    projectId: "whatsapp-2-e1681",
    storageBucket: "whatsapp-2-e1681.appspot.com",
    messagingSenderId: "819974412214",
    appId: "1:819974412214:web:f9739b4782da9104ab1317"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export { db, auth, provider };