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
        flexDirection:'row',
        justifyItem:'start',
        justifyContent:'center',
    },
})

export default CommonStyles;