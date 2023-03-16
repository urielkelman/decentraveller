import { useState, useEffect} from "react";
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import DecentravellerInitialScreen from './screens/UserInitialScreen';
import AppContextProvider from './context/AppContext';

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [appConfigLoaded, setAppConfigLoaded] = useState(false);

    useEffect(() => {
        const loadFont = async() => {
           await Font.loadAsync({
               Dosis: require("./assets/fonts/Dosis-VariableFont_wght.ttf"),
               Montserrat: require("./assets/fonts/Montserrat-VariableFont_wght.ttf")
           });
           setAppConfigLoaded(true);
        };
        loadFont();
    })

    useEffect(() => {
        const hideSplashScreen = async () => {
            await SplashScreen.hideAsync();
        }
        hideSplashScreen();

    }, [appConfigLoaded])

    if (!appConfigLoaded) {
        return null;
    }

    return (
        <AppContextProvider>
            <DecentravellerInitialScreen />
        </AppContextProvider>
    );
}
