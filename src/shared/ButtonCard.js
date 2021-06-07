import React from "react";
import { StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Card } from "react-native-paper";
import Icons from "react-native-vector-icons/FontAwesome5";

const HEIGHT = Dimensions.get("window").height;

const ButtonCard = ({ title, to, src, icon }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate(to)}>
      <Card>
        {/* <Card.Cover style={styels.imageStyle} source={{ uri: src }} /> */}
        <Icons name = {icon} size = {75} color = {"#999"} style = {{ textAlign: 'center', marginTop: 24 }}/>
        <Card.Actions style={{alignSelf: 'center'}}>
          <Button>{title}</Button>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );
};

const styels = StyleSheet.create({
  imageStyle: {
    height: HEIGHT / 6,
  },
});

export default ButtonCard;

