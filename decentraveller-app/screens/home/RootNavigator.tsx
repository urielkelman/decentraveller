import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { sizesConfig } from '../../config/sizesConfig';
import React from 'react';
import { useDeviceDimensions } from '../../context/AppContext';
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

const getTabBarIcon = (
    route: Readonly<{ key: string; name: 'ConnectWalletScreen' | 'Home'; path?: string }>,
    iconSize: number
) => {
    return ({ focused, color, size }: bottomTabElementProps): JSX.Element => {
        if (route.name === 'ConnectWalletScreen') {
            return <AntDesign name="home" size={iconSize} color="black" />;
        } else if (route.name === 'Home') {
            return <AntDesign name="user" size={iconSize} color="black" />;
        }
        return <AntDesign name="home" size={iconSize} color="black" />;
    };
};

const getBottomTabNavigatorScreenOptions = (
    route: Readonly<{ key: string; name: 'ConnectWalletScreen' | 'Home'; path?: string }>
): BottomTabNavigationOptions => {
    const deviceDimensions = useDeviceDimensions();
    return {
        tabBarIcon: getTabBarIcon(route, deviceDimensions.width / sizesConfig.bottomTabIconSizeWidthInverseFraction),
        tabBarActiveTintColor: 'tomato',
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

const RootNavigator = () => {
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
