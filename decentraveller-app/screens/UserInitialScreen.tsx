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
    const [userLoading, setUserLoading] = React.useState<boolean>(false);
    const appContext = useAppContext();

    const getUser = async () => {
        //const adapter = mockApiAdapter
        //const wallet = "mati"

        const adapter = apiAdapter;
        const wallet = appContext.connectionContext.connectedAddress;
        await adapter.getUser(wallet, () => {
            setStackToRender('Registration');
            setUserLoading(false);
        });
        setUserLoading(false);
    };

    useEffect(() => {
        // http, setStack, loading
        (async () => {
            if (!appContext.connectionContext) {
                setStackToRender('Login');
            } else {
                setUserLoading(true);
                await getUser();
                setStackToRender('Home');
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
            {/* evaluate loading user and render a generica loading component if appropiate */}
            {navigatorToRender()}
        </NavigationContainer>
    );
};

export default DecentravellerInitialScreen;
