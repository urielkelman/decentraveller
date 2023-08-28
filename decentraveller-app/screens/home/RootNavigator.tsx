import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { sizesConfig } from '../../config/sizesConfig';
import React from 'react';
import { useDeviceDimensions } from '../../context/AppContext';
import HomeScreen from './HomeScreen';
import ExplorePlacesScreen from './explore/ExplorePlacesScreen';
import CommunityScreen from './CommunityScreen';
import { TouchableOpacity } from 'react-native';

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
        iconSize: number,
    ) => {
        console.log(route.name);
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
    const deviceDimensions = useDeviceDimensions();
    const getBottomTabNavigatorScreenOptions = (
        route: Readonly<{ key: string; name: 'Home' | 'ExplorePlaces' | 'Community'; path?: string }>,
    ): BottomTabNavigationOptions => {
        return {
            tabBarIcon: getTabBarIcon(
                route,
                deviceDimensions.width / sizesConfig.bottomTabIconSizeWidthInverseFraction,
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
            tabBarButton: (props) => {
                return (
                    <TouchableOpacity
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                            console.log('Tab pressed: ', route.name);
                            if (props.onPress) {
                                props.onPress();
                            }
                        }}
                    >
                        {props.children}
                    </TouchableOpacity>
                );
            },
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
