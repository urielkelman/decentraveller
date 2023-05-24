import React from 'react';
import {  Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItemList
} from '@react-navigation/drawer';
import {drawerStyles} from "../../styles/drawerStyles";
import {useAppContext} from "../../context/AppContext";
import {obfuscateAddress} from "../../commons/utils";
import Home from "./Home";
import UserProfileScreen from "../users/profile/UserProfileScreen";
import RootNavigator from "./RootNavigator";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const {nickname} = useAppContext().userNickname
    const {walletAddress} = useAppContext().userWalletAddress

    const user = {
        profileImage: require('./cryptochica.png'),
        name: nickname,
        walletAddress: obfuscateAddress(walletAddress),
    };

    return (
        <DrawerContentScrollView {...props}>
            <SafeAreaView style={drawerStyles.container}>
                <View style={drawerStyles.userContainer}>
                    <View style={drawerStyles.profileImageContainer}>
                        <Image source={user.profileImage} style={drawerStyles.profileImage} />
                    </View>
                    <View>
                        <Text style={drawerStyles.userName}>{user.name}</Text>
                        <Text style={drawerStyles.userWallet}>{user.walletAddress}</Text>
                    </View>
                </View>
            </SafeAreaView>
            <View style={drawerStyles.drawerContent}>
                <DrawerItemList {...props} />
            </View>
        </DrawerContentScrollView>
    );
};

const HomeNavigatorDrawer = ({ navigation }) => {
    return (
        <Drawer.Navigator
            drawerContent={(drawerProps) => (
                <CustomDrawerContent {...drawerProps} />
            )}
        >
            <Drawer.Screen name="Decentraveller" component={RootNavigator}/>
            <Drawer.Screen name="Profile" component={UserProfileScreen}/>

        </Drawer.Navigator>
    );
};


export default HomeNavigatorDrawer;

