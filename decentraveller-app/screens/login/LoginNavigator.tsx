import { createStackNavigator } from '@react-navigation/stack';
import ConnectWalletScreen from './ConnectWalletScreen';

type LoginStackParamList = {
    ConnectWalletScreen: undefined;
};

const LoginStackNavigator = createStackNavigator<LoginStackParamList>();

const LoginNavigator = () => {
    return (
        <LoginStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <LoginStackNavigator.Screen name="ConnectWalletScreen" component={ConnectWalletScreen} />
        </LoginStackNavigator.Navigator>
    );
};

export default LoginNavigator;
