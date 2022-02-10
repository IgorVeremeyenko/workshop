import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQyKGOGj6-WZD1IENAX1LynOz_GbERNw4",
  authDomain: "workshop.gopr-service.com.ua",
  databaseURL: "https://elite-service-92d53-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "elite-service-92d53",
  storageBucket: "elite-service-92d53.appspot.com",
  messagingSenderId: "336956340236",
  appId: "1:336956340236:web:e62786b00809d449699629",
  measurementId: "G-QSF4E7NRMD"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
