import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Divider } from "react-native-elements";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Dimensions } from "react-native";
import { httpClient } from "../../core/HttpClient";
import { AsyncStorage } from "react-native";
import moment from "moment";
import { Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { Modal } from "react-native";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const StaffFormFlight = ({ navigation, route }) => {
  const [lang, setLang] = useState("TH");
  const [flight, setFlight] = useState([]);
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noApprove, setNoApprove] = useState(false);

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
            setItem(response.data.flight);
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
    <Modal visible={route.chkVisible} onBackdropPress={route.closeModal}>
      <ScrollView
        style={{
          flex: 1,
          borderWidth: 2,
          borderRadius: 12,
          marginTop: 20,
          borderColor: "red",
          backgroundColor: "white",
          marginHorizontal: 18,
          marginBottom: 20,
        }}
      >
        {flight ? (
          <View style={styles.container}>
            <Text
              style={{ alignSelf: "center", fontSize: 20, fontWeight: "bold" }}
            >
              {lang == "EN" ? "Booking Request" : "ใบคำขอ Booking"}
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

            <View style={{ margin: 20, marginHorizontal: 8 }}>
              <Text>First name:</Text>
              <Text style={styles.textInput}>ชื่อ</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={lang == "EN" ? flight.firstname_en : flight.firstname}
              />

              <Text>Last name:</Text>
              <Text style={styles.textInput}>นามสกุล</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={lang == "EN" ? flight.lastname_en : flight.lastname}
              />

              <Text>Identification:</Text>
              <Text style={styles.textInput}>เลขบัตรประชาชน</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={flight.identification ? flight.identification : "-"}
              />

              <Text>Phone:</Text>
              <Text style={styles.textInput}>เบอร์</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={flight.phone ? flight.phone : "-"}
              />

              <Text>BirthDay:</Text>
              <Text style={styles.textInput}>วันเกิด</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={moment(flight.birthday).format("DD/MM/YYYY")}
              />

              <Text>Province:</Text>
              <Text style={styles.textInput}>จังหวัด</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={
                  lang == "EN"
                    ? flight.pv_name_en
                    : flight.pv_name_th
                    ? lang == "EN"
                      ? flight.pv_name_en
                      : flight.pv_name_th
                    : "-"
                }
              />

              <Text>Purpose:</Text>
              <Text style={styles.textInput}>วัตถุประสงค์</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={
                  flight.purpose
                    ? lang == "EN"
                      ? flight.purpose_travel_en
                      : flight.purpose_travel_th
                    : flight.purpose_etc
                }
              />
            </View>

            {/* <Divider style={{ backgroundColor: "black" }} /> */}
            {item.map((param) => {
              return (
                <ScrollView>
                  <Divider style={{ backgroundColor: "black" }} />

                  <View style={{ margin: 20, marginHorizontal: 8 }}>
                    
                    <Text>Date:</Text>
                    <Text style={styles.textInput}>วันออกเดินทาง</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={moment(param.flight_date).format("DD/MM/YYYY")}
                    />
                    <Text>Start Time:</Text>
                    <Text style={styles.textInput}>เวลาเริ่ม</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={param.time_start}
                    />
                    <Text>End Time:</Text>
                    <Text style={styles.textInput}>เวลาสิ้นสุด</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={param.time_end}
                    />

                    <Text>From:</Text>
                    <Text style={styles.textInput}>ต้นทาง</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={
                        lang == "EN"
                          ? param.from_name_en
                          : param.from_name +
                            " (" +
                            param.airport_code_from +
                            ")"
                      }
                    />

                    <Text>To:</Text>
                    <Text style={styles.textInput}>ปลายทาง</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={
                        lang == "EN"
                          ? param.to_name_en
                          : param.to_name + " (" + param.airport_code_to + ")"
                      }
                    />

                    <Text>Flight:</Text>
                    <Text style={styles.textInput}>เที่ยวบิน</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={param.flight ? param.flight : "-"}
                    />

                    <Text>Baggage:</Text>
                    <Text style={styles.textInput}>สัมภาระ</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={
                        param.param_carry ? flight.flight_carry : "ไม่มีสัมภาระ"
                      }
                    />

                    <View
                      style={{
                        marginVertical: 8,
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

                    <View style={{ marginTop: 4 }}>
                      <Text>Approved: </Text>
                      <Text style={styles.textInput}>อนุมัติโดย</Text>

                      <View style={styles.confirmStyle}>
                        <Text style={{ textAlign: "center" }}></Text>
                        <Divider
                          style={{
                            paddingBottom: 1,
                            backgroundColor: "blue",
                            marginHorizontal: 8,
                            // marginTop: 50,
                          }}
                        />
                        <View
                          style={{
                            alignItems: "center",
                            marginTop: 5,
                          }}
                        >
                          <Text>Particlapant's Supervisor</Text>
                          <Text>ผู้บังคับบัญชาของผู้เข้าฝึกอบรม</Text>
                        </View>
                      </View>

                      <View style={{ paddingTop: 2 }}>
                        <Text>Acknowledged By HR:</Text>
                      </View>

                      <View style={styles.confirmStyle}>
                        <Text style={{ textAlign: "center" }}></Text>
                        <Divider
                          style={{
                            paddingBottom: 1,
                            backgroundColor: "blue",
                            marginHorizontal: 8,
                            // marginTop: 50,
                          }}
                        />
                        <View
                          style={{
                            alignItems: "center",
                            marginTop: 5,
                          }}
                        >
                          <Text>Human Resources Manager</Text>
                          <Text>ผู้จัดการฝ่ายทรัพยากรบุคคล</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              );
            })}

            <Divider style={{ backgroundColor: "black" }} />
            {noApprove ? (
              <>
                <View style={{ marginTop: 10 }}>
                  <Text>
                    กรอกเหตุผลที่ไม่อนุมัติ{" "}
                    <Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.inputStyle}
                    // onChangeText={(text) => setApproval_note(text)}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    margin: 20,
                  }}
                >
                  <TouchableOpacity
                    // onPress={() => submitApprove(2)}
                    style={{
                      backgroundColor: "green",
                      width: WIDTH / 5,
                      height: HEIGHT * 0.05,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: "white" }}>ยืนยัน</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    // onPress={() => setNoApprove(false)}
                    style={{
                      backgroundColor: "red",
                      width: WIDTH / 5,
                      height: HEIGHT * 0.05,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: "white" }}>ย้อนกลับ</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={route.closeModal}
                    style={{
                      backgroundColor: "gray",
                      width: WIDTH / 5,
                      height: HEIGHT * 0.05,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: "white" }}>ปิด</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  margin: 20,
                }}
              >
                <TouchableOpacity
                  // onPress={() => submitApprove(1)}
                  style={{
                    backgroundColor: "green",
                    width: WIDTH / 5,
                    height: HEIGHT * 0.05,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "white" }}>อนุมัติ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  // onPress={() => setNoApprove(true)}
                  style={{
                    backgroundColor: "red",
                    width: WIDTH / 5,
                    height: HEIGHT * 0.05,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "white" }}>ไม่อนุมัติ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  // onPress={route.closeModal}
                  onPress={() => navigation.goBack()}
                  style={{
                    backgroundColor: "gray",
                    width: WIDTH / 5,
                    height: HEIGHT * 0.05,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "white" }}>ปิด</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
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
  inputStyle: {
    backgroundColor: "#DCDCDC",
    borderRadius: 15,
    height: HEIGHT / 25,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  confirmStyle: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
});

export default StaffFormFlight;
