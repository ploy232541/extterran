import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native-elements";
import Icons from "react-native-vector-icons/FontAwesome5";

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const BookingCard = ({ funcType, to, src }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate(to)}>
      <View>
        <View style={{ alignSelf: "center" }}>
          <Image source={{ uri: src }} style={styles.imageStyle} />
        </View>
        <View style={styles.textStyle}>
          <Text>{funcType}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    height: HEIGHT / 6,
    width: WIDTH / 2.1,
    margin: 4
  },
  textStyle: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#F5A700",
    borderRadius: 20,
  },
});

export default BookingCard;

