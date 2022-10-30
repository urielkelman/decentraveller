import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import LoginNavigator from './login/LoginNavigator';
import RootNavigator from './home/RootNavigator';
import WrongChainModal from './login/WrongChainModal';

const DecentravellerInitialScreen = () => {
    const appContext = useAppContext();
    const stackToRender: JSX.Element = appContext.connectionContext === null ? <LoginNavigator /> : <RootNavigator />;
    return (
        <NavigationContainer>
            <WrongChainModal />
            {stackToRender}
        </NavigationContainer>
    );
};

export default DecentravellerInitialScreen;
