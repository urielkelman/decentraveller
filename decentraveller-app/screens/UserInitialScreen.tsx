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
    const setUserNickname = appContext.userNickname.setValue;
    const setUserWalletAddress = appContext.userWalletAddress.setValue;
    const setUserCreatedAt = appContext.userCreatedAt.setValue;
    const setUserInterest = appContext.userInterest.setValue;

    const getUser = async () => {
        const adapter = mockApiAdapter;
        const wallet = '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5';

        //const adapter = apiAdapter;
        //const wallet = appContext.connectionContext.connectedAddress;
        const user = await adapter.getUser(wallet, () => {});

        const render = user ? 'Home' : 'Registration';
        if (user) {
            setUserNickname(user.UserElementResponse.nickname);
            setUserCreatedAt(user.UserElementResponse.createdAt);
            setUserInterest(user.UserElementResponse.interest);
            setUserWalletAddress(wallet);
        }

        setStackToRender(render);
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
        return <HomeNavigator />;
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
