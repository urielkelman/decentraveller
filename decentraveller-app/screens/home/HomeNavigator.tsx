import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import CreatePlace from './place/CreatePlace';

type HomeStackScreens = {
    Home: undefined;
    CreatePlace: undefined;
};

const HomeStackNavigator = createStackNavigator<HomeStackScreens>();

const HomeNavigator = () => {
    return (
        <HomeStackNavigator.Navigator initialRouteName="Home">
            <HomeStackNavigator.Screen name="Home" component={Home} />
            <HomeStackNavigator.Screen
                name="CreatePlace"
                component={CreatePlace}
                options={{
                    title: 'Add new place',
                    headerMode: 'screen',
                }}
            />
        </HomeStackNavigator.Navigator>
    );
};

export default HomeNavigator;
