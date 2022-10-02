import { NavigationContainer, TypedNavigator } from '@react-navigation/native';
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import LoginNavigator from './login/LoginNavigator';
import RootNavigator from './home/RootNavigator';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { Modal } from 'react-native';
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
