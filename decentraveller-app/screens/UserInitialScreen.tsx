import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppContext, useAppContext } from '../context/AppContext';
import WrongChainModal from './login/WrongChainModal';
import LoginNavigator from './login/LoginNavigator';
import RegistrationNavigator from './users/registration/RegistrationNavigator';
import { apiAdapter } from '../api/apiAdapter';
import { mockApiAdapter } from '../api/mockApiAdapter';
import HomeNavigator from './home/HomeNavigator';
import DecentravellerInformativeModal from '../commons/components/DecentravellerInformativeModal';

const adapter = apiAdapter;

const DecentravellerInitialScreen = () => {
    let [stackToRender, setStackToRender] = React.useState<'Login' | 'Home' | 'Registration'>('Login');
    const appContext = useAppContext();
    const setUserNickname = appContext.userNickname.setValue;
    const setUserCreatedAt = appContext.userCreatedAt.setValue;
    const setUserInterest = appContext.userInterest.setValue;

    const getUser = async () => {
        const user = await adapter.getUser(appContext.connectionContext.connectedAddress, () => {
            setStackToRender('Registration');
        });

        if (!user) return;

        setUserNickname(user.nickname);
        setUserCreatedAt(user.createdAt);
        setUserInterest(user.interest);
        setStackToRender('Home');
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
