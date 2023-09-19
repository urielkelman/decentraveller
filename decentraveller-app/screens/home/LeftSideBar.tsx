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
import { obfuscateAddress } from '../../commons/functions/utils';
import { apiAdapter } from '../../api/apiAdapter';
import RootNavigator from './RootNavigator';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { userNickname, connectionContext } = useAppContext();
    const user = {
        profileImageUrl: apiAdapter.getProfileAvatarUrl(
            connectionContext?.connectedAddress ? connectionContext.connectedAddress : '',
            true,
        ),
        name: userNickname.value,
        walletAddress: connectionContext?.connectedAddress ? obfuscateAddress(connectionContext.connectedAddress) : '',
    };

    return (
        <DrawerContentScrollView {...props}>
            <SafeAreaView style={drawerStyles.container}>
                <View style={drawerStyles.userContainer}>
                    <View style={drawerStyles.profileImageContainer}>
                        <Image
                            key={Date.now()}
                            source={{
                                uri: user.profileImageUrl,
                            }}
                            style={drawerStyles.profileImage}
                        />
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
    return (
        <Drawer.Navigator drawerContent={(drawerProps) => <CustomDrawerContent {...drawerProps} />}>
            <Drawer.Screen name="Decentraveller" component={RootNavigator} />
        </Drawer.Navigator>
    );
};

export default LeftSideBar;
