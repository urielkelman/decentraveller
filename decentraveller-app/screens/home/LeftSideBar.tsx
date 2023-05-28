import React from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItem,
} from '@react-navigation/drawer';
import { drawerStyles } from '../../styles/drawerStyles';
import { useAppContext } from '../../context/AppContext';
import { obfuscateAddress } from '../../commons/utils';
import RootNavigator from './RootNavigator';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { userNickname, userWalletAddress } = useAppContext();

    const user = {
        // TODO: Take profileImage from backend when implementation is developed
        profileImage: require('../../assets/mock_images/cryptochica.png'),
        name: userNickname.nickname,
        walletAddress: obfuscateAddress(userWalletAddress.walletAddress),
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
                <DrawerItem label="Home" onPress={() => props.navigation.navigate('Decentraveller')} />
                <DrawerItem label="Profile" onPress={() => props.navigation.navigate('Profile')} />
            </View>
        </DrawerContentScrollView>
    );
};

const LeftSideBar = () => {
    console.log('sidebar');
    return (
        <Drawer.Navigator drawerContent={(drawerProps) => <CustomDrawerContent {...drawerProps} />}>
            <Drawer.Screen name="Decentraveller" component={RootNavigator} />
        </Drawer.Navigator>
    );
};

export default LeftSideBar;
