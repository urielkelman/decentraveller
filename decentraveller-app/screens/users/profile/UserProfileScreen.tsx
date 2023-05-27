import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

export type UserProfileScreens = {
    UserProfileScreen: undefined;
};

const HomeStackNavigator = createStackNavigator<UserProfileScreens>();

const UserProfileScreen = ({ navigation }) => {
    const onClickContinue = () => {
        navigation.navigate('UserProfileEditScreen');
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFE1E1' }}>
            {/*RECUADRO DE USER*/}
            <View style={styles.mainContainer}>
                <View style={styles.imageContainer}>
                    <View style={styles.imageCircle}>
                        <Image source={require('../../../assets/mock_images/cryptochica.png')} style={styles.circleDimensions} />
                    </View>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.nicknameTitle}>ElUriK</Text>
                    <Text style={styles.walletSubtitle}>0x3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5</Text>
                </View>
                <View style={styles.joinedAtContainer}>
                    <Text style={styles.joinedAtText}>Joined Decentraveller on: 10/05/2023</Text>
                </View>
            </View>

            <View style={styles.informationContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 10 }}>
                    <Text style={styles.leftText}>Main interest</Text>
                    <Text style={styles.rightText}>Gastronomy</Text>
                </View>
                <View style={styles.spacedBetweenView}>
                    <Text style={styles.leftText}>Shared Location</Text>
                    <Text style={styles.rightText}>Yes</Text>
                </View>
                <View style={styles.spacedBetweenView}   >
                    <Text style={styles.leftText}>DT Tokens</Text>
                    <Text style={styles.rightText}>67 </Text>
                </View>
            </View>

            <View style={styles.informationContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 40 }}   >
                    <Text style={styles.leftText}>My Places(3)</Text>
                    <Text style={styles.rightBlueText}>More </Text>
                </View>
            </View>


            <View style={styles.informationContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 40 }}   >
                    <Text style={styles.leftText}>My Reviews(5)</Text>
                    <Text style={styles.rightBlueText}>More </Text>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginHorizontal: 13,
        marginTop: 20,
        width: 388,
        height: 247,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24
    },
    imageCircle: {
        backgroundColor: 'lightgray',
        borderRadius: 50,
        width: 100,
        height: 100,
        overflow: 'hidden'
    },
    circleDimensions: {
        width: 100,
        height: 100
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    nicknameTitle: {
        fontFamily: 'Montserrat_700Bold',
        fontSize: 18,
        textAlign: 'center'
    },
    walletSubtitle: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 11,
        textAlign: 'center'
    },
    joinedAtContainer: {
        backgroundColor: '#F3F3F3',
        borderRadius: 5,
        marginHorizontal: 14,
        marginTop: 15,
        height: 41,
        justifyContent: 'center'
    },
    joinedAtText: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 11,
        color: '#020202',
        paddingHorizontal: 10
    },
    informationContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginHorizontal: 13,
        marginTop: 10,
        width: 388,
        height: 100
    },
    spacedBetweenView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 10
    },
    leftText: {
        fontFamily: 'Montserrat_700Bold',
        fontSize: 15,
        textAlign: 'left',
        fontWeight: 'bold'
    },
    rightText: {
        fontFamily: 'Montserrat_500Medium', 
        fontSize: 15, 
        textAlign: 'right', 
        fontWeight: '100'
    },
    rightBlueText: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 15,
        textAlign: 'right',
        fontWeight: 'bold',
        color: 'blue'
    },

});

const UserNavigator = () => {
    return (
        <HomeStackNavigator.Navigator initialRouteName="UserProfileScreen" screenOptions={{ headerShown: false }}>
            <HomeStackNavigator.Screen name="UserProfileScreen" component={UserProfileScreen} />
        </HomeStackNavigator.Navigator>
    );
};

export default UserNavigator;

