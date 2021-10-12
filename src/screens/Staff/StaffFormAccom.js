import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert
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
const StaffFormAccom = ({ navigation, route }) => {
  const [lang, setLang] = useState("TH");
  const [accom, setAccom] = useState([]);
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noApprove, setNoApprove] = useState(false);
  const [approval_note, setApproval_note] = useState(null);

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
      setLoading(true);
      if (getLang == "EN") {
        var lang_id = "1";
      } else {
        var lang_id = "2";
      }

      httpClient
        .get(`Team/confirmBookingAccom/${route.params.booking_id}`)
        .then((response) => {
          if (response.data) {
            setAccom(response.data.booking);
            setItem(response.data.accom);
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

  const submitApprove = async (approval_status) => {
    Alert.alert(
      lang == "EN" ? "Alert" : "แจ้งเตือน",

      lang == "EN" ? "Confirm the recording." : "ยืนยันการบันทึก",
      [
        {
          text: lang == "EN" ? "CANCEN" : "ยกเลิก",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        ,
        {
          text: lang == "EN" ? "OK" : "ตกลง",
          onPress: async () => {
            let confirm = false;
            if (noApprove) {
              if (approval_note != null) {
                confirm = true;
              } else {
                confirm = false;
              }
            } else {
              confirm = true;
            }

            if (confirm) {
              let user_id = await AsyncStorage.getItem("userId");
              console.log(route);
              let param = {
                booking_id: route.params.booking_id,
                user_id: user_id,
                approval_status: approval_status,
                approval_note: approval_note
              };

              httpClient
                .post(`/Team/saveBookingRequestApprove`, param)
                .then((response) => {
                  let res = response.data;
                  if (res == true) {
                    Alert.alert(
                      lang == "EN" ? "Successful" : "บันทึกเรียบร้อย",
                      "",
                      [{ text: "OK", onPress: navigation.goBack() }]
                    );
                  }
                })
                .catch((e) => console.log(e));
            } else {
              Alert.alert(
                lang == "EN" ? "Please enter a reason." : "โปรดกรอกเหตุผลด้วย"
              );
            }
          }
        }
      ]
    );
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
          marginBottom: 20
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {accom ? (
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
                alignSelf: "center"
              }}
            >
              {lang == "EN"
                ? "EXTERRAN (THAILAND) LTD."
                : "บริษัท เอ็กซ์เธอร์แอน (ประเทศไทย) จำกัด"}
            </Text>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 16,
                marginTop: 4,
                marginBottom: 15
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
                value={lang == "EN" ? accom.firstname_en : accom.firstname}
              />

              <Text>Last name:</Text>
              <Text style={styles.textInput}>นามสกุล</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={lang == "EN" ? accom.lastname_en : accom.lastname}
              />

              <Text>Identification:</Text>
              <Text style={styles.textInput}>เลขบัตรประชาชน</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={accom.identification ? accom.identification : "-"}
              />

              <Text>Phone:</Text>
              <Text style={styles.textInput}>เบอร์</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={accom.phone ? accom.phone : "-"}
              />

              <Text>BirthDay:</Text>
              <Text style={styles.textInput}>วันเกิด</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={moment(accom.birthday).format("DD/MM/YYYY")}
              />

              <Text>Province:</Text>
              <Text style={styles.textInput}>จังหวัด</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={
                  lang == "EN"
                    ? accom.pv_name_en
                    : accom.pv_name_th
                    ? lang == "EN"
                      ? accom.pv_name_en
                      : accom.pv_name_th
                    : "-"
                }
              />

              <Text>District:</Text>
              <Text style={styles.textInput}>อำเภอ</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={
                  lang == "EN"
                    ? accom.dt_name_en
                    : accom.dt_name_th
                    ? lang == "EN"
                      ? accom.dt_name_en
                      : accom.dt_name_th
                    : "-"
                }
              />

              <Text>Subdistrict:</Text>
              <Text style={styles.textInput}>ตำบล</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={
                  lang == "EN"
                    ? accom.sdt_name_en
                    : accom.sdt_name_th
                    ? lang == "EN"
                      ? accom.sdt_name_en
                      : accom.sdt_name_th
                    : "-"
                }
              />

              <Text>Purpose:</Text>
              <Text style={styles.textInput}>วัตถุประสงค์</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={
                  accom.purpose
                    ? lang == "EN"
                      ? accom.purpose_hotel_en
                      : accom.purpose_hotel_th
                    : accom.purpose_etc
                }
              />
            </View>

            {/* <Divider style={{ backgroundColor: "#d9d9d9" }} /> */}
            {item.map((param) => {
              return (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                >
                  <Divider style={{ backgroundColor: "black" }} />

                  <View style={{ margin: 20, marginHorizontal: 8 }}>
                    <Text>Province:</Text>
                    <Text style={styles.textInput}>จังหวัด</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={
                        lang == "EN"
                          ? param.pv_name_en
                          : param.pv_name_th
                          ? lang == "EN"
                            ? param.pv_name_en
                            : param.pv_name_th
                          : "-"
                      }
                    />

                    <Text>Accommodation (Province, Hotel name):</Text>
                    <Text style={styles.textInput}>
                      ที่พัก (จังหวัดชื่อโรงแรม)
                    </Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={
                        lang == "EN"
                          ? param.hotel_name_en
                          : param.hotel_name_th
                          ? lang == "EN"
                            ? param.hotel_name_en
                            : param.hotel_name_th
                          : "-"
                      }
                    />

                    <Text>Check in date(D/M/Y):</Text>
                    <Text style={styles.textInput}>เช็คอิน</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={moment(param.checkin).format("DD/MM/YYYY")}
                    />

                    <Text>Check out date(D/M/Y):</Text>
                    <Text style={styles.textInput}>เช็คเอาท์</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={moment(param.checkout).format("DD/MM/YYYY")}
                    />

                    <View
                      style={{
                        marginVertical: 8,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
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
                            marginHorizontal: 8
                            // marginTop: 50,
                          }}
                        />
                        <View
                          style={{
                            alignItems: "center",
                            marginTop: 5
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
                            marginHorizontal: 8
                            // marginTop: 50,
                          }}
                        />
                        <View
                          style={{
                            alignItems: "center",
                            marginTop: 5
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
                    onChangeText={(text) => setApproval_note(text)}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    margin: 20
                  }}
                >
                  <TouchableOpacity
                    onPress={() => submitApprove(2)}
                    style={{
                      backgroundColor: "green",
                      width: WIDTH / 5,
                      height: HEIGHT * 0.05,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 4
                    }}
                  >
                    <Text style={{ color: "white" }}>ยืนยัน</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setNoApprove(false)}
                    style={{
                      backgroundColor: "red",
                      width: WIDTH / 5,
                      height: HEIGHT * 0.05,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 4
                    }}
                  >
                    <Text style={{ color: "white" }}>ย้อนกลับ</Text>
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
                      borderRadius: 4
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
                  margin: 20
                }}
              >
                <TouchableOpacity
                  onPress={() => submitApprove(1)}
                  style={{
                    backgroundColor: "green",
                    width: WIDTH / 5,
                    height: HEIGHT * 0.05,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 4
                  }}
                >
                  <Text style={{ color: "white" }}>อนุมัติ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setNoApprove(true)}
                  style={{
                    backgroundColor: "red",
                    width: WIDTH / 5,
                    height: HEIGHT * 0.05,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 4
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
                    borderRadius: 4
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
    marginVertical: 18
  },
  marginText: {
    marginTop: 5
  },
  textSyH1: {
    fontSize: 16,
    fontWeight: "bold"
  },
  textSy1: {
    fontWeight: "normal",
    fontSize: 16,
    marginLeft: 2,
    marginRight: 5
  },
  textSy2: {
    fontWeight: "normal",
    fontSize: 16,
    marginLeft: 12,
    marginRight: 5
  },
  inputStyle: {
    backgroundColor: "#DCDCDC",
    borderRadius: 15,
    height: HEIGHT / 25,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10
  },
  confirmStyle: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30
  }
});

export default StaffFormAccom;
