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
      <Card style={{ backgroundColor: "#f2f2f2" }}>
        {/* <Card.Cover source={{uri : imgSrc}} style={{height:HEIGHT*0.125, width:'100%'}} /> */}
        <Icons
          name={icon}
          size={75}
          color={"#999"}
          style={{ textAlign: "center", marginTop: 24, marginBottom: 20 }}
        />
        <Card.Content
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Text
            style={{ fontWeight: "bold", color: "black", fontSize: 14 }}
            numberOfLines={1}
          >
            {title}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default StaffCard;

