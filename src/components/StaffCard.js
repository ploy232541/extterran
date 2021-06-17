import React from "react";
import { Dimensions } from "react-native";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Icons from "react-native-vector-icons/FontAwesome5";

const HEIGHT = Dimensions.get("window").height;

const StaffCard = ({ title, imgSrc, to, icon }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate(to, { title: title })}>

      {/* <Card style={{ backgroundColor: "#f2f2f2" }}> */}
      {/* <Card.Cover source={{uri : imgSrc}} style={{height:HEIGHT*0.125, width:'100%'}} /> */}
       <View  style={{borderColor: 	"#00bfff",borderWidth: 2,borderRadius: 20, marginTop: 2}}>
        <View  style={{backgroundColor: '#003263',borderColor: 'white',borderWidth: 6,borderRadius: 20,}}>
        <Icons name = {icon} size = {75} color = {'white'} style = {{ 
          textAlign: 'center',
         marginTop: 24,
        }}/>
          {/* <Card.Content
          style={{ alignItems: "center", justifyContent: "center" }}
        > */}
          {/* <Text
            style={{ fontWeight: "bold", color: "black", fontSize: 14 }}
            numberOfLines={1}
          >
            {title}
          </Text> */}
           <Text style = {{ color :'white',flex: 1, marginTop: 12 , marginBottom: 20, marginLeft: 10, marginRight: 10,textAlign: 'center'}}>{title}</Text>
          </View>
          </View>
      {/* </Card.Content> */}
      {/* </Card> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    height: HEIGHT / 6,
  },
});


export default StaffCard;
