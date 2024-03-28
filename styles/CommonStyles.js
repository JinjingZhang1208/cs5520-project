import { StyleSheet } from 'react-native'

const CommonStyles = StyleSheet.create({
    card: {
        backgroundColor:'white',
        padding:10,
        width:'100%',
        justifyContent: 'center',
        marginTop: '2%',
    },

    directionRow: {
        flexDirection: "row",
      },

    container: {
        flex: 1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'start',
    },

    restaurantContainer: {
        flex: 1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'start',
    },

    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    centeredText: {
        fontSize: 20,
        color: 'purple',
    },

    reviewInput: {
        width: 300,
        height: 100,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
        textAlign: 'left',
      },
})

export default CommonStyles;