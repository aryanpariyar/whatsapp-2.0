import '../styles/globals.css';
import { db, auth } from '../firebase';
import Login from './login';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loading from '../components/Loding';
import firebase from 'firebase/compat/app';
import { useEffect } from 'react';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      db.collection('users').doc(user.uid).set({
        email: user.email,
        lastSeen: firebase.firestore?.Timestamp?.now(),
        photoUrl: auth.currentUser.photoURL,

      }, { merge: true });
    }
  }, [user])
  if (loading) return <Loading />

  if (!user) return <Login />

  return <Component {...pageProps} />
}

export default MyApp
