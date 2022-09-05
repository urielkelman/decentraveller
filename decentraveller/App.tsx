import React from "react";
import { MoralisProvider } from "react-moralis";
import { MORALIS_SERVER_URL, MORALIS_APP_ID } from "react-native-dotenv";
import AppContextProvider from "./context/AppContext";
import DecentravellerInitialScreen from "./screens/UserInitialScreen";

const App = () => {
  console.log("server", MORALIS_SERVER_URL);
  console.log("app i", MORALIS_APP_ID);
  return (
    <MoralisProvider serverUrl={MORALIS_SERVER_URL} appId={MORALIS_APP_ID}>
      <AppContextProvider>
        <DecentravellerInitialScreen />
      </AppContextProvider>
    </MoralisProvider>
  );
};

export default App;
