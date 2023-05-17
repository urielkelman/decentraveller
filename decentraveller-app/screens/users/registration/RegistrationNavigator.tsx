import { createStackNavigator } from '@react-navigation/stack';
import RegisterUserScreen from "./RegisterUserScreen";
import WelcomeUserScreen from "./WelcomeUserScreen";
import CreateUserProvider from "./CreateUserContext";
import SuccessRegisterUserScreen from "./SuccessRegisterUserScreen";
import HomeNavigator from '../../home/HomeNavigator';


type RegistrationStackParamList = {
    RegisterUserScreen: undefined;
    WelcomeUserScreen: undefined;
    SuccessRegisterUserScreen: undefined;
    HomeNavigator: undefined;
};

const RegistrationStackNavigator = createStackNavigator<RegistrationStackParamList>();

const RegistrationNavigator = () => {
    return (
        <CreateUserProvider>
            <RegistrationStackNavigator.Navigator screenOptions={{ headerShown: false }}>
                <RegistrationStackNavigator.Screen
                    name="WelcomeUserScreen"
                    component={WelcomeUserScreen}
                />
                <RegistrationStackNavigator.Screen
                    name="RegisterUserScreen"
                    component={RegisterUserScreen}
                />
                <RegistrationStackNavigator.Screen
                    name="SuccessRegisterUserScreen"
                    component={SuccessRegisterUserScreen}
                />
                <RegistrationStackNavigator.Screen
                    name="HomeNavigator"
                    component={HomeNavigator}
                />
            </RegistrationStackNavigator.Navigator>
        </CreateUserProvider>
        );
};

export default RegistrationNavigator;
