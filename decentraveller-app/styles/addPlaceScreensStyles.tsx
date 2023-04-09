import {Dimensions, StyleSheet} from "react-native";

const { height, width } = Dimensions.get('window');

const addPlaceHeadingTextStyles = StyleSheet.create({
    text: {
        color: 'black',
        fontFamily: 'Montserrat_800ExtraBold',
        fontWeight: 'bold',
        fontSize: height * 0.056,
        lineHeight: height * 0.037,
    },

})

const addPlaceScreenStyles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFE1E1',
    },
})

export { addPlaceHeadingTextStyles, addPlaceScreenStyles };