import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Button } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";

export default function Map({ route }) {
    const navigation = useNavigation(); // Correct way to use useNavigation hook
    const [selectedLocation, setSelectedLocation] = useState(null);

    function confirmHandler() {
        //navigate to AddReview and pass selectedlocation as parameter
        navigation.navigate('AddReview', { selectedLocation }); // Use navigation from useNavigation hook
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: route.params ? route.params.initLoc.latitude : 37.78825,
                    longitude: route.params ? route.params.initLoc.longitude : -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onPress={(e) => {
                    const { latitude, longitude } = e.nativeEvent.coordinate;
                    setSelectedLocation({ latitude, longitude });
                }}
            >
                {selectedLocation && (
                    <Marker
                        coordinate={selectedLocation}
                        title="Selected Location"
                        description="This is the location you tapped"
                    />
                )}
            </MapView>
            <Button disabled={!selectedLocation} title='Confirm Selected Location' onPress={confirmHandler} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});
