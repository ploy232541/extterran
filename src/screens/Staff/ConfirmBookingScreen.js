import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import PeopleIcon from "react-native-vector-icons/Ionicons";
import { DataTable } from "react-native-paper";
import ArrowDownIcon from "react-native-vector-icons/AntDesign";
import { Dimensions } from "react-native";
import { Accordion, Button } from "native-base";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/FontAwesome";
import { httpClient } from "../../core/HttpClient";
import ModalFeedBack from "./ModalFeedBack";
import { useNavigation } from "@react-navigation/native";

const HEIGHT = Dimensions.get("window").height;
const ConfirmBookingScreen = (props) => {
  const navigation = useNavigation();
  let title = props.route.params.title;
  const [lang, setLang] = useState("TH");
  const [dataArray, setDataArray] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      getData();
    };
    run();
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
        .get(`Team/BookingTeam/${user_id}`)
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

      httpClient
        .get(`Team/BookingTeam/${user_id}`)
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

  const showModalBooking = (booking_type, booking_id) => {
    if (booking_type == 1) {
      navigation.navigate({
        name: "StaffFormFlight",
        params: { booking_id: booking_id },
      });
    } else if (booking_type == 2) {
      navigation.navigate({name: "StaffFormAccom",
      params: { booking_id: booking_id },});
    } else if (booking_type == 3) {
      navigation.navigate({name: "StaffFormGround",
      params: { booking_id: booking_id },});
    }
  };

  const _renderHeader = (item, expanded) => {
    let lang = AsyncStorage.getItem("language");
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          alignItems: "center",
          backgroundColor: "#f2f2f2",
          borderWidth: 1,
          borderColor: "#e6e6e6",
        }}
      >
        <Icon2 style={{ color: "#cccccc" }} size={20} name="user" />
        <Text style={{ flex: 1, marginLeft: 5, color: "#000" }}>
          {lang == "EN"
            ? item.firstname + " " + item.lastname
            : item.firstname_en + " " + item.lastname_en}
        </Text>
        <View style={{ justifyContent: "flex-end", marginRight: 10 }}>
          <Button
            onPress={() => {
              showModalBooking(item.booking_type, item.booking_id);
            }}
            style={{ height: 30, backgroundColor: "#3399ff" }}
          >
            <Text style={{ marginLeft: 5, marginRight: 5, color: "#fff" }}>
              รายละเอียด
            </Text>
          </Button>
        </View>

        <View style={{ justifyContent: "flex-end" }}>
          {expanded ? (
            <Icon style={{ fontSize: 16, color: "#010c65" }} name="up" />
          ) : (
            <Icon style={{ fontSize: 16, color: "#010c65" }} name="down" />
          )}
        </View>
      </View>
    );
  };

  const _renderContent = (item) => {
    return (
      <View style={{ alignSelf: "center", padding: 10 }}>
        {item.booking_type == 1 ? (
          <View>
            <Text>
              <Icon style={{ fontSize: 16, color: "#010c65" }} name="up" />
              การเดินทาง
            </Text>
          </View>
        ) : item.booking_type == 2 ? (
          <View>
            <Text>
              <Icon style={{ fontSize: 16, color: "#010c65" }} name="up" />
              ที่พัก
            </Text>
          </View>
        ) : item.booking_type == 3 ? (
          <View>
            <Text>
              <Icon style={{ fontSize: 16, color: "#010c65" }} name="down" />
              รถยนต์
            </Text>
          </View>
        ) : (
          ""
        )}
      </View>
    );
  };

  const _closeModal = () => {
    setModalVisible(false);
    getData();
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
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      {userId ? (
        <ModalFeedBack
          userId={userId}
          chkVisible={modalVisible}
          closeModal={_closeModal}
        />
      ) : null}

      <View style={styles.container}>
        <Text style={styles.textHeader}>{title}</Text>

        <View style={{ flexDirection: "row", marginVertical: 20 }}>
          <PeopleIcon name="md-people" size={20} style={{ marginRight: 10 }} />
          <Text style={styles.textNumber}>
            จำนวน <Text style={{ color: "#398DDD" }}>{dataArray.length}</Text>{" "}
            คน
          </Text>
        </View>

        <Accordion
          dataArray={dataArray}
          animation={true}
          expanded={true}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    marginVertical: 18,
  },
  textHeader: {
    color: "#398DDD",
    alignSelf: "center",
    fontSize: 18,
  },
  textNumber: {
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default ConfirmBookingScreen;
