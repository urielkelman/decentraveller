import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import CreatePlaceFirstScreen from './place/CreatePlaceFirstScreen';
import CreatePlaceProvider from "./place/CreatePlaceContext";

type HomeStackScreens = {
    Home: undefined;
    CreatePlaceFirstScreen: undefined;
};

const HomeStackNavigator = createStackNavigator<HomeStackScreens>();

const HomeNavigator = () => {
    return (
        <CreatePlaceProvider>
            <HomeStackNavigator.Navigator initialRouteName="Home">
                <HomeStackNavigator.Screen name="Home" component={Home} />
                <HomeStackNavigator.Screen
                    name="CreatePlaceFirstScreen"
                    component={CreatePlaceFirstScreen}
                    options={{
                        title: 'Add new place',
                        headerMode: 'screen',
                    }}
                />
            </HomeStackNavigator.Navigator>
        </CreatePlaceProvider>
    );
};

export default HomeNavigator;
