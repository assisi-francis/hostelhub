import { db, storage } from "./firebase-config.js";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Upload a single image file to Storage and return its URL
export async function uploadListingImage(file, landlordId) {
  try {
    const fileRef = ref(storage, `listings/${landlordId}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

// Create a new listing
export async function createListing(listingData) {
  try {
    // listingData should include: landlordId, title, price, address, amenities, photos
    listingData.createdAt = serverTimestamp();
    const docRef = await addDoc(collection(db, "listings"), listingData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
}

// Get all listings (for students)
export async function getAllListings() {
  try {
    const q = query(collection(db, "listings"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting listings:", error);
    throw error;
  }
}

// Get listings for a specific landlord
export async function getLandlordListings(landlordId) {
  try {
    const q = query(collection(db, "listings"), where("landlordId", "==", landlordId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting landlord listings:", error);
    throw error;
  }
}

// Upload avatar directly as a base64 string to Firestore
export async function uploadAvatar(base64Str, userId) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { avatar: base64Str });
    return base64Str;
  } catch (error) {
    console.error("Error saving avatar to Firestore:", error);
    throw error;
  }
}
