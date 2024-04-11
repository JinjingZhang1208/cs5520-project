import { StyleSheet } from 'react-native'

const CommonStyles = StyleSheet.create({
    card: {
        backgroundColor:'white',
        padding:15,
        width:'100%',
        justifyContent: 'center',
        borderRadius: 15,
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
        marginTop: 50,
        // marginLeft: 30,
        // marginRight: 30,
        marginBottom: 10,
        fontSize: 18,
        // fontWeight: 'bold',
        height: 120,
        padding: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'tomato',
      },
    restauntName: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
    },
})

export default CommonStyles;