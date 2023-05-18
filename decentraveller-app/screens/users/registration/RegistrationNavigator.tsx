import { createStackNavigator } from '@react-navigation/stack';
import RegisterUserScreen from './RegisterUserScreen';
import WelcomeUserScreen from './WelcomeUserScreen';
import CreateUserProvider from './CreateUserContext';
import SuccessRegisterUserScreen from './SuccessRegisterUserScreen';
import React from 'react';

type RegistrationStackParamList = {
    RegisterUserScreen: undefined;
    WelcomeUserScreen: undefined;
    SuccessRegisterUserScreen:  { onSuccess?: () => void };
};

export type RegistrationProps = {
    onSuccess: () => void;
};

const RegistrationStackNavigator = createStackNavigator<RegistrationStackParamList>();

const RegistrationNavigator: React.FC<RegistrationProps> = ({ onSuccess }) => {
    return (
        <CreateUserProvider>
            <RegistrationStackNavigator.Navigator screenOptions={{ headerShown: false }}>
                <RegistrationStackNavigator.Screen name="WelcomeUserScreen" component={WelcomeUserScreen} />
                <RegistrationStackNavigator.Screen
                    name="RegisterUserScreen"
                    component={RegisterUserScreen}
                />
                <RegistrationStackNavigator.Screen name="SuccessRegisterUserScreen">
                    {(props) => (
                        <SuccessRegisterUserScreen {...props} onSuccess={onSuccess} />
                    )}
                </RegistrationStackNavigator.Screen>
            </RegistrationStackNavigator.Navigator>
        </CreateUserProvider>
    );
};

export default RegistrationNavigator;