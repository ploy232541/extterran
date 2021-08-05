import * as React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import ButtonCard from "../../shared/ButtonCard";

function ProfileInfor() {
  const formatDataList = (dataList, numberColumns) => {
    const totalRows = Math.floor(dataList.length / numberColumns);
    let totalLastRow = dataList.length - totalRows * numberColumns;

    while (totalLastRow !== 0 && totalLastRow !== numberColumns) {
      dataList.push({ id: "blank", empty: true });
      totalLastRow++;
    }
    return dataList;
  };

  const ProfileHeader = [
    {
      id: 1,
      title: "Information",
      imgSource: "https://picsum.photos/700",
      to: "MainProfileScreen",
    },
    {
      id: 2,
      title: "Report",
      imgSource: "https://picsum.photos/700",
      to: "ReportScreen",
    },
  ];

  const profile_renderItem = ({ item }) => {
    if (item.empty) {
      return (
        <View
          style={{ flex: 1, margin: 15, backgroundColor: "transparent" }}
        ></View>
      );
    }
    return (
      <View style={{ flex: 1, margin: 15 }}>
        <ButtonCard title={item.title} to={item.to} src={item.imgSource} />
      </View>
    );
  };

  const profileNumColumn = 2;

  return (
    <View>
      <FlatList
        data={formatDataList(ProfileHeader, profileNumColumn)}
        renderItem={profile_renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={profileNumColumn}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

export default ProfileInfor;
