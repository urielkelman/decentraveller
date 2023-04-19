import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import CreatePlaceNameScreen from './place/CreatePlaceNameScreen';
import CreatePlaceProvider from './place/CreatePlaceContext';
import CreatePlaceLocationScreen from './place/CreatePlaceLocationScreen';

export type HomeStackScreens = {
    Home: undefined;
    CreatePlaceNameScreen: undefined;
    CreatePlaceLocationScreen: undefined;
};

const HomeStackNavigator = createStackNavigator<HomeStackScreens>();

const HomeNavigator = () => {
    return (
        <CreatePlaceProvider>
            <HomeStackNavigator.Navigator initialRouteName="Home">
                <HomeStackNavigator.Screen name="Home" component={Home} />
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
