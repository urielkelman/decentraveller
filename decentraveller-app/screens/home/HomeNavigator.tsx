import React from 'react';
import {  Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItemList
} from '@react-navigation/drawer';
import CreatePlaceProvider from './place/CreatePlaceContext';
import HomeNavigatorStack from "./HomeNavigatorStack";

const Drawer = createDrawerNavigator();
const CustomDrawerContent = (props: DrawerContentComponentProps) => {

    const user = {
        profileImage: require('./cryptochica.png'),
        name: 'Ana Cruz',
        walletAddress: '0xb794...9268',
    };

    return (
        <DrawerContentScrollView {...props}>
            <SafeAreaView style={styles.container}>
                <View style={styles.userContainer}>
                    <View style={styles.profileImageContainer}>
                        <Image source={user.profileImage} style={styles.profileImage} />
                    </View>
                    <View>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userWallet}>{user.walletAddress}</Text>
                    </View>
                </View>
            </SafeAreaView>
            <View style={styles.drawerContent}>
                <DrawerItemList {...props} />
            </View>
        </DrawerContentScrollView>
    );
};

const HomeNavigator = () => {
    return (
        <CreatePlaceProvider>
            <Drawer.Navigator
                initialRouteName="Home"
                drawerContent={CustomDrawerContent}
            >
                <Drawer.Screen name="Home" component={HomeNavigatorStack} />
            </Drawer.Navigator>
        </CreatePlaceProvider>
    );
};

const styles = StyleSheet.create({
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    profileImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 8,
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    userName: {
        fontSize: 21,
        fontWeight: 'bold',
        fontFamily: 'sans-serif-medium',
    },
    userWallet: {
        fontSize: 16,
        fontWeight: '100',
        fontFamily: 'sans-serif-light',

    },
    drawerContent: {
        flex: 1,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 1,
        backgroundColor: '#FD6868',
        borderRadius: 10,
        marginHorizontal: 8,
        marginVertical: 12,
    },
});


export default HomeNavigator;

