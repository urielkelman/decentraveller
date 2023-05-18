import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { sizesConfig } from '../../config/sizesConfig';
import React from 'react';
import { useDeviceDimensions } from '../../context/AppContext';
import ConnectWalletScreen from '../login/ConnectWalletScreen';
import Home from './Home';

type RootStackScreens = {
    Home: undefined;
};

const RootTabNavigator = createBottomTabNavigator<RootStackScreens>();

type bottomTabElementProps = {
    focused: boolean;
    color: string;
    size: number;
};

const DEFAULT_BOTTOM_TAB_ICONS_COLOR = "#FFE1E1"

const RootNavigator = () => {

    const getTabBarIcon = (
        route: Readonly<{ key: string; name: 'ConnectWalletScreen' | 'Home'; path?: string }>,
        iconSize: number
    ) => {
        return ({ focused, color, size }: bottomTabElementProps): JSX.Element => {
            if (route.name === 'ConnectWalletScreen') {
                return <AntDesign name="home" size={iconSize} color={DEFAULT_BOTTOM_TAB_ICONS_COLOR} />;
            } else if (route.name === 'Home') {
                console.log('asd')
                return <AntDesign name="user" size={iconSize} color={DEFAULT_BOTTOM_TAB_ICONS_COLOR} />;
            }
            return <AntDesign name="home" size={iconSize} color={DEFAULT_BOTTOM_TAB_ICONS_COLOR} />;
        };
    };

    const getBottomTabNavigatorScreenOptions = (
        route: Readonly<{ key: string; name: 'Home'; path?: string }>
    ): BottomTabNavigationOptions => {
        const deviceDimensions = useDeviceDimensions();
        console.log(route)
        return {
            tabBarIcon: getTabBarIcon(route, deviceDimensions.width / sizesConfig.bottomTabIconSizeWidthInverseFraction),
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
                height: deviceDimensions.height / sizesConfig.bottomTabHeightInverseFraction,
            },
            tabBarLabelStyle: {
                fontSize: deviceDimensions.width / sizesConfig.bottomTabFontSizeWidthInverseFraction,
                fontFamily: 'sans-serif-medium',
                fontWeight: 'bold',
            },
            title: route.name.replace('Navigator', ''),
            headerShown: false,
        };
    };

    return (
        <RootTabNavigator.Navigator
            initialRouteName="Home"
            backBehavior="initialRoute"
            screenOptions={({ route }) => getBottomTabNavigatorScreenOptions(route)}
        >
            <RootTabNavigator.Screen name="Home" component={Home} />
        </RootTabNavigator.Navigator>
    );
};

export default RootNavigator;
