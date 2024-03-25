import { doc, getDoc, setDoc } from "firebase/firestore";
import { database } from "./firebaseSetup";

export const fetchUserData = async (userId) => {
    try {
        const userDocRef = doc(database, "users", userId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null; // Handle case where user data does not exist
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

export const updateUserProfile = async (userId, newUsername, email, newAvatarUri) => {
    try {
        const userRef = doc(database, "users", userId);
        const userData = {
            username: newUsername,
            email: email,
        };

        // Add the avatar URI to the user data only if it's not null
        if (newAvatarUri) {
            userData.avatarUri = newAvatarUri;
        }

        await setDoc(userRef, userData, { merge: true });
        console.log("User profile updated in Firestore.");
        return "Profile updated successfully"; // This value is resolved with the promise
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error; // This will reject the promise with the error
    }
};
