import { NavigationContainer, TypedNavigator } from '@react-navigation/native';
import React from 'react';
import { useConnectionContext } from '../context/AppContext';
import LoginNavigator from './login/LoginNavigator';
import RootNavigator from './home/RootNavigator';

const DecentravellerInitialScreen = () => {
    const appContext = useConnectionContext();
    const stackToRender: JSX.Element = appContext.connectedAddress === null ? <LoginNavigator /> : <RootNavigator />;
    return <NavigationContainer>{stackToRender}</NavigationContainer>;
};

export default DecentravellerInitialScreen;
