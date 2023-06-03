import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

const PlaceReviewsBox = () => {
    return (
        <TouchableOpacity style={styles.container} onPress={() => {}}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Reviews</Text>
                <Text style={styles.moreText}>More</Text>
            </View>
            <View style={styles.reviewItem}>
                <View style={styles.commentContainer}>
                    <Text style={styles.commentText}>
                        {'Excelente la comida!! Me dieron ganas de viajar a medio Oriente!.'} - {' '}
                        <Text style={styles.dateText}>{"10/02/2023"}</Text>
                    </Text>
                    <View style={styles.userContainer}>
                        <Image
                            source={require('../../../assets/mock_images/cryptochica.png')}
                            style={styles.avatarImage}
                        />
                        <Text style={styles.userNameText}>Ana Cruz</Text>
                    </View>
                </View>
            </View>
            <View style={styles.reviewItem}>
                <View style={styles.commentContainer}>
                    <Text style={styles.commentText}>
                        {'Rica comida israelí'} - {' '}
                        <Text style={styles.dateText}>{"03/01/2023"}</Text>
                    </Text>
                    <View style={styles.userContainer}>
                        <Image
                            source={require('../../../assets/mock_images/cryptochica2.png')}
                            style={styles.avatarImage}
                        />
                        <Text style={styles.userNameText}>HamikimiGirl</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => {}}>
                <View style={styles.buttonTextView}>
                    {<Text style={styles.text}>{"Add review"}</Text>}
                </View>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    moreText: {
        fontSize: 12,
        color: 'blue',
        fontWeight: 'bold',
    },
    reviewItem: {
        marginBottom: 6,
    },
    commentContainer: {
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        padding: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 53
    },
    commentText: {
        fontSize: 15,
        flex: 1,
        marginRight: 6,
    },
    userContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    avatarImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginBottom: 2,
        marginRight: 10
    },
    userNameText: {
        fontSize: 12,
        color: 'red',
        fontWeight: 'bold',

    },
    dateText: {
        opacity: 0.6,
        color: 'gray',
    },
    buttonContainer: {
        paddingVertical: 12,
        borderRadius: 10,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#983B46',
        alignItems: 'center',
        borderRadius: 10,
        padding: 4,
        height: 30
    },
    buttonTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 8,
    },
    text: {
        color: 'white',
        fontFamily: 'Montserrat_400Regular',
        fontWeight: 'bold',
    },
});

export default PlaceReviewsBox;
