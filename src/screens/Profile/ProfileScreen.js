import * as React from "react";
import  { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList,AsyncStorage } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ButtonCard_Profile from "../../shared/ButtonCard_Profile";




function ProfileScreen() {

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

  
  const formatDataList = (dataList, numberColumns) => {
    const totalRows = Math.floor(dataList.length / numberColumns);
    let totalLastRow = dataList.length - totalRows * numberColumns;

    while (totalLastRow !== 0 && totalLastRow !== numberColumns) {
      dataList.push({ id: "blank", empty: true });
      totalLastRow++;
    }
    return dataList;
  };

  const ProfileHeader  = [
    
    {
      id: 1,
      title: lang == "EN" ? "Unifrom" : "ชุด", 
      src: require("../../asset/dashboardIcon/uniform.png"),
      to: "OutfitScreen"
    },
    {
      id: 2,
      title: lang == "EN" ? "Safety Shoe" : "รองเท้าเซฟตี้",
      src: require("../../asset/dashboardIcon/safetyb.png"),
      to: "SafetyBootsScreen"
    },
    {
      id: 3,
      title: lang == "EN" ?  "Medical Checkups" : "ตรวจสุขภาพ",
      src: require("../../asset/dashboardIcon/medical.png"),
      to: "MedicalCheckupsScreen"
    },
    {
      id: 4,
      title: lang == "EN" ? "Personal Information" : "ข้อมูลส่วนตัว",
      src: require("../../asset/dashboardIcon/infomation.png"),
      to: "ProfileInfor"
    }
  ];

  const profile_renderItem = ({ item }) => {
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
      <View style={{ flex: 1, marginTop: 24, marginHorizontal: 10 }}>
        <ButtonCard_Profile title={item.title} to={item.to} src={item.src} />
      </View>
    );
  };

  const profileNumColumn = 2;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      {/* <ScrollView style={{backgroundColor: "white"}}> */}
      <View>
        <FlatList
          data={formatDataList(ProfileHeader, profileNumColumn)}
          renderItem={profile_renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={profileNumColumn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});

export default ProfileScreen;
