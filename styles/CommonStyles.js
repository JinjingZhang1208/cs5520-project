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

    restauntName: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    pressableButtonStyle: {
        backgroundColor: 'tomato', 
        padding: 7, 
        borderRadius: 10, 
        alignSelf: 'center'
    },
})

export default CommonStyles;