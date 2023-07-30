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
import {Alert} from "react-native";

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
        const subscription = Notifications.addNotificationReceivedListener((notification) => {
            console.log('notification received')
            console.log(notification);
            let title = notification.request.content.title; // Notification title
            let body = notification.request.content.body; // Notification body or message
            let data = notification.request.content.data; // Extra data sent along with the notification

            // Now, you can handle the notification in any way you want.
            // For example, you could show an alert with the notification message:
            /*Notifications.scheduleNotificationAsync({
                content: {
                    title: title,
                    body: body,
                },
                trigger: null,
            });*/
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
