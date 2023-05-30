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
                    {/* Aquí puedes agregar otros elementos o contenido dentro de la imagen */}
                </Image>
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
    },
    imageContainer: {
        borderRadius: 45,
        transform: [{ translateY: -60 }],
        marginTop: 10,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        height:windowHeight * 0.50,
        width:windowWidth,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 10,
        shadowRadius: 0.5,
        shadowColor: '#000',
        elevation: 10,
    },
});

export default PlaceDetailScreen;