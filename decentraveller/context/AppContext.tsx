import React from "react";

export interface SignInInformation {
  haveSignedIn: boolean;
  walletAddress?: string;
}

export type AppContextType = {
  signInInformation: SignInInformation;
  processSignInParameters: (isLoggedIn: boolean, walletAddress: string) => void;
};

const AppContext = React.createContext<AppContextType | null>(null);

const AppContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [signInInformation, setSignInInformation] =
    React.useState<SignInInformation>({
      haveSignedIn: false,
      walletAddress: undefined,
    });

  const processSignInParameters = (loggedIn: boolean, address: string) => {
    setSignInInformation({
      haveSignedIn: loggedIn,
      walletAddress: address,
    });
  };

  return (
    <AppContext.Provider value={{ signInInformation, processSignInParameters }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
