import React, {useEffect} from 'react';
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
        //const adapter = mockApiAdapter
        //const wallet = "mati"

        const adapter = apiAdapter
        const wallet = appContext.connectionContext.connectedAddress;
        return await adapter.getUser(wallet);
    };

    useEffect(() => {
        (async () => {
            try {
                if (appContext.connectionContext === null) {
                    setRenderStack(<LoginNavigator />);
                } else {
                    const response = await checkUser();
                    console.log(response);

                    if (response.code === 200) {
                        setRenderStack(<HomeNavigator />);
                    } else {
                        console.log('Usuario no encontrado');
                        setRenderStack(<RegistrationNavigator />);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        })();
    }, [appContext.connectionContext]);

    return (
        <NavigationContainer>
            <WrongChainModal />
            {renderStack}
        </NavigationContainer>
    );
};


export default DecentravellerInitialScreen;
