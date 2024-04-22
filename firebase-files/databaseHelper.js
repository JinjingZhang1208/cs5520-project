import { getFirestore, collection, addDoc, deleteDoc, doc, getDoc, getDocs, setDoc, arrayUnion, query, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { database } from "./firebaseSetup";
import { auth } from "./firebaseSetup";
import { manipulateAsync } from 'expo-image-manipulator';
import { Timestamp } from "firebase/firestore";

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

// Function to resize and compress the image
const compressImage = async (uri) => {
    try {
        const manipResult = await manipulateAsync(
            uri,
            [{ resize: { width: 800, height: 800 } }], // Resize the image to a maximum width or height of 800 pixels
            { compress: 0.2, format: 'jpeg' } // Adjust the compression quality (0 to 1) and format to JPEG
        );
        return manipResult.uri; // Return the URI of the compressed image
    } catch (error) {
        console.error("Error compressing image: ", error);
        return uri; // Return the original URI if compression fails
    }
};

// Function to convert local file URI to a Blob
const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    console.log('Converted to Blob:', blob)
    return blob;
};

// Function to upload a Blob to Firebase Storage
const uploadImage = async (blob) => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${Date.now()}.jpeg`); // Creates a unique name for each image

    console.log('Uploading blob:', blob);
    const uploadResult = await uploadBytes(storageRef, blob);
    console.log('Uploaded blob!');
    return uploadResult.ref;
};


// Combined function to upload an image from a local URI
export const uploadImageAsync = async (imageUri) => {
    try {
        const compressedUri = await compressImage(imageUri);
        const blob = await uriToBlob(compressedUri);
        const snapshotRef = await uploadImage(blob);
        blob.close(); // Free up memory after blob is uploaded

        // Optionally, get the download URL
        const downloadURL = await getDownloadURL(snapshotRef);
        console.log('File available at', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image: ", error);
    }
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

export const fetchAllRestaurantsFromDB = async () => {
    try {
        const querySnapshot = await getDocs(collection(database, 'restaurants'));
        const restaurantList = [];
        querySnapshot.forEach((doc) => {
            restaurantList.push({ ...doc.data(), id: doc.id });
        });
        return restaurantList;
    } catch (error) {
        console.error("Error fetching restaurants from DB:", error);
        throw new Error('Failed to fetch restaurants');
    }
};

export async function writeToDB(data, collectionName, id, subCollection) {
    try {
        if (id) {
            if (collectionName == 'allReviews') {
                await addDoc(collection(database, collectionName), data);
            }
            if (subCollection == 'reviews') {
                await addDoc(collection(database, collectionName, id, subCollection), data);
            }
            if (subCollection == 'wishlists') {
                await setDoc(doc(database, collectionName, id, subCollection, data.bussiness_id), data);
            }
        } else {
            await addDoc(collection(database, collectionName), data);
        }
    } catch (err) {
        console.error(err);
    }
}

// read user's own reviews from DB by restaurantId
export async function readMyReviewsFromDB(restaurantId) {
    try {
        const querySnapshot = await getDocs(collection(database, 'allReviews'));
        const reviews = [];
        querySnapshot.forEach((doc) => {
            if (doc.data().bussiness_id === restaurantId && doc.data().owner === auth.currentUser.uid) {
                reviews.push({ ...doc.data(), id: doc.id });
            }
        });
        return reviews;
    } catch (error) {
        console.error("Error fetching reviews from DB:", error);
    }
}

// read user's own reviews from DB by restaurantId
export async function readOtherReviewsFromDB(restaurantId) {
    try {
        const querySnapshot = await getDocs(collection(database, 'allReviews'));
        const reviews = [];
        querySnapshot.forEach((doc) => {
            if (doc.data().bussiness_id === restaurantId && doc.data().owner !== auth.currentUser.uid) {
                reviews.push({ ...doc.data(), id: doc.id });
            }
        });
        return reviews;
    } catch (error) {
        console.error("Error fetching reviews from DB:", error);
    }
}

// read reviews from allReviews by owner ID
export async function readUserReviewsFromDB(ownerId) {
    try {
        const querySnapshot = await getDocs(collection(database, 'allReviews'));
        const reviews = [];
        querySnapshot.forEach((doc) => {
            if (doc.data().owner === ownerId) {
                reviews.push({ ...doc.data(), id: doc.id });
            }
        });
        return reviews;
    } catch (error) {
        console.error("Error fetching user reviews from DB:", error);
        throw new Error('Failed to fetch user reviews');
    }
}


export async function deleteFromDB(collectionName, id, subCollection, subId) {
    try {
        if (subCollection) {
            await deleteDoc(doc(database, collectionName, id, subCollection, subId));
        } else {
            await deleteDoc(doc(database, collectionName, id));
        }
    } catch (err) {
        console.error(err);
    }
}

export async function updateDB(data, collectionName, id, subCollection, subId) {
    try {
        if (subCollection) {
            await setDoc(doc(database, collectionName, id, subCollection, subId), data);
        } else {
            await setDoc(doc(database, collectionName, id), data);
        }
    } catch (err) {
        console.error(err);
    }
}

export const writeNotificationDateToFirebase = async (userId, date, restaurantId, restaurantName) => {
    try {
        // Ensure user is authenticated
        if (!userId) {
            console.error("User not authenticated");
            return;
        }

        // Construct the collection reference based on the user's ID
        const collectionRef = collection(database, "users", userId, "notificationData");

        // Add a new document to the collection
        await addDoc(collectionRef, {
            timestamp: date,
            restaurantId: restaurantId,
            restaurantName: restaurantName,
        });

        console.log("Date saved to Firestore!: date", date);
    } catch (error) {
        console.error("Error writing document:", error);
        throw error;
    }
};

export const readNotificationDateFromFirebase = async (userId) => {
    try {
        // Ensure user is authenticated
        if (!userId) {
            console.error("User not authenticated");
            return [];
        }

        const collectionRef = collection(database, "users", userId, "notificationData");
        const querySnapshot = await getDocs(collectionRef);

        const notifications = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            notifications.push({
                id: doc.id,
                timestamp: data.timestamp.toDate(),
                restaurantId: data.restaurantId || "",
                restaurantName: data.restaurantName || ""
            });
        });

        return notifications;
    } catch (error) {
        console.error("Error fetching notification dates:", error);
        throw error;
    }
};

export const deleteNotificationFromFirebase = async (userId, notificationId) => {
    try {
        const notificationRef = doc(database, 'users', userId, 'notificationData', notificationId);
        await deleteDoc(notificationRef);
        console.log('Notification deleted successfully!');
    } catch (error) {
        console.error('Error deleting notification:', error);
    }
};

export const updateUserField = async (userId, fieldName, newData) => {
    try {
        const userRef = doc(database, "users", userId);
        const userData = {
            [fieldName]: newData,
        };

        await setDoc(userRef, userData, { merge: true });
        console.log(`user ${fieldName} updated successfully in Firestore.`);
        return "User information updated successfully"; // This value is resolved with the promise
    } catch (error) {
        console.error("Error updating pushtoken:", error);
        throw error; // This will reject the promise with the error
    }
};

export const getUserField = async (userId, fieldName) => {
    try {
        const userRef = doc(database, "users", userId);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            return docSnap.data()[fieldName]; // Contains userData including pushToken
        } else {
            return null; // Handle case where user data does not exist
        }
    } catch (error) {
        console.error(`Error fetching user ${fieldName}:", error`);
        throw error; // This will reject the promise with the error
    }
};