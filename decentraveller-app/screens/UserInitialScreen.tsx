import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import WrongChainModal from './login/WrongChainModal';
import HomeNavigator from './home/HomeNavigator';
import LoginNavigator from './login/LoginNavigator';

const DecentravellerInitialScreen = () => {
    const appContext = useAppContext();
    // const stackToRender: JSX.Element = appContext.connectionContext === null ? <LoginNavigator /> : <HomeNavigator />;
    const stackToRender: JSX.Element = <HomeNavigator />;
    return (
        <NavigationContainer>
            <WrongChainModal />
            {stackToRender}
        </NavigationContainer>
    );
};

export default DecentravellerInitialScreen;
