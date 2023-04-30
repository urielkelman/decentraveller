import { createStackNavigator } from '@react-navigation/stack';
import CreatePlaceNameScreen from './place/CreatePlaceNameScreen';
import CreatePlaceProvider from './place/CreatePlaceContext';
import CreatePlaceLocationScreen from './place/CreatePlaceLocationScreen';
import RootNavigator from './RootNavigator';

export type HomeStackScreens = {
    RootTabNavigator: undefined;
    CreatePlaceNameScreen: undefined;
    CreatePlaceLocationScreen: undefined;
};

const HomeStackNavigator = createStackNavigator<HomeStackScreens>();

const HomeNavigator = () => {
    return (
        <CreatePlaceProvider>
            <HomeStackNavigator.Navigator initialRouteName="RootTabNavigator">
                <HomeStackNavigator.Screen name="RootTabNavigator" component={RootNavigator} />
                <HomeStackNavigator.Screen
                    name="CreatePlaceNameScreen"
                    component={CreatePlaceNameScreen}
                    options={{
                        title: 'Add new place',
                        headerMode: 'screen',
                    }}
                />
                <HomeStackNavigator.Screen
                    name="CreatePlaceLocationScreen"
                    component={CreatePlaceLocationScreen}
                    options={{
                        title: 'Select location',
                        headerMode: 'screen',
                    }}
                />
            </HomeStackNavigator.Navigator>
        </CreatePlaceProvider>
    );
};

export default HomeNavigator;
