import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonStyles from '../styles/CommonStyles'
import PressableButton from '../components/PressableButton'
import { MaterialIcons, MaterialCommunityIcons, Zocial, FontAwesome } from '@expo/vector-icons';
import { auth, database } from '../firebase-files/firebaseSetup';
import { writeToDB, deleteFromDB, readMyReviewsFromDB, readOtherReviewsFromDB } from '../firebase-files/databaseHelper';
import { doc, getDoc } from "firebase/firestore";
import Card from '../components/Card';
import ReviewList from '../components/ReviewList';
import * as Linking from "expo-linking";
import { Rating } from 'react-native-ratings';
import NotificationManager from '../components/NotificationManager';


export default function RestaurantDetail({ navigation, route }) {
	const [bookmark, setBookmark] = useState(false);
	const [myReviews, setMyReviews] = useState([]);
	const [otherReviews, setOtherReviews] = useState([]);

	//get restaurant details from the route params
	const restaurantId = route.params.item.bussiness_id;
	const name = route.params.item.name;
	const rating = route.params.item.rating;
	const review_count = route.params.item.review_count;
	const image_url = route.params.item.image_url;
	const latitude = route.params.item.latitude;
	const longitude = route.params.item.longitude;
	const address = route.params.item.address;
	const phone = route.params.item.phone;
	const price = route.params.item.price;
	const menu = route.params.item.menu;

	//check if the restaurant is in the wishlist
	useEffect(() => {
		checkIfInWishList();
	}, [bookmark]);

	async function checkIfInWishList() {
		const currentUser = auth.currentUser;
		if (currentUser) {
			const userId = currentUser.uid;
			const docRef = doc(database, 'users', userId, 'wishlists', restaurantId);
			const docSnap = await getDoc(docRef);

			try {
				if (docSnap.exists()) {
					setBookmark(true);
				}
			} catch (error) {
				console.error('Error checking wishlist:', error);
			}
		}
	}

	//add or remove the restaurant from the wishlist
	async function wishlistHandler() {
		const currentUser = auth.currentUser;
		if (currentUser) {
			const userId = currentUser.uid;

			try {
				if (bookmark) {
					await deleteFromDB('users', userId, 'wishlists', restaurantId);
					setBookmark(false);
					Alert.alert('Removed from Wishlist');
				} else {
					let res = {
						bussiness_id: restaurantId,
						name: name,
						rating: rating,
						review_count: review_count,
						image_url: image_url,
						owner: userId,
						latitude: latitude,
						longitude: longitude,
						address: address,
						phone: phone,
						price: price,
						menu: menu
					};
					await writeToDB(res, 'users', userId, 'wishlists');
					setBookmark(true);
					Alert.alert('Added to Wishlist');
				}
			} catch (error) {
				console.error('Error adding to wishlist:', error);
			}
		}
	}

	
	//set header right to buttons for both bookmark and notification manager
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View style={{ flexDirection: 'row', marginRight: 10 }}>
					<PressableButton onPress={wishlistHandler}>
						{bookmark ? <MaterialIcons name="bookmark-added" size={24} color="black" /> :
							<MaterialIcons name="bookmark-add" size={24} color="black" />}
					</PressableButton>
					<NotificationManager />
				</View>
			)
		});
	}, [bookmark]);

	//fetch reviews for the restaurant use readAllReviewsFromDB
	useEffect(() => {
		async function fetchMyReviewsData() {
			const reviews = await readMyReviewsFromDB(restaurantId);
			setMyReviews(reviews);
		}
		fetchMyReviewsData();
	}, [myReviews]);

	//fetch reviews for the restaurant use rea
	useEffect(() => {
		async function fetchOtherReviewsData() {
			const reviews = await readOtherReviewsFromDB(restaurantId);
			setOtherReviews(reviews);
			//console.log('otherReviews:', reviews);
		}
		fetchOtherReviewsData();
	}, [otherReviews]);

	const handleMenuPress = () => {
		Linking.openURL(menu);
	};

	return (
		<View style={[{ marginTop: 10 }, CommonStyles.restaurantContainer]}>

			<Card>
				<View style={{ justifyContent: 'center', alignItems: 'center' }}>
					<Image
						source={{ uri: image_url }}
						style={{ width: '90%', height: 150, borderRadius: 5 }} />
				</View>

				<View style={{ width: '90%', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 7, marginLeft: 16 }}>
					<View style={[CommonStyles.directionRow, { justifyContent: 'center' }]}>
						<Rating
							type="star"
							ratingCount={5}
							imageSize={15}
							startingValue={rating}
							fractions={1}
							readonly={true}
						/>
						<Text style={{ marginLeft: 5, fontSize: 15 }}>{rating}</Text>

						<View style={{ marginLeft: 40 }}>
							<MaterialCommunityIcons name="comment" size={14} color="lightgrey" />
						</View>
						<Text style={{ marginLeft: 3, fontSize: 15 }}> {review_count}</Text>

						<View style={{ marginLeft: 40 }}>
							{price != 'N/A' &&
								<FontAwesome name="dollar" size={14} color="goldenrod" />
							}
						</View>
						<Text style={{ marginLeft: 10, fontSize: 15 }}>{price} </Text>
					</View>

					<View style={CommonStyles.directionRow}>
						<MaterialIcons name="location-on" size={15} color="crimson" />
						<Text style={{ marginLeft: 5, fontSize: 15 }}>{address} </Text>
					</View>

					<View style={CommonStyles.directionRow}>
						<Zocial name="call" size={15} color="skyblue" />
						<Text style={{ marginLeft: 5, fontSize: 15 }}>{phone} </Text>
					</View>

					{menu != null && <Pressable onPress={handleMenuPress}>
						<View style={CommonStyles.directionRow}>
							<MaterialIcons name="menu-book" size={15} color="grey" />
							<Text style={{ fontSize: 15, color: 'dodgerblue', textDecorationLine: 'underline', marginLeft: 5 }}>{menu}</Text>
						</View>
					</Pressable>}
				</View>

				<PressableButton
					customStyle={styles.pressableButtonStyle}
					onPress={() => { navigation.navigate('Add My Review', { item: route.params.item }) }}>
					<Text>Write my Review</Text>
				</PressableButton>
			</Card>

			{/* {console.log('myReviews:', myReviews)}
			{console.log('otherReviews:', otherReviews)} */}

			<Card>
				<View>
					<Text style={{ fontSize: 15, fontWeight: 'bold', color: "salmon", margin: 10 }}>My Reviews</Text>
					<ReviewList allReviews={myReviews} />
				</View>

				<View>
					{otherReviews != [] && <Text style={{ fontSize: 15, fontWeight: 'bold', color: "salmon", margin: 10 }}>Other's Reviews</Text>}
					<ReviewList allReviews={otherReviews} />
				</View>
			</Card>

		</View>
	)
}

const styles = StyleSheet.create({
	pressableButtonStyle: {
		backgroundColor: 'tomato',
		padding: 7,
		borderRadius: 10,
		marginTop: 5,
		width: 200,
		alignSelf: 'center'

	}
})