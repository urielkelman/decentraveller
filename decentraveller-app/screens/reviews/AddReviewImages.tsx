import React from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import {addReviewsScreenWordings} from "./wording";
import DecentravellerButton from "../../commons/components/DecentravellerButton";

const imagePath1 = '../../assets/images/ar4.jpeg'
const imagePath2 = '../../assets/images/ar2.jpeg'
const imagePath3 = '../../assets/images/ar1.jpeg'
const imagePath4 = '../../assets/images/ar3.jpeg'
const imagePath5 = '../../assets/images/ar5.jpeg'
const imagePath6 = '../../assets/images/ar6.jpeg'

type CircleImageItemProps = {
    imagePath: any;
};
const circleImage: React.FC<CircleImageItemProps> = ({imagePath}) => {
    return ( <View style={styles.circleImage}>
        <Image source={imagePath} style={styles.image} />
    </View> )
}

const AddReviewImages = ({navigation}) => {
    return (
        <View style={styles.container}>
            <View style={styles.commentExampleContainer}>
                {circleImage({ imagePath: require(imagePath1) })}
                {circleImage({ imagePath: require(imagePath2) })}
                {circleImage({ imagePath: require(imagePath3) })}
                {circleImage({ imagePath: require(imagePath4) })}
                {circleImage({ imagePath: require(imagePath5) })}
                {circleImage({ imagePath: require(imagePath6) })}
            </View>
            <Text style={styles.title}>{addReviewsScreenWordings.ADD_IMAGE_TITLE}</Text>
            <View style={styles.uploadContainer}>
                <View style={styles.circleImage}>
                    <Image source={require('../../assets/images/imageUpload.jpeg')} style={styles.imageUpload} />
                    <TouchableOpacity style={styles.smallCircleButton}>
                        <Image source={require('../../assets/images/pencil.png')} style={styles.smallCircleImage} />
                    </TouchableOpacity>
                </View>
            </View>
            <DecentravellerButton text={'Next'} loading={false} onPress={()=>{navigation.navigate('AddReviewComment')}} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE1E1',
        padding: 25,
    },
    commentExampleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginHorizontal: -5,
    },
    circleImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleUpload: {
        width: 200,
        height: 200,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageUpload: {
        width: 180,
        height: 180,
        borderRadius: 90,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 50,
    },
    smallCircleButton: {
        position: 'absolute',
        top: -70,
        right: -60,
        width: 45,
        height: 45,
        borderRadius: 100,
        backgroundColor: '#983B46',
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallCircleImage: {
        width: 24,
        height: 24,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Montserrat_700Bold',
        textAlign: 'center',
        marginRight: 10,
        marginLeft: 10,
        marginTop: 50,
    },
});


export default AddReviewImages;
