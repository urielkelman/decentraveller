import {View, Image, StyleSheet, Dimensions} from 'react-native';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const path = '../../../assets/mock_images/eretz-inside.jpeg'
const PlaceDetailScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require(path)}
                    style={styles.image}
                >
                </Image>
            </View>
            <View style={styles.shadowContainer}>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE1E1',

    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        marginTop: -20
    },
    imageContainer: {
        borderRadius: 45,
        transform: [{ translateY: -60 }],
        marginTop: 10,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        height:windowHeight * 0.50,
        width:windowWidth,
        shadowOffset: { width: 1.5, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        shadowColor: '#000',
        elevation: 9,
    },
    shadowContainer: {
        borderRadius: 50,
        marginTop: -390,
        marginLeft: 40,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        height:windowHeight * 0.50,
        width:windowWidth / 1.3 ,
        shadowOffset: { width: 1.5, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 0.9,
        shadowColor: '#000',
        elevation: 15,
    },
});

export default PlaceDetailScreen;