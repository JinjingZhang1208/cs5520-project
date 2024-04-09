import { getFirestore, collection, addDoc, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
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


// Function to convert local file URI to a Blob
const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
};


// Function to upload a Blob to Firebase Storage
const uploadImage = async (blob) => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${Date.now()}.jpeg`); // Creates a unique name for each image

    return uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('Uploaded blob!');
        return snapshot.ref; // You might want to return the reference for further use, e.g., getting the download URL
    });
};


// Combined function to upload an image from a local URI
export const uploadImageAsync = async (imageUri) => {
    try {
        const blob = await uriToBlob(imageUri);
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

export async function writeToDB (data, collectionName, id, subCollection) {
    try {
        if (id) {
            if (collectionName == 'allReviews'){
                await addDoc(collection(database, collectionName), data);
            }
            if (subCollection == 'reviews'){
                await addDoc(collection(database, collectionName, id, subCollection), data);
            }
            if (subCollection == 'wishlists'){
                await setDoc(doc(database, collectionName, id, subCollection, data.restaurantId), data);
            }
        } else {
            await addDoc(collection(database, collectionName), data);
        }
    } catch (err) {
        console.error(err);
    }
}

// read allReviews from DB by restaurantId
export async function readAllReviewsFromDB (restaurantId) {
    try {
        const querySnapshot = await getDocs(collection(database, 'allReviews'));
        const reviews = [];
        querySnapshot.forEach((doc) => {
            if (doc.data().restaurantId === restaurantId) {
                reviews.push({ ...doc.data(), id: doc.id });
            }
        });
        return reviews;
    } catch (error) {
        console.error("Error fetching reviews from DB:", error);
        throw new Error('Failed to fetch reviews');
    }
}

// read reviews from allReviews by owner ID
export async function readUserReviewsFromDB (ownerId) {
    try {
        const querySnapshot = await getDocs(collection(database, 'allReviews'));
        console.log('querySnapshot:', querySnapshot);

        const reviews = [];
        querySnapshot.forEach((doc) => {
            console.log(doc.data().owner);

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


export async function deleteFromDB (collectionName, id, subCollection, subId) {
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

 export async function updateDB (data, collectionName, id, subCollection, subId) {
    try {
        if(subCollection){
            await setDoc(doc(database, collectionName, id, subCollection, subId), data);
        } else {
            await setDoc(doc(database, collectionName, id), data);
        }
    } catch (err) {
        console.error(err);
    }
 }