import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Button } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";

export default function Map({ navigation, route }) {
    const [selectedLocation, setSelectedLocation] = useState(null);

    // console.log("Route in Map:", route);

    function confirmHandler() {
        //navigate to AddReview and pass selectedlocation as parameter
        navigation.navigate('AddReview', { mode: route.params.mode, selectedLocation, review: route.params.review});
        console.log("Location passed from Map to AddReview:", selectedLocation);
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
                    {console.log("Selected Location:", selectedLocation);}
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
