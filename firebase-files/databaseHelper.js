import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { database } from "./firebaseSetup";
import { auth } from "./firebaseSetup";


// function to fetch user data
export const fetchUserData = async (userId) => {
    try {
        const db = getFirestore();
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            return docSnap.data(); // Contains userData including avatarUrl
        } else {
            return null; // Handle case where user data does not exist
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error; // This will reject the promise with the error
    }
};


// Function to upload image
export const uploadImageAsync = async (uri) => {
    const storage = getStorage();
    const imageName = `profile_${new Date().getTime()}`; // A unique image name
    const storageRef = ref(storage, `images/${imageName}`);

    const response = await fetch(uri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL; // This URL can be used to access the image
};


// save image URL to firestore
export const saveImageURLToFirestore = async (userId, imageUrl) => {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);

    await setDoc(userRef, { avatarUrl: imageUrl }, { merge: true });
};


export const updateUsername = async (userId, newUsername) => {
    try {
        const userRef = doc(database, "users", userId);
        const userData = {
            username: newUsername,
        };

        await setDoc(userRef, userData, { merge: true });
        console.log("Username updated successfully in Firestore.");
        return "Username updated successfully"; // This value is resolved with the promise
    } catch (error) {
        console.error("Error updating username:", error);
        throw error; // This will reject the promise with the error
    }
};

// Function to set the email in Firestore, only if it is not already set
export const setEmail = async (userId) => {
    try {
        const user = auth.currentUser;
        const userRef = doc(database, "users", userId);
        const userData = {
            email: user.email,
        };
        await setDoc(userRef, userData, { merge: true });
        console.log("Email updated successfully in Firestore.");
        return "Email updated successfully"; // This value is resolved with the promise
    } catch (error) {
        console.error("Error updating email:", error);
        throw error; // This will reject the promise with the error
    }
}