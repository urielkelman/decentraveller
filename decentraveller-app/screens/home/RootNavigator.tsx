import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { sizesConfig } from '../../config/sizesConfig';
import React from 'react';
import { useDeviceDimensions } from '../../context/AppContext';
import HomeScreen from './HomeScreen';
import ExplorePlacesScreen from './ExplorePlacesScreen';
import CommunityScreen from './CommunityScreen';

type RootStackScreens = {
    Home: undefined;
    ExplorePlaces: undefined;
    Community: undefined;
};

const RootTabNavigator = createBottomTabNavigator<RootStackScreens>();

type bottomTabElementProps = {
    focused: boolean;
    color: string;
    size: number;
};

const DEFAULT_BOTTOM_TAB_ICONS_COLOR = '#983B46';

const RootNavigator = () => {
    const getTabBarIcon = (
        route: Readonly<{ key: string; name: 'Home' | 'ExplorePlaces' | 'Community'; path?: string }>,
        iconSize: number
    ) => {
        return ({ focused, color, size }: bottomTabElementProps): JSX.Element => {
            switch (route.name) {
                case 'Home':
                    return <FontAwesome name="home" size={iconSize} color={DEFAULT_BOTTOM_TAB_ICONS_COLOR} />;
                case 'ExplorePlaces':
                    return <FontAwesome name="globe" size={iconSize} color={DEFAULT_BOTTOM_TAB_ICONS_COLOR} />;
                case 'Community':
                    return <FontAwesome name="group" size={iconSize} color={DEFAULT_BOTTOM_TAB_ICONS_COLOR} />;
                default:
                    return <FontAwesome name="home" size={iconSize} color={DEFAULT_BOTTOM_TAB_ICONS_COLOR} />;
            }
        };
    };

    const getBottomTabNavigatorScreenOptions = (
        route: Readonly<{ key: string; name: 'Home' | 'ExplorePlaces' | 'Community'; path?: string }>
    ): BottomTabNavigationOptions => {
        const deviceDimensions = useDeviceDimensions();
        return {
            tabBarIcon: getTabBarIcon(
                route,
                deviceDimensions.width / sizesConfig.bottomTabIconSizeWidthInverseFraction
            ),
            tabBarActiveTintColor: '#983B46',
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
            <RootTabNavigator.Screen name="Home" component={HomeScreen} />
            <RootTabNavigator.Screen
                name="ExplorePlaces"
                options={{ title: 'Explore' }}
                component={ExplorePlacesScreen}
            />
            <RootTabNavigator.Screen name="Community" component={CommunityScreen} />
        </RootTabNavigator.Navigator>
    );
};

export default RootNavigator;
