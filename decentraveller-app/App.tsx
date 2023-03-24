import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import DecentravellerInitialScreen from './screens/UserInitialScreen';
import AppContextProvider from './context/AppContext';
import { Dosis_600SemiBold } from '@expo-google-fonts/dosis';
import {
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
} from '@expo-google-fonts/montserrat';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded] = useFonts({
        Montserrat_700Bold,
        Dosis_600SemiBold,
        Montserrat_800ExtraBold,
    });

    useEffect(() => {
        const hideSplashScreen = async () => {
            await SplashScreen.hideAsync();
        };
        hideSplashScreen();
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <AppContextProvider>
            <DecentravellerInitialScreen />
        </AppContextProvider>
    );
}
