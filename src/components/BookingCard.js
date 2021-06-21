import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import Icons from "react-native-vector-icons/FontAwesome5";
import { Card } from "native-base";

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const BookingCard = ({ funcType, to, src }) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        width: WIDTH/2,
        alignSelf: "center",
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom:2,
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate(to)}>
        {/* <View> */}
        {/* <View style={{ alignSelf: "center",paddingLeft:10,}}> */}
        {/* <View style={{ marginHorizontal: 8,}}> */}
        <View
          style={{
            borderColor: "#00bfff",
            borderWidth: 2,
            borderRadius: 20,
            marginTop: 2,
          }}
        >
          <View
            style={{
              backgroundColor: "#003263",
              borderColor: "white",
              borderWidth: 6,
              borderRadius: 20,
            }}
          >
            <Image source={src} style={styles.imageStyle} />
            {/* <View style={{paddingBottom:10,}}> */}
            {/* <View style={styles.textStyle}> */}
            <Text style={styles.textStyle}>{funcType}</Text>
            {/* </View> */}
            {/* </View> */}
          </View>
        </View>
        {/* </View> */}
        {/* </View> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    height: HEIGHT / 6,
    width: WIDTH / 2.6,
    margin: 4,
    alignSelf: "center"
  },
  // textStyle: {
  //   alignSelf: "center",
  //   // paddingVertical: 10,
  //   // paddingHorizontal: 10,
  //   // marginVertical: 8,
  //   padding:5,
  //   width:"80%",
  //   backgroundColor: "white",
  //   borderRadius: 10,
  // },
  textStyle: {
    color: "white",
    // flex: 1,
    marginTop: 12,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    textAlign: "center",
    fontWeight: "bold"
  },
});

export default BookingCard;
