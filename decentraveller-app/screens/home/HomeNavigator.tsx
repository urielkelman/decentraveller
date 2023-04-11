import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import CreatePlaceFirstScreen from './place/CreatePlaceFirstScreen';

type HomeStackScreens = {
    Home: undefined;
    CreatePlaceFirstScreen: undefined;
};

const HomeStackNavigator = createStackNavigator<HomeStackScreens>();

const HomeNavigator = () => {
    return (
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
    );
};

export default HomeNavigator;
