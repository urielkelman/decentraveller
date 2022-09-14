import React from "react";
import { Button, Text, View } from "react-native";

const Home = () => {
  return (
    <View>
      <Button title={"Login"} onPress={() => console.log("Pressed Login button")} />
      <Text>I´m the home component. Here you can search different places.</Text>
    </View>
  );
};

export default Home;
