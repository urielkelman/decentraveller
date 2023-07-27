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
import { useWalletConnectModal } from '@walletconnect/modal-react-native';

const adapter = mockApiAdapter;

const DecentravellerInitialScreen = () => {
    const { isConnected, address } = useWalletConnectModal();
    const [stackToRender, setStackToRender] = React.useState<'Login' | 'Home' | 'Registration'>('Login');
    const appContext = useAppContext();
    const setUserProfileImage = appContext.userProfileImage.setValue;
    const setUserNickname = appContext.userNickname.setValue;
    const setUserCreatedAt = appContext.userCreatedAt.setValue;
    const setUserInterest = appContext.userInterest.setValue;

    const getUser = async () => {
        const user = await adapter.getUser(address, () => {
            setStackToRender('Registration');
        });

        if (!user) {
            setStackToRender('Registration');
            return;
        }

        const userProfileImage = await adapter.getUserProfileImage('uri', () => {
            console.log('There was a problem fetching the image');
        });

        console.log('imagen en base64:' + userProfileImage);

        setUserNickname(user.nickname);
        setUserCreatedAt(user.createdAt);
        setUserInterest(user.interest);
        setUserProfileImage(userProfileImage);
        setStackToRender('Home');
    };

    useEffect(() => {
        (async () => {
            if (!isConnected) {
                setStackToRender('Login');
            } else {
                await getUser();
            }
        })();
    }, [isConnected]);

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
