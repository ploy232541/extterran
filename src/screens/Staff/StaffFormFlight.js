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

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const StaffFormFlight = ({ navigation, route }) => {
  const [lang, setLang] = useState("TH");
  const [flight, setFlight] = useState([]);
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
      setLoading(true);
      let getLang = await AsyncStorage.getItem("language");
      setLang(getLang);
      if (getLang == "EN") {
        var lang_id = "1";
      } else {
        var lang_id = "2";
      }

      httpClient
        .get(`Team/confirmBookingFlight/${route.params.booking_id}`)
        .then((response) => {
          if (response.data) {
            setFlight(response.data.booking);
            setItem(response.data.flight)
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
              {/* ตัวอย่าง */}
              {/* <Text>{flight.firstname}</Text> */}
              <Text style={styles.textSy1}>
                {lang == "EN" ? flight.firstname_en : flight.firstname}
              </Text>

              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Lastname" : "นามสกุล"}
              </Text>
              <Text style={styles.textSy1}>
                {lang == "EN" ? flight.lastname_en : flight.lastname}
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
              <Text style={styles.textSy2}>{flight.identification}</Text>
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
                {flight.phone ? flight.phone : "-"}
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
                {moment(flight.birthday).format("DD/MM/YYYY")}
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
                {lang == "EN" ? flight.pv_name_en : flight.pv_name_th}
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
                {lang == "EN" ? "Purpose" : "วัตถุประสงค์"}
              </Text>
              <Text style={styles.textSy2}>
                {" "}
                {flight.purpose
                  ? lang == "EN"
                    ? flight.purpose_travel_en
                    : flight.purpose_travel_th
                  : flight.purpose_etc}
              </Text>
            </View>
          </View>

          <Divider style={{ backgroundColor: "#d9d9d9" }} />
{item.map((param)=>{
  console.log(param);
return(
<ScrollView>
<View style={{ margin: 20, marginHorizontal: 8 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                // marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "วันที่เดินทาง" : "วันที่เดินทาง"}
              </Text>
              <Text style={styles.textSy2}>
                {moment(param.flight_date).format("DD/MM/YYYY")}
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
                {lang == "EN" ? "เวลาเริ่ม" : "เวลาเริ่ม"}
              </Text>
              <Text style={styles.textSy2}>{param.time_start}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "เวลาสิ้นสุด" : "เวลาสิ้นสุด"}
              </Text>
              <Text style={styles.textSy2}>{param.time_end}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "from" : "ต้นทาง"}
              </Text>
              <Text style={styles.textSy2}>{lang == "EN" ?(param.from_name_en): (param.from_name)}{" (" +param.airport_code_from+")"}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "to" : "ปลายทาง"}
              </Text>
              <Text style={styles.textSy2}>{lang == "EN" ?(param.to_name_en): (param.to_name)}{" (" +param.airport_code_to+")"}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "เที่ยวบิน" : "เที่ยวบิน"}
              </Text>
              <Text style={styles.textSy2}>{param.flight}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 8,
              }}
            >
              <Text style={styles.textSyH1}>
                {lang == "EN" ? "Baggage" : "สัมภาระ"}
              </Text>
              <Text style={styles.textSy2}>
                {param.param_carry ? flight.flight_carry : "ไม่มีสัมภาระ"}
              </Text>
            </View>
          </View>

          <Divider style={{ backgroundColor: "#d9d9d9" }} />
</ScrollView>
  )
})}
         

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

export default StaffFormFlight;
