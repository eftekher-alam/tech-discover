
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const env = import.meta.env;

const firebaseConfig = {
    apiKey: env.VITE_apiKey,
    authDomain: env.VITE_authDomain,
    projectId: env.VITE_projectId,
    storageBucket: env.VITE_storageBucket,
    messagingSenderId: env.VITE_messagingSenderId,
    appId: env.VITE_appId
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;