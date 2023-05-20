import { createDrawerNavigator } from '@react-navigation/drawer';
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
const Drawer = createDrawerNavigator();

const HomeNavigator = () => {
    return (
        <CreatePlaceProvider>
            <Drawer.Navigator initialRouteName="Home" /* ver que opciones puedo sumar al drawer */>
                <Drawer.Screen name="Home" component={HomeStackNavigatorScreen} />
                <Drawer.Screen name="Explore" component={null} /* agregar el explore cuando este *//>
            </Drawer.Navigator>
        </CreatePlaceProvider>
    );
};

const HomeStackNavigatorScreen = () => {
    return (
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
    );
};

export default HomeNavigator;

