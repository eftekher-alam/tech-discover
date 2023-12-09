import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { GithubAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import auth from "../firebase/firebase.config";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import axios from "axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {


    const API_URL = import.meta.env.VITE_API_URL;
    const [title, setTitle] = useState("")
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true); //Always true only when observe done then false
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currUser => {
            const userEmail = currUser?.email || user?.email
            const loggedUser = { email: userEmail }
            // console.log("Inside auth state : ", user);
            setUser(currUser);
            setLoading(false);

            //if user exist generate token
            if (user) {
                axios.post(`${API_URL}/jwt`, loggedUser, { withCredentials: true })
                    .then();
            }
            else {
                axios.post(`${API_URL}/clearToken`, loggedUser, { withCredentials: true })
                    .then()
            }

        });
        return () => { unSubscribe() }
    }, [API_URL, user]);


    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password);
    }

    const googleSignIn = () => {
        return signInWithPopup(auth, googleProvider);
    }

    const githubSignIn = () => {
        return signInWithPopup(auth, githubProvider);
    }

    const updateUserProfile = (name, photourl) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photourl
        });
    }

    const createUserMongoDB = () => {
        fetch(`${API_URL}/user`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(auth.currentUser)
        })
            .then(res => res.json())
            .then(data => console.log(data));
    }


    const loggOut = () => {
        setLoading(true);
        signOut(auth)
            .then(() => {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Log out successful.",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(error => {
                console.log(error.message);
            })
    }

    const authInfo = { user, createUser, signIn, loggOut, loading, googleSignIn, githubSignIn, updateUserProfile, createUserMongoDB, setTitle, title }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};


AuthProvider.propTypes = {
    children: PropTypes.node
}

export default AuthProvider;