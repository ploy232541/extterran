import * as React from "react";
import { useState, useEffect } from "react";
import { AsyncStorage } from "react-native";
import { View, StyleSheet, FlatList } from "react-native";
import { httpClient } from "../../core/HttpClient";
import ButtonCard from "../../shared/ButtonCard";

function TrainingScreen() {
  const [team, setTeam] = useState(null);
  const formatDataList = (dataList, numberColumns) => {
    const totalRows = Math.floor(dataList.length / numberColumns);
    let totalLastRow = dataList.length - totalRows * numberColumns;

    while (totalLastRow !== 0 && totalLastRow !== numberColumns) {
      dataList.push({ id: "blank", empty: true });
      totalLastRow++;
    }
    return dataList;
  };

  useEffect(() => {
    const run = async () => {
      try {
        const user_id = await AsyncStorage.getItem("userId");

        httpClient
          .get(`/Team/getMenuTeam/${user_id}`)
          .then(async (response) => {
            const res = response.data;
            setTeam(res);
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

  const TrainingHeader = [];
  TrainingHeader.push({
    id: 1,
    title: "ใบคำขอฝึกอบรม",
    icon: "edit",
    to: "TrainingFormScreen",
  });
  TrainingHeader.push({
    id: 2,
    title: "สถานะการอนุมัติ",
    icon: "user",
    to: "TrainingStatusScreen",
  });
  // เปิดไว้สำหรับเทส
  if (team == true) {
    TrainingHeader.push({
      id: 3,
      title: "สถานะการอนุมัติทีมงาน",
      icon: "users",

      to: "TrainingStaffStatusScreen",
    });
  }

  var d = new Date();
   // เปิดไว้สำหรับเทส
  if (d.getMonth() == 7) {
    TrainingHeader.push({
      id: 4,
      title: "Training Need",
      icon: "newspaper",
      to: "TrainingNeedScreen",
    });
  }
  TrainingHeader.push({
    id: 5,
    title: "Booking",
    icon: "address-book",
    to: "BookingScreen",
  });

  const training_renderItem = ({ item }) => {
    if (item.empty) {
      return (
        <View
          style={{ flex: 1, margin: 12, backgroundColor: "transparent" }}
        ></View>
      );
    }
    return (
      <View style={{ flex: 1, marginTop: 22, marginLeft: 10, marginRight: 10 }}>
        <ButtonCard
          title={item.title}
          to={item.to}
          src={item.imgSource}
          icon={item.icon}
        />
      </View>
    );
  };

  const trainingNumColumn = 2;

  return (
    <View style={{ backgroundColor: "white", height: "200%" }}>
      <FlatList
        data={formatDataList(TrainingHeader, trainingNumColumn)}
        renderItem={training_renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={trainingNumColumn}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

export default TrainingScreen;
