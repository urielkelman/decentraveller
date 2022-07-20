import React from "react";
import { MoralisProvider } from "react-moralis";
import { NavigationContainer } from "@react-navigation/native";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { sizesConfig } from "./config/sizesConfig";
import Home from "./screens/home/Home";
import Owned from "./screens/owned/Owned";

type DeviceDimensions = {
  width: number;
  height: number;
};

type RootStackScreens = {
  Home: undefined;
  Owned: undefined;
};

type bottomTabElementProps = {
  focused: boolean;
  color: string;
  size: number;
};

const deviceDimensions: DeviceDimensions = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

const Tab = createBottomTabNavigator<RootStackScreens>();

const getTabBarIcon = (
  route: Readonly<{ key: string; name: "Home" | "Owned"; path?: string }>,
  iconSize: number
) => {
  return ({ focused, color, size }: bottomTabElementProps): JSX.Element => {
    if (route.name === "Home") {
      return <AntDesign name="home" size={iconSize} color="black" />;
    } else if (route.name === "Owned") {
      return <AntDesign name="user" size={iconSize} color="black" />;
    }
    return <AntDesign name="home" size={iconSize} color="black" />;
  };
};

const getBottomTabNavigatorScreenOptions = (
  route: Readonly<{ key: string; name: "Home" | "Owned"; path?: string }>
): BottomTabNavigationOptions => {
  return {
    tabBarIcon: getTabBarIcon(
      route,
      deviceDimensions.width / sizesConfig.bottomTabIconSizeWidthInverseFraction
    ),
    tabBarActiveTintColor: "tomato",
    tabBarInactiveTintColor: "gray",
    tabBarStyle: {
      height:
        deviceDimensions.height / sizesConfig.bottomTabHeightInverseFraction,
    },
    tabBarLabelStyle: {
      fontSize:
        deviceDimensions.width /
        sizesConfig.bottomTabFontSizeWidthInverseFraction,
      fontFamily: "sans-serif-medium",
      fontWeight: "bold",
    },
  };
};

const App = () => {
  return (
    <MoralisProvider serverUrl="https://pnzdph5trjza.usemoralis.com:2053/server" appId="4PNXRLBF4yFp280oYVFPsRu8QSjTcSNaI9F8rkc5">
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          backBehavior="initialRoute"
          screenOptions={({ route }) =>
            getBottomTabNavigatorScreenOptions(route)
          }
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Owned" component={Owned} />
        </Tab.Navigator>
      </NavigationContainer>
    </MoralisProvider>
  );
};

export default App;
