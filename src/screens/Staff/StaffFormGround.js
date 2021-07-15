import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-elements";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Dimensions } from "react-native";
import { httpClient } from "../../core/HttpClient";
import { AsyncStorage } from "react-native";
import moment from "moment";
import { Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const StaffFormGround = ({ navigation, route }) => {
  const [lang, setLang] = useState("TH");
  const [ground, setGround] = useState([]);
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      getData();
    };
    run();
  }, []);

  const getData = async () => {
    try {
      let getLang = await AsyncStorage.getItem("language");
      setLang(getLang);
      setLoading(true)
      if (getLang == "EN") {
        var lang_id = "1";
      } else {
        var lang_id = "2";
      }

      httpClient
        .get(`Team/confirmBookingGround/${route.params.booking_id}`)
        .then((response) => {
          if (response.data) {
            setGround(response.data.booking);
            setItem(response.data.ground);
            setLoading(false);
          }
          else{
            setLoading(false)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
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
    <ScrollView style={{ backgroundColor: "#d9d9d9" }}>
      <View
        style={{
          flex: 1,
          borderWidth: 2,
          borderRadius: 12,
          marginTop: 20,
          borderColor: "white",
          backgroundColor: "white",
          marginHorizontal: 15,
          marginBottom: 20,
        }}
      >
        <View style={styles.container}>
          <Text
            style={{ alignSelf: "center", fontSize: 20, fontWeight: "bold" }}
          >
           {lang == "EN"
              ? "Booking Request"
              : "ใบคำขอ Booking"}
          </Text>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#4393de",
              marginTop: 18,
              alignSelf: "center",
            }}
          >
            {lang == "EN"
              ? "EXTERRAN (THAILAND) LTD."
              : "บริษัท เอ็กซ์เธอร์แอน ประเทศไทย จำกัด"}
          </Text>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 16,
              marginTop: 4,
              marginBottom: 15,
            }}
          >
            Booking Request
          </Text>

          <View>
            <Divider style={{ backgroundColor: "black", borderWidth: 2 }} />
          </View>
          {/* <View
          style={{
            flex: 1,
            borderWidth: 2,
            borderRadius: 12,
            marginTop: 20,
            borderColor: "#d9d9d9",
          }}
        > */}
          <View style={{ margin: 20, marginHorizontal: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Name:" : "ชื่อ:"}
              </Text>

              <Text style={styles.textSy1}>
                {lang == "EN" ? ground.firstname_en : ground.firstname}
              </Text>

              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Lastname:" : "นามสกุล:"}
              </Text>
              <Text style={styles.textSy1}>
                {lang == "EN" ? ground.lastname_en : ground.lastname}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Identification:" : "เลขบัตรประชาชน:"}
              </Text>
              <Text style={styles.textSy2}>
                {ground.identification ? ground.identification : "-"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Phone:" : "เบอร์:"}
              </Text>
              <Text style={styles.textSy2}>
                {ground.phone ? ground.phone : "-"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Resident:" : "ที่อยู่:"}
              </Text>
              <Text style={styles.textSy2}>
                {ground.address ? ground.address : "-"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Province:" : "จังหวัด:"}
              </Text>
              <Text style={styles.textSy2}>
                {" "}
                {lang == "EN"
                  ? ground.pv_name_en
                  : ground.pv_name_th
                  ? lang == "EN"
                    ? ground.pv_name_en
                    : ground.pv_name_th
                  : "-"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "District:" : "อำเภอ:"}
              </Text>
              <Text style={styles.textSy2}>
                {lang == "EN"
                  ? ground.dt_name_en
                  : ground.dt_name_th
                  ? lang == "EN"
                    ? ground.dt_name_en
                    : ground.dt_name_th
                  : "-"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Subdistrict:" : "ตำบล:"}
              </Text>
              <Text style={styles.textSy2}>
                {lang == "EN"
                  ? ground.sdt_name_en
                  : ground.sdt_name_th
                  ? lang == "EN"
                    ? ground.sdt_name_en
                    : ground.sdt_name_th
                  : "-"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Zip:" : "รหัสไปรษณีย์:"}
              </Text>
              <Text style={styles.textSy2}>
                {ground.zipcode ? ground.zipcode : "-"}
              </Text>
            </View>
          </View>

          {item.map((param) => {
            return (
              <ScrollView>
                <Divider style={{ backgroundColor: "black" }} />
                <View style={{ margin: 20, marginHorizontal: 8 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      // marginTop: 8,
                    }}
                  >
                    <Text style={styles.textSyH1}>
                      {lang == "EN" ? "Date:" : "วันออกเดินทาง:"}
                    </Text>
                    <Text style={styles.textSy2}>
                      {moment(param.ground_date).format("DD/MM/YYYY")}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      marginTop: 8,
                    }}
                  >
                    <Text style={styles.textSyH1}>
                      {lang == "EN" ? "Time:" : "เวลาเดินทาง:"}
                    </Text>
                    <Text style={styles.textSy2}>{param.ground_time}</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      marginTop: 8,
                    }}
                  >
                    <Text style={styles.textSyH1}>
                      {lang == "EN" ? "From:" : "ต้นทาง:"}
                    </Text>
                    <Text style={styles.textSy2}>
                      {param.ground_from ? param.ground_from : "-"}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      marginTop: 8,
                    }}
                  >
                    <Text style={styles.textSyH1}>
                      {lang == "EN" ? "To:" : "ปลายทาง:"}
                    </Text>
                    <Text style={styles.textSy2}>
                      {param.ground_to ? param.ground_to : "-"}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            );
          })}

          {/* <Divider style={{ backgroundColor: "blue" }} /> */}
          <View
            style={{
              // marginVertical: 15,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Divider style={{ paddingBottom: 1, flex: 1 }} />
            <Avatar.Icon
              icon="arrow-down"
              size={30}
              style={styles.arrowDownStyle}
            />
            <Divider style={{ paddingBottom: 1, flex: 1 }} />
          </View>

          <Text style={{ marginHorizontal: 10, marginTop: 15 }}>
            {lang == "EN" ? "Approved:" : "อนุมัติโดย:"}
          </Text>
          <Divider
            style={{
              backgroundColor: "#4393de",
              marginHorizontal: 36,
              marginTop: 50,
            }}
          />
          <View
            style={{
              marginHorizontal: 36,
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text>Particlapant's Supervisor</Text>
            <Text>ผู้บังคับบัญชาของผู้เข้าฝึกอบรม</Text>
          </View>

          <Text style={{ marginHorizontal: 10, marginTop: 25 }}>
            {lang == "EN" ? "Acknowledged By HR:" : "Acknowledged By HR:"}
          </Text>

          <Divider
            style={{
              backgroundColor: "#4393de",
              marginHorizontal: 36,
              marginTop: 50,
            }}
          />
          <View
            style={{
              marginHorizontal: 36,
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text>Human Resources Manager</Text>
            <Text>ผู้จัดการฝ่ายทรัพยากรบุคคล</Text>
          </View>

          {/* <Divider style={{ backgroundColor: "black", marginTop: 40 }} /> */}
          <Divider
            style={{
              backgroundColor: "black",
              marginTop: 40,
              marginBottom: 15,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginHorizontal: 20,
              marginTop: 5,
              // marginBottom: 20,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#3bb54a",
                width: WIDTH / 5,
                height: HEIGHT * 0.04,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "white" }}>
                {lang == "EN" ? "Approve" : "อนุมัติ"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "red",
                width: WIDTH / 5,
                height: HEIGHT * 0.04,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "white" }}>
                {lang == "EN" ? "Disapproved" : "ไม่อนุมัติ"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#6c757d",
                width: WIDTH / 5,
                height: HEIGHT * 0.04,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "white" }}>
                {lang == "EN" ? "Close" : "ปิด"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    marginVertical: 18,
  },
  marginText: {
    marginTop: 5,
  },
  textSyH1: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textSy1: {
    fontWeight: "normal",
    fontSize: 16,
    marginLeft: 2,
    marginRight: 5,
  },
  textSy2: {
    fontWeight: "normal",
    fontSize: 16,
    marginLeft: 12,
    marginRight: 5,
  },
});

export default StaffFormGround;
