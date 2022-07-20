import React, { useEffect } from "react";
import {Button, Text, View} from "react-native";
import { useMoralis } from "react-moralis";


const Login: React.FC = () => {
    const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();


    return (
        <View />
    )
}

export default Login;