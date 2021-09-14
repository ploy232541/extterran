import * as React from "react";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Button, Title, Card } from "react-native-paper";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ButtonCard from "../shared/ButtonCard";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "native-base";
import Icons from "react-native-vector-icons/FontAwesome5";

const HEIGHT = Dimensions.get("window").height;
function MyProgramsScreen() {
  const navigation = useNavigation();
  const myProgramData = [
    {
      id: 1,
      title: "หลักสูตรบังคับภายใน",
      //imgSrc: 'http://smartxlearning.com/themes/template/img/book.png',
      icon: "chalkboard-teacher",
      to: "1"
    },
    {
      id: 2,
      title: "หลักสูตรบังคับภายนอก",
      //imgSrc: 'http://smartxlearning.com/themes/template/img/book.png',
      icon: "warehouse",
      to: "3"
    },
    {
      id: 3,
      title: "หลักสูตรทั่วไป",
      //imgSrc: 'http://smartxlearning.com/themes/template/img/book.png',
      icon: "book",
      to: "5",
    },
  ];

  const formatDataList = (dataList, numberColumns) => {
    const totalRows = Math.floor(dataList.length / numberColumns);
    let totalLastRow = dataList.length - totalRows * numberColumns;

    while (totalLastRow !== 0 && totalLastRow !== numberColumns) {
      dataList.push({ id: "blank", empty: true });
      totalLastRow++;
    }
    return dataList;
  };

  const renderButtonCard = ({ item }) => {
    if (item.empty) {
      return (
        <View
          style={{
            flex: 1,
            marginVertical: 5,
            marginHorizontal: 5,
            backgroundColor: "transparent"
          }}
        ></View>
      );
    }
    return (
      <View style={styles.buttonCard}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CourseCategory", { type: item.to })
          }
        >
          {/* <Card> */}
          {/* <Card.Cover style={styles.imageStyle} source={{ uri: item.imgSrc }} /> */}
          <View
            style={{ borderColor: "#00bfff", borderWidth: 2, borderRadius: 20 }}
          >
            <View
              style={{
                backgroundColor: "#003263",
                borderColor: "white",
                borderWidth: 6,
                borderRadius: 20
              }}
            >
              <Icons
                name={item.icon}
                size={75}
                color={"white"}
                style={{ textAlign: "center", marginTop: 24 }}
              />
              {/* <Card.Actions style={{alignSelf: 'center'}}> */}
              {/* <Button>{item.title}</Button> */}
              <Text
                style={{
                  color: "white",
                  flex: 1,
                  marginTop: 12,
                  marginBottom: 20,
                  textAlign: "center"
                }}
              >
                {item.title}
              </Text>
              {/* </Card.Actions> */}
            </View>
          </View>
          {/* </Card> */}
        </TouchableOpacity>
      </View>
    );
  };

  const numberColumns = 2;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      {/* <ScrollView style={{ flex: 1, backgroundColor: "white" }} > */}
      {/* <TouchableOpacity style={{width:'30%', alignSelf:'center', alignItems:'center', height:HEIGHT*0.03, justifyContent:'center', backgroundColor:'#3b5998', marginVertical:20}}>
            <Text style={{color:'white'}}>หมวดหมู่หลักสูตร</Text>
          </TouchableOpacity> */}
      <View style={{ marginTop: 15 }}>
        <FlatList
          data={formatDataList(myProgramData, numberColumns)}
          renderItem={renderButtonCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numberColumns}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonCard: {
    marginVertical: 5,
    marginHorizontal: 5,
    marginTop: 12,
    marginEnd: 10,
    marginStart: 10,
    marginBottom: 12,
    flex: 1
  },
  imageStyle: {
    height: HEIGHT / 6
  }
});

export default MyProgramsScreen;
