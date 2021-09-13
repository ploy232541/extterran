import React, { useEffect, useState } from "react";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Button, Title, Card } from "react-native-paper";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Alert,
} from "react-native";
import ButtonCard from "../../shared/ButtonCard";
import { Dimensions } from "react-native";
import { httpClient } from "../../core/HttpClient";
import { useNavigation } from "@react-navigation/native";
import { FancyAlert } from "react-native-expo-fancy-alerts";
import { AntDesign } from "@expo/vector-icons";

const HEIGHT = Dimensions.get("window").height;
function CourseCategoryGeneral() {
  const navigation = useNavigation();
  const [lang, setLang] = useState("");
  const [myProgramData, setMyProgramData] = useState("");
  const [visible, setVisible] = useState(false);
  const [icon, setIcon] = useState("");
  const [backgroundColorIcon, setBackgroundColorIcon] = useState("");
  const [content, setContent] = useState("");
  useEffect(() => {
    const run = async () => {
      try {
        let getLang = await AsyncStorage.getItem("language");
        let user_id = await AsyncStorage.getItem("userId");
        setLang(getLang);
        if (getLang === "EN") {
          var lang_id = "1";
        } else {
          var lang_id = "2";
        }

        const type = 5; //หลักสูตรทั่วไป

        httpClient
          .get(
            `/CourseOnline/getCategoryCourseGeneral/${user_id}/${lang_id}/${type}`
          )
          .then((response) => {
            let res = response.data;
            if (res != null) {
              setMyProgramData(res);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (e) {
        console.log(e);
      }
    };
    run();
  }, []);

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
            backgroundColor: "transparent",
          }}
        ></View>
      );
    }
    return (
      <View style={{ flex: 1, margin: 5 }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CousreScreenDetailGeneral", {
              cate_id: item.cate_id,
              title: item.cate_title,
              type: item.type,
            })
          }
        >
          {/* <Card> */}
            <View style={{ borderColor: "#00bfff" , borderWidth: 2, borderRadius: 20, }}>
            <View  style={{backgroundColor: '#003263',borderColor: 'white',borderWidth: 6,borderRadius: 20,}}>
              <Card.Cover
                style={styles.imageStyle}
                source={{
                  uri:
                    item.cate_image != null
                      ? item.cate_image
                      : "http://smartxlearning.com/themes/template/img/book.png",
                }}
              />
              {/* <Card.Actions style={{ alignSelf: "center" }}> */}
                {/* <Button>{item.cate_title}</Button> */}
                <Text style = {{ color :'white',flex: 1, marginTop: 12 , marginBottom: 20, marginLeft: 10, marginRight: 10,textAlign: 'center'}}>{item.cate_title}</Text>
              {/* </Card.Actions> */}
            </View></View>
          {/* </Card> */}
        </TouchableOpacity>
      </View>
    );
  };

  const numberColumns = 2;

  return (
    // <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
    <ScrollView
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
    style={{ flex: 1, backgroundColor: "white" }}
  >
      <View style={{ marginTop: 15 }}>
        <FlatList
          data={formatDataList(myProgramData, numberColumns)}
          renderItem={renderButtonCard}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numberColumns}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonCard: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  imageStyle: {
    height: HEIGHT / 6,
    borderRadius: 12,
  },
});

export default CourseCategoryGeneral;
