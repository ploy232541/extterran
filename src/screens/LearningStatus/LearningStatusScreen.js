import * as React from "react";
import  { useContext, useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  AsyncStorage
} from "react-native";

import ButtonCard from "../../shared/ButtonCard";
import { useNavigation } from "@react-navigation/native";
import { Button, Card } from "react-native-paper";
import Icons from "react-native-vector-icons/FontAwesome5";

const HEIGHT = Dimensions.get("window").height;

function LearningStatusScreen() {

  const [lang,setLang] = useState(null);
  useEffect(() => {
    const run = async () => {
      try {
        setLang(await AsyncStorage.getItem("language"));
      } catch (e) {
        console.log(e);
      }
    };
    run();
  }, []);

  const navigation = useNavigation();

  const formatDataList = (dataList, numberColumns) => {
    const totalRows = Math.floor(dataList.length / numberColumns);
    let totalLastRow = dataList.length - totalRows * numberColumns;

    while (totalLastRow !== 0 && totalLastRow !== numberColumns) {
      dataList.push({ id: "blank", empty: true });
      totalLastRow++;
    }
    return dataList;
  };

  const TrainingHeader = [
    {
      id: 1,
      title: lang == "EN" ? "Internal Compulsory Courses" : "หลักสูตรบังคับภายใน",
      //imgSource: "http://smartxlearning.com/themes/template/img/book.png",
      icon: "chalkboard-teacher",
      to: "1",
    },
    {
      id: 2,
      title: lang == "EN" ? "External Compulsory Courses" : "หลักสูตรบังคับภายนอก",
      //imgSource: "http://smartxlearning.com/themes/template/img/book.png",
      icon: "warehouse",
      to: "3",
    },
    {
      id: 3,
      title: lang == "EN" ? "General Course" : "หลักสูตรทั่วไป",
      //imgSource: "http://smartxlearning.com/themes/template/img/book.png",
      icon: "book",
      to: "5",
    },
  ];

  const training_renderItem = ({ item }) => {
    if (item.empty) {
      return (
        <View
          style={{ flex: 1, margin: 5, backgroundColor: "transparent" }}
        ></View>
      );
    }
    return (
      <View style={styles.buttonCard}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("LearningStatusListScreen", { type: item.to })
          }
        >
          {/* <Card> */}
          {/* <Card.Cover style={styles.imageStyle} source={{ uri: item.imgSource }} /> */}
          <View
            style={{ borderColor: "#00bfff", borderWidth: 2, borderRadius: 20 }}
          >
            <View
              style={{
                backgroundColor: "#003263",
                borderColor: "white",
                borderWidth: 6,
                borderRadius: 20,
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
              <Text style = {{ color :'white',flex: 1, marginTop: 12 , marginBottom: 20, textAlign: 'center'}}>{item.title}</Text>
              {/* </Card.Actions> */}
            </View>
          </View>
          {/* </Card> */}
        </TouchableOpacity>
      </View>
    );
  };

  const trainingNumColumn = 2;

  return (
    <View style={styles.background}>
      <View style={{ marginTop: 15 }}>
        <FlatList
          data={formatDataList(TrainingHeader, trainingNumColumn)}
          renderItem={training_renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={trainingNumColumn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
    minHeight: "100%",
    flex: 1,
  },
  buttonStyle: {
    backgroundColor: "#0097fc",
    padding: 8,
    alignItems: "center",
    borderRadius: 4,
  },
  imageStyle: {
    height: HEIGHT / 6,
  },
  buttonCard: {
    marginVertical: 5,
    marginHorizontal: 5,
    marginTop: 12,
    marginEnd: 10,
    marginStart: 10,
    marginBottom: 12,
    flex: 1,
  },
});

export default LearningStatusScreen;
