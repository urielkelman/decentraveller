import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppContext, useAppContext } from '../context/AppContext';
import WrongChainModal from './login/WrongChainModal';
import LoginNavigator from './login/LoginNavigator';
import RegistrationNavigator from './users/registration/RegistrationNavigator';
import { apiAdapter } from '../api/apiAdapter';
import { mockApiAdapter } from '../api/mockApiAdapter';
import HomeNavigator from './home/HomeNavigator';

const DecentravellerInitialScreen = () => {
    let [stackToRender, setStackToRender] = React.useState<'Login' | 'Home' | 'Registration'>('Login');
    const appContext = useAppContext();
    const { setUserNickname } = appContext.userNickname;
    const { setUserWalletAddress } = appContext.userWalletAddress;
    const { setUserCreatedAt } = appContext.userCreatedAt;
    const { setUserInterest } = appContext.userInterest;

    const getUser = async () => {
        const adapter = mockApiAdapter;
        const wallet = 'uri';
        const user = await adapter.getUser(wallet, () => {
            setStackToRender('Registration');
        });

        if (!user) return;

        setUserNickname(user.UserElementResponse.nickname);
        setUserCreatedAt(user.UserElementResponse.createdAt);
        setUserInterest(user.UserElementResponse.interest);
        setUserWalletAddress(wallet);
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
