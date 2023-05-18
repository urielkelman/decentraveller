import { createStackNavigator } from '@react-navigation/stack';
import RegisterUserScreen from './RegisterUserScreen';
import WelcomeUserScreen from './WelcomeUserScreen';
import CreateUserProvider from './CreateUserContext';
import SuccessRegisterUserScreen from './SuccessRegisterUserScreen';
import HomeNavigator from '../../home/HomeNavigator';
import React from 'react';

type RegistrationStackParamList = {
    RegisterUserScreen: undefined;
    WelcomeUserScreen: undefined;
    SuccessRegisterUserScreen: undefined;
    HomeNavigator: undefined;
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
                    /* Pass on success so we can change the navigator in the initial screen */
                    component={RegisterUserScreen}
                />
                <RegistrationStackNavigator.Screen
                    name="SuccessRegisterUserScreen"
                    component={SuccessRegisterUserScreen}
                />
                {/* Esto no deberia hacer mas falta */}
                <RegistrationStackNavigator.Screen name="HomeNavigator" component={HomeNavigator} />
            </RegistrationStackNavigator.Navigator>
        </CreateUserProvider>
    );
};

export default RegistrationNavigator;
