/* Done for now */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import { DataTable } from "react-native-paper";
import ArrowDownIcon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { httpClient } from "../../core/HttpClient";
import Icon from "react-native-vector-icons/Entypo";


function StudyPlanScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("TH");
  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      let getLang = await AsyncStorage.getItem("language");
      let user_id = await AsyncStorage.getItem("userId");
      setLang(getLang);
      if (getLang == "EN") {
        var lang_id = "1";
      } else {
        var lang_id = "2";
      }

      httpClient
        .get(`/CourseOnline/getStudyPlay/${user_id}/${lang_id}`)
        .then((response) => {
          let res = response.data;
          if (res != null) {
            setDataArray(res);
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const _onPress = (item) => {
    if (item.link_course != null) {
      navigation.navigate("StudyPlanDetailScreen", { item: item });
    } else {
      Alert.alert(lang == "EN" ? "No status" : "ยังไม่มีสถานะ");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <DataTable style={{ borderBottomWidth: 1, borderColor: "#dddddd" }}>
        <DataTable.Row
          style={{
            borderWidth: 1,
            backgroundColor: "#f5f5f5",
            borderColor: "#dddddd",
          }}
        >
          <DataTable.Cell>
            {lang == "EN" ? "Course name" : "ชื่อหลักสูตร"}
          </DataTable.Cell>
        </DataTable.Row>

        {dataArray.map((item) => {
          return (
            <TouchableOpacity onPress={() => _onPress(item)}>
              <DataTable.Row style={styles.dataTableStyle}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingRight: 20,
                  }}
                >
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Icon style={{ flex: 0 }} name={"book"} size={20} />
                    <Text
                      style={{ flex: 1, fontWeight: "bold", color: "#002699" }}
                    >
                      {item.course_title}
                    </Text>
                  </View>
                  <Text style={{ flex: 1, color: "#595959" }}>
                    [{item.type_course}]
                  </Text>
                </View>

                <DataTable.Cell style={styles.arrowStyle}>
                  <ArrowDownIcon name="right" size={18} />
                </DataTable.Cell>
              </DataTable.Row>
            </TouchableOpacity>
          );
        })}
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    marginVertical: 18,
    backgroundColor: "white"
  },
  dataTableStyle: {
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  arrowStyle: {
    right: 0,
    position: "absolute",
    alignSelf: "center",
    flex: 1,
  },
});

export default StudyPlanScreen;
