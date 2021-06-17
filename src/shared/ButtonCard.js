import React from "react";
import { StyleSheet, TouchableOpacity, Dimensions,View,Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Card } from "react-native-paper";
import Icons from "react-native-vector-icons/FontAwesome5";


const HEIGHT = Dimensions.get("window").height;

const ButtonCard = ({ title, to, src, icon }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate(to)}>
      {/* <Card  > */}
       
        {/* <Card.Cover style={styels.imageStyle} source={{ uri: src }} /> */}
        <View  style={{borderColor: 	"#00bfff",borderWidth: 2,borderRadius: 20, marginTop:2}}>
        <View  style={{backgroundColor: '#003263',borderColor: 'white',borderWidth: 6,borderRadius: 20,}}>
        <Icons name = {icon} size = {75} color = {'white'} style = {{ 
          textAlign: 'center',
         marginTop: 24,
        }}/>
       
        {/* <Card.Actions style={{alignSelf: 'center'}}> */}
          <Text style = {{ color :'white',flex: 1, marginTop: 12 , marginBottom: 20, marginLeft: 10, marginRight: 10,textAlign: 'center'}}>{title}</Text>
          </View>
          </View>
        {/* </Card.Actions> */}
      {/* </Card> */}
    </TouchableOpacity>
  );
};

const styels = StyleSheet.create({
  imageStyle: {
    height: HEIGHT / 6,
  },
});

export default ButtonCard;

