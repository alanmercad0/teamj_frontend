import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, (user) => {
        callback(user);
    });
};

export const loginWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Email/password sign-up
export const registerWithEmail = async (email, password, name = '', username = '') => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const insertInfo = await updateProfile(userCredential.user, {
          displayName: `${name}; ${username}`,
        });
        return userCredential.user;
    } catch (error) {
        return { error: error.message };
    }
};

export const anonymousSignIn = async () => {
    signInAnonymously(auth)
      .then(() => {
        // Signed in..
        console.log('signed in anonymously')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
}

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw new Error(error.message);
    }
};
