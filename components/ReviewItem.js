export default function ReviewItem({ review }) {
    const navigation = useNavigation();
    const currentUser = auth.currentUser;
    const userId = currentUser.uid;

    const reviewPressHandler = () => {
        navigation.navigate('Edit My Review', { review: review });
    }

    const deleteHandler = () => {
        Alert.alert('Delete', 'Are you sure you want to delete this review?', [
            { text: 'No', style: 'cancel' },
            {
                text: 'Yes', style: 'destructive',
                onPress: () => {
                    deleteFromDB('users', userId, 'reviews', review.id);
                }
            }
        ]);
    }

    return (
        <Pressable
            style={({ pressed }) => [styles.textContainer, pressed && styles.pressed]}
            onPress={reviewPressHandler} android_ripple={{ color: '#e9e' }}>
            <View style={{ flexDirection: 'column' }}>
                <Text style={styles.boldText}>{review.restaurantName || ''}</Text>
                <Text style={styles.text}>{review.review}</Text>
            </View>
            <PressableButton onPress={deleteHandler}>
                <AntDesign name="delete" size={24} color="black" />
            </PressableButton>
        </Pressable>
    )
}
