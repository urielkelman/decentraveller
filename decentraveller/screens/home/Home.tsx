import React from "react";
import {Button, Text, View} from "react-native";

const Home = () => {
  const logIn = () => {
    console.log("trying to login")
  }

  return (
    <View>
        <Button title={"asd"} onPress={logIn} />
        <Text>I´m the home component. Here you can search different places.</Text>
    </View>
  );
};

export default Home;
