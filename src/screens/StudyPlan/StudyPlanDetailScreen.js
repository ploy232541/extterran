/* Done for now */
import React, { useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { DataTable } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

import AsyncStorage1 from "@react-native-async-storage/async-storage";

const HEIGHT = Dimensions.get("window").height;

function StudyPlanDetailScreen(props) {
  const monthsENList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthsTHList = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฏาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const [lang, setLang] = useState("TH");
  let item = props.route.params.item;
  var data0 = item.month_start,
    data1 = item.month_end,
    monthStart = "",
    monthEnd = "";

  const getMonth = (data, isStart) => {
    // data (return 1 - 12)
    lang == "EN"
      ? isStart
        ? (monthStart = monthsENList[data - 1])
        : (monthEnd = monthsENList[data - 1])
      : isStart
      ? (monthStart = monthsTHList[data - 1])
      : (monthEnd = monthsTHList[data - 1]);
  };

  getMonth(data0, true);
  getMonth(data1, false);

  useEffect(() => {
    const run = async () => {
      setLang(await AsyncStorage1.getItem("language"));
    };

    run();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={{ margin: 18 }}>
        <DataTable style={{ borderBottomWidth: 1, borderColor: "#dddddd" }}>
          <DataTable.Row
            style={{
              backgroundColor: "#f5f5f5",
              borderColor: "#dddddd",
              borderWidth: 1,
            }}
          >
            <DataTable.Cell>{item.course_title}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row
            style={{
              alignItems: "center",
              borderColor: "#dddddd",
              borderWidth: 1,
            }}
          >
            <View
              style={{
                alignSelf: "center",
                backgroundColor: "#f5f5f5",
                borderColor: "#dddddd",
                borderWidth: 1,
                height: HEIGHT * 0.08,
                margin: 20,
                width: "100%",
              }}
            >
              <View style={{ marginHorizontal: 18, marginVertical: 10 }}>
                <Text style={{ textAlign: "center" }}>
                  {monthStart} - {monthEnd}
                </Text>

                <View
                  style={{
                    alignItems: "center",
                    backgroundColor: item.col_status,
                    borderRadius: 12,
                    height: HEIGHT * 0.03,
                    justifyContent: "center",
                    marginTop: 5,
                    width: "100%",
                  }}
                >
                  <Text style={{ color: "white" }}>{item.txt_status}</Text>
                </View>
              </View>
            </View>
          </DataTable.Row>
        </DataTable>
      </View>
    </ScrollView>
  );
}

{
  /*const styles = StyleSheet.create({
  arrowStyle: {
    alignSelf: "center",
    flex: 1,
    position: "absolute",
    right: 0,
  },
});*/
}

export default StudyPlanDetailScreen;
