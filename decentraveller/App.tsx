import React from "react";
import AppContextProvider from "./context/AppContext";
import DecentravellerInitialScreen from "./screens/UserInitialScreen";
import Providers from "./config/Providers";

const App = () => {
  return (
      <Providers>
          <AppContextProvider>
              <DecentravellerInitialScreen />
          </AppContextProvider>
      </Providers>

  );
};

export default App;
