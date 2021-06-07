import * as React from "react";
import {
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import ButtonCard from "../../shared/ButtonCard";


function TrainingScreen() {
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
      title: "ใบคำขอฝึกอบรม",
      //imgSource: "https://picsum.photos/700",
      icon: "clipboard-check",
      to: "TrainingFormScreen",
    },
    {
      id: 2,
      title: "สถานะการอนุมัติ",
      //imgSource: "https://picsum.photos/700",
      icon: "check-double",
      to: "TrainingStatusScreen",
    },
    {
      id: 3,
      title: "สถานะการอนุมัติทีมงาน",
      //imgSource: "https://picsum.photos/700",
      icon: "users",
      to: "TrainingStaffStatusScreen",
    },
    {
      id: 4,
      title: "Training Need",
      //imgSource: "https://picsum.photos/700",
      icon: "search",
      to: "TrainingNeedScreen",
    },
    {
      id: 5,
      title: "Booking",
      //imgSource: "https://picsum.photos/700",
      icon: "bookmark",
      to: "BookingScreen",
    },
  ];

  const training_renderItem = ({ item }) => {
    if (item.empty) {
      return (
        <View
          style={{ flex: 1, margin: 12, backgroundColor: "transparent" }}
        ></View>
      );
    }
    return (
      <View style={{ flex: 1, marginTop: 12 , marginBottom: 12, marginLeft: 10, marginRight: 10,}}>
        <ButtonCard title={item.title} to={item.to} src={item.imgSource} icon={item.icon} />
      </View>
    );
  };

  const trainingNumColumn = 2;

  return (
    <View>
      <FlatList
        data={formatDataList(TrainingHeader, trainingNumColumn)}
        renderItem={training_renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={trainingNumColumn}
      />
    </View>
  );
  
}

const styles = StyleSheet.create({

});

export default TrainingScreen;

