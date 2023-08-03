import 'react-native-gesture-handler';
import '@walletconnect/react-native-compat';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import DecentravellerInitialScreen from './screens/UserInitialScreen';
import AppContextProvider from './context/AppContext';
import { Dosis_600SemiBold } from '@expo-google-fonts/dosis';
import {
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
} from '@expo-google-fonts/montserrat';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function App() {
    const [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Dosis_600SemiBold,
        Montserrat_800ExtraBold,
        Montserrat_400Regular,
        Montserrat_500Medium,
    });

    useEffect(() => {
        const hideSplashScreen = async () => {
            await SplashScreen.hideAsync();
        };
        hideSplashScreen();
    }, [fontsLoaded]);

    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log('notification received was touch')
            console.log(response.notification);
            let path = response.notification.request.content.data.path as string // Extra data sent along with the notification
            console.log('arrived path', path)
            Linking.openURL(Linking.createURL(path));
        });

        return () => {
            // Be sure to unsubscribe when the component unmounts
            subscription.remove();
        };
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <AppContextProvider>
            <DecentravellerInitialScreen />
        </AppContextProvider>
    );
}
