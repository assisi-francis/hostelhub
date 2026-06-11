import { auth, db } from "./firebase-config.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Sign up a new user and create their profile in Firestore
export async function signUpUser(email, password, name, role, additionalData = {}) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create the user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: name,
      role: role, // 'student' or 'landlord'
      ...additionalData,
      createdAt: new Date().toISOString()
    });

    return user;
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw error;
  }
}

// Log in an existing user
export async function logInUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
}

// Log out
export async function logOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error.message);
    throw error;
  }
}

// Get user profile details
export async function getUserProfile(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error.message);
    throw error;
  }
}

// Reset password
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending reset email:", error.message);
    throw error;
  }
}

// Listen to auth state changes
export function listenAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
