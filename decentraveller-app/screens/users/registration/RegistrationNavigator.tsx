import { createStackNavigator } from '@react-navigation/stack';
import RegisterUserScreen from "./RegisterUserScreen";

type RegistrationStackParamList = {
    RegisterUserScreen: undefined;
};

const RegistrationStackNavigator = createStackNavigator<RegistrationStackParamList>();

const RegistrationNavigator = () => {
    return (
        <RegistrationStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <RegistrationStackNavigator.Screen name="RegisterUserScreen" component={RegisterUserScreen} />
        </RegistrationStackNavigator.Navigator>
    );
};

export default RegistrationNavigator;
