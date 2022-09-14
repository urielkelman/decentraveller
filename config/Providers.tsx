import { MoralisProvider } from "react-moralis";
import Moralis from 'moralis/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
// @ts-ignore
import { MORALIS_APP_ID, MORALIS_SERVER_URL } from "react-native-dotenv";

Moralis.setAsyncStorage(AsyncStorage)

const Providers: React.FC = ({ children}) => {
    return (
        <MoralisProvider serverUrl={MORALIS_SERVER_URL} appId={MORALIS_APP_ID} environment='native'>
            {children}
        </MoralisProvider>
        )
}

export default Providers;
