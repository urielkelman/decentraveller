import { Dimensions, StyleSheet } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const reviewDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F0F0F0',
    },
    title: {
        fontFamily: 'Montserrat_400Regular',
        fontWeight: 'bold',
        fontSize: 20,
        paddingVertical: 10,
    },
    placeDataContainer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    reviewContainer: {
        paddingHorizontal: 5,
    },
});

export { reviewDetailStyles };
