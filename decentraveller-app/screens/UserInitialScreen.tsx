import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import WrongChainModal from './login/WrongChainModal';
import HomeNavigator from './home/HomeNavigator';
import LoginNavigator from './login/LoginNavigator';
import RegistrationNavigator from './users/registration/RegistrationNavigator';
import { apiAdapter } from '../api/apiAdapter';
import { mockApiAdapter } from '../api/mockApiAdapter';

const DecentravellerInitialScreen = () => {
    const [stackToRender, setStackToRender] = React.useState<'Login' | 'Home' | 'Registration'>();
    const appContext = useAppContext();

    const getUser = async () => {
        //const adapter = mockApiAdapter
        //const wallet = "uri"

        const adapter = apiAdapter;
        const wallet = appContext.connectionContext.connectedAddress;
        const user = await adapter.getUser(wallet, () => {});

        const render = user ? 'Home' : 'Registration'
        setStackToRender(render)
    };

    useEffect(() => {
        (async () => {
            if (!appContext.connectionContext) {
                setStackToRender('Login');
            } else {
                await getUser();
            }
        })();
    }, [appContext.connectionContext]);

    const onSuccessfulRegistration = () => {
        setStackToRender('Home');
    };

    const navigatorToRender = () => {
        switch (stackToRender) {
            case 'Home':
                return <HomeNavigator />;
            case 'Login':
                return <LoginNavigator />;
            case 'Registration':
                return <RegistrationNavigator onSuccess={onSuccessfulRegistration} />;
        }
    };

    return (
        <NavigationContainer>
            <WrongChainModal />
            {navigatorToRender()}
        </NavigationContainer>
    );
};

export default DecentravellerInitialScreen;
