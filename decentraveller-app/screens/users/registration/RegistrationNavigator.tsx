import { createStackNavigator } from '@react-navigation/stack';
import RegisterUserScreen from "./RegisterUserScreen";
import WelcomeUserScreen from "./WelcomeUserScreen";
import CreateUserProvider from "./CreateUserContext";

type RegistrationStackParamList = {
    RegisterUserScreen: undefined;
    WelcomeUserScreen: undefined;
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
            </RegistrationStackNavigator.Navigator>
        </CreateUserProvider>
        );
};

export default RegistrationNavigator;
