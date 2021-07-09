import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-elements";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Dimensions } from "react-native";
import { httpClient } from "../../core/HttpClient";
import { AsyncStorage } from "react-native";
import moment from "moment";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const StaffFormAccom = ({ navigation, route }) => {
  const [lang, setLang] = useState("TH");
  const [accom, setAccom] = useState([]);

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
      if (getLang == "EN") {
        var lang_id = "1";
      } else {
        var lang_id = "2";
      }

      httpClient
        .get(`Team/confirmBookingAccom/${route.params.booking_id}`)
        .then((response) => {
          setAccom(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
      // console.log("asdfghjxcvbn");
      // console.log(flight);
      // console.log("asdfghjxcvbn");
    } catch (e) {
      console.log(e);
    }
  };

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
            ใบคำขอ Booking
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
            บริษัท เอ็กซ์เธอร์แอน ประเทศไทย จำกัด
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
            <Divider style={{ backgroundColor: "#d9d9d9" }} />
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
                {lang == "EN" ? "Name" : "ชื่อ"}
              </Text>

              <Text style={styles.textSy1}>
                {lang == "EN" ? accom.firstname_en : accom.firstname}
              </Text>

              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Lastname" : "นามสกุล"}
              </Text>
              <Text style={styles.textSy1}>
                {lang == "EN" ? accom.lastname_en : accom.lastname}
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
                {lang == "EN" ? "Identification" : "เลขบัตรประชาชน"}
              </Text>
              <Text style={styles.textSy2}>{accom.identification}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Phone" : "เบอร์โทร"}
              </Text>
              <Text style={styles.textSy2}>
                {accom.phone ? accom.phone : "-"}
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
                {lang == "EN" ? "BirthDay" : "วันเกิด"}
              </Text>
              <Text style={styles.textSy2}>
                {moment(accom.birthday).format("DD/MM/YYYY")}
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
                {lang == "EN" ? "Province" : "จังหวัด"}
              </Text>
              <Text style={styles.textSy2}>
                {" "}
                {lang == "EN" ? accom.pv_name_en : accom.pv_name_th}
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
                {lang == "EN" ? "District" : "อำเภอ"}
              </Text>
              <Text style={styles.textSy1}>
                {lang == "EN" ? accom.dt_name_en : accom.dt_name_th}
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
                {lang == "EN" ? "Subdistrict" : "ตำบล"}
              </Text>
              <Text style={styles.textSy2}>
                {lang == "EN" ? accom.sdt_name_en : accom.sdt_name_th}
              </Text>
            </View>

            {/* <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Zip" : "รหัสไปรษณีย์"}
              </Text>
              <Text style={styles.textSy1}>
                {lang == "EN" ? accom.dt_name_en : accom.dt_name_th}
              </Text>
            </View> */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Purpose" : "วัตถุประสงค์"}
              </Text>
              <Text style={styles.textSy2}>
                {" "}
                {accom.purpose
                  ? lang == "EN"
                    ? accom.purpose_hotel_en
                    : accom.purpose_hotel_th
                  : accom.purpose_etc}
              </Text>
            </View>
          </View>

          <Divider style={{ backgroundColor: "#d9d9d9" }} />

          <View style={{ margin: 20, marginHorizontal: 8 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                // marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Province" : "จังหวัด"}
              </Text>
              <Text style={styles.textSy2}>{accom.province}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Accommodation (Province, Hotel name)" : "ที่พัก (จังหวัดชื่อโรงแรม)"}
              </Text>
              <Text style={styles.textSy2}>{accom.accommodation}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Check in date(D/M/Y)" : "เช็คอิน"}
              </Text>
              <Text style={styles.textSy2}>{accom.checkin}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Check out date(D/M/Y)" : "เช็คเอาต์"}
              </Text>
              <Text style={styles.textSy2}>{accom.checkout}</Text>
            </View>
          </View>

          <Divider style={{ backgroundColor: "#d9d9d9" }} />

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

          <Text style={{ marginHorizontal: 10, marginTop: 20 }}>
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
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginHorizontal: 20,
          marginTop: 5,
          marginBottom: 20,
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
          <Text style={{ color: "white" }}>อนุมัติ</Text>
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
          <Text style={{ color: "white" }}>ไม่อนุมัติ</Text>
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
          <Text style={{ color: "white" }}>Close</Text>
        </TouchableOpacity>
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
    borderWidth: 2,
    fontSize: 16,
    fontWeight: "bold",
  },
  textSy1: {
    borderWidth: 2,
    fontWeight: "normal",
    fontSize: 16,
    marginLeft: 2,
    marginRight: 5,
  },
  textSy2: {
    borderWidth: 2,
    fontWeight: "normal",
    fontSize: 16,
    marginLeft: 12,
    marginRight: 5,
  },
});

export default StaffFormAccom;
