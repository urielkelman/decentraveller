import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import WrongChainModal from './login/WrongChainModal';
import LoginNavigator from './login/LoginNavigator';
import RegistrationNavigator from './users/registration/RegistrationNavigator';
import { apiAdapter } from '../api/apiAdapter';
import { mockApiAdapter } from '../api/mockApiAdapter';
import HomeNavigator from './home/HomeNavigator';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';

const adapter = apiAdapter;

import * as Linking from 'expo-linking';
import LoadingComponent from '../commons/components/DecentravellerLoading';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR } from '../commons/global';
import { View } from 'react-native';

const prefix = Linking.createURL('/');
const DecentravellerInitialScreen = () => {
    const { isConnected, address } = useWalletConnectModal();
    const [stackToRender, setStackToRender] = React.useState<'Login' | 'Home' | 'Registration'>('Login');
    const [loadingUserProfile, setLoadingUserProfile] = React.useState<boolean>(false);
    const appContext = useAppContext();
    const setUserProfileImage = appContext.userProfileImage.setValue;
    const setUserNickname = appContext.userNickname.setValue;
    const setUserCreatedAt = appContext.userCreatedAt.setValue;
    const setUserInterest = appContext.userInterest.setValue;

    const getUser = async () => {
        setLoadingUserProfile(true);
        try {
            const user = await adapter.getUser(address, () => {
                setLoadingUserProfile(false);
                setStackToRender('Registration');
            });

            if (!user) {
                setLoadingUserProfile(false);
                setStackToRender('Registration');
                return;
            }

        const userProfileImage = await mockApiAdapter.getUserProfileImage('uri', () => {
            console.log('There was a problem fetching the image');
        });

        console.log(userProfileImage);

        setUserNickname(user.nickname);
        setUserCreatedAt(user.createdAt);
        setUserInterest(user.interest);
        setUserProfileImage(userProfileImage);
        setStackToRender('Home');
        } finally {
            setLoadingUserProfile(false);
        }
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
        if (loadingUserProfile) {
            return (
                <View
                    style={{
                        flex: 1,
                        backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <LoadingComponent />
                </View>
            );
        }
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
        <NavigationContainer
            linking={{
                prefixes: [prefix],
                config: {
                    screens: {
                        LeftSideBar: {
                            // @ts-ignore
                            screens: {
                                Decentraveller: {
                                    screens: {
                                        Home: 'home',
                                        ExplorePlaces: 'explore',
                                        Community: 'community',
                                    },
                                },
                            },
                        },
                        PlaceDetailScreen: {
                            path: 'place/:id/:name/:address/:score/:reviewCount',
                            parse: {
                                id: (id) => `${id}`,
                                name: (name) => `${name}`,
                                address: (address) => `${address}`,
                                score: (score) => Number(score),
                                reviewCount: (reviewCount) => Number(reviewCount),
                            },
                        },
                    },
                },
            }}
        >
            <WrongChainModal />
            {navigatorToRender()}
        </NavigationContainer>
    );
};

export default DecentravellerInitialScreen;
