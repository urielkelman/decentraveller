import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import WrongChainModal from './login/WrongChainModal';
import HomeNavigator from './home/HomeNavigator';
import LoginNavigator from './login/LoginNavigator';
import RegistrationNavigator from "./users/registration/RegistrationNavigator";
import { apiAdapter } from '../api/apiAdapter';
import {mockApiAdapter} from '../api/mockApiAdapter';


const DecentravellerInitialScreen = () => {
    const [renderStack, setRenderStack] = React.useState(null);
    const appContext = useAppContext();

    const checkUser = async () => {
        //const wallet = appContext.connectionContext.connectedAddress;
        //const response = await apiAdapter.getUser(wallet);
        const wallet = "mati"
        const response = await mockApiAdapter.getUser(wallet);
        console.log(response)
        if (response.code === 200) {
            return;
        } else {
            // TODO: catch this promise rejection
            throw new PromiseRejectionEvent("Error 404", { promise: Promise.reject() });
        }
    };

    useEffect(() => {
        if (appContext.connectionContext === null) {
            setRenderStack(<LoginNavigator />);
        } else {
            let promise = checkUser();
            promise.then(() => setRenderStack(<HomeNavigator />))
            promise.catch(() => setRenderStack(<RegistrationNavigator />))

        }
    }, [appContext.connectionContext]);

    return (
        <NavigationContainer>
            <WrongChainModal />
            {renderStack}
        </NavigationContainer>
    );
};


export default DecentravellerInitialScreen;
