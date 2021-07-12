import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
// import AsyncStorage1 from "@react-native-async-storage/async-storage"; //--
import { AsyncStorage } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-elements";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Dimensions } from "react-native";
import HTML from "react-native-render-html";
import Modal from "react-native-modal";
import { httpClient } from "../../utils/Provider";
import { Avatar } from "react-native-paper";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const ModalBookingStatus = (props) => {
  const [lang, setLang] = useState("TH");

  useEffect(() => {
    const run = async () => {
      getData();
    };
    run();
  }, []);

  const getData = async () => {
    let getLang = await AsyncStorage.getItem("language");
    setLang(getLang);
    if (getLang == "EN") {
      var lang_id = "1";
    } else {
      var lang_id = "2";
    }
  };

  return (
    <Modal visible={props.chkVisible} onBackdropPress={props.closeModal}>
      <ScrollView
        style={{
          flex: 1,
          borderWidth: 1,
          borderRadius: 12,
          marginTop: 20,
          borderColor: "red",
          backgroundColor: "white",
        }}
      >
        {props.modelData
          ? props.modelData.map((item) => {
              return (
                <View style={styles.container}>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
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
                    <Divider
                      style={{ backgroundColor: "black", borderWidth: 2 }}
                    />
                  </View>

                  <View style={{ margin: 20, marginHorizontal: 8 }}>
                    <Text style={{ marginTop: 10 }}>First name :</Text>
                    <Text style={styles.textInput}>ชื่อ</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.firstname}
                    />

                    <Text>Last name :</Text>
                    <Text style={styles.textInput}>นามสกุล</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.lastname}
                    />

                    <Text>ID No :</Text>
                    <Text style={styles.textInput}>เลขบัตรประชาชน</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.identification}
                    />

                    <Text>Phone No :</Text>
                    <Text style={styles.textInput}>เบอร์โทรศัพท์</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.phone ? item.phone : "-"}
                    />

                    {item.booking_type == 1 ? (
                      <>
                        <Text>Birthday :</Text>
                        <Text style={styles.textInput}>วันเกิด</Text>
                        <TextInput
                          editable={false}
                          style={styles.inputStyle}
                          value={
                            item.birthday != "Invalid date"
                              ? item.birthday
                              : "-"
                          }
                        />
                      </>
                    ) : null}

                    {item.booking_type == 3 ? (
                      <>
                        <Text>Resident :</Text>
                        <Text style={styles.textInput}>ที่อยู่</Text>
                        <TextInput
                          editable={false}
                          style={styles.inputStyle}
                          value={item.resident}
                        />
                      </>
                    ) : null}

                    <Text>Province :</Text>
                    <Text style={styles.textInput}>จังหวัด</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.province}
                    />

                    {item.booking_type == 2 || item.booking_type == 3 ? (
                      <>
                        <Text>District :</Text>
                        <Text style={styles.textInput}>อำเภอ</Text>
                        <TextInput
                          editable={false}
                          style={styles.inputStyle}
                          value={item.district}
                        />

                        <Text>Subdistrict :</Text>
                        <Text style={styles.textInput}>ตำบล</Text>
                        <TextInput
                          editable={false}
                          style={styles.inputStyle}
                          value={item.subdistrict}
                        />

                        <Text>Zip :</Text>
                        <Text style={styles.textInput}>รหัสไปรษณีย์</Text>
                        <TextInput
                          editable={false}
                          style={styles.inputStyle}
                          value={item.zip ? item.zip : "-"}
                        />
                      </>
                    ) : null}

                    {item.booking_type != 3 ? (
                      <>
                        {item.purpose != null ? (
                          <>
                            <Text>Purpose :</Text>
                            <Text style={styles.textInput}>
                              วัตถุประสงค์ในการเดินทาง
                            </Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={item.purpose ? item.purpose : "-"}
                            />
                          </>
                        ) : null}
                        {item.purpose_etc != null ? (
                          <>
                            <Text>Purpose :</Text>
                            <Text style={styles.textInput}>
                              วัตถุประสงค์ในการเดินทาง อื่นๆ
                            </Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={item.purpose_etc ? item.purpose_etc : "-"}
                            />
                          </>
                        ) : null}
                      </>
                    ) : null}
                  </View>

                  <Divider style={{ backgroundColor: "black" }} />

                  {item.booking_type == 1
                    ? item.booking.map((value) => {
                        return (
                          <View
                            style={{
                              padding: 12,
                              marginTop: "8%",
                              // marginTop: 30,
                              // marginBottom: 20,
                              borderWidth: 1,
                              borderColor: "#398DDD",
                              borderRadius: 10,
                            }}
                          >
                            <Text>Date :</Text>
                            <Text style={styles.textInput}>วันออกเดินทาง</Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={value.date}
                            />

                            <Text>Time :</Text>
                            <Text style={styles.textInput}>เวลาเดินทาง</Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={value.time_start}
                            />

                            <Text>Time :</Text>
                            <Text style={styles.textInput}>เวลาเดินทาง</Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={value.time_end}
                            />

                            <Text>From :</Text>
                            <Text style={styles.textInput}>ต้นทาง</Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={value.flight_from}
                            />

                            <Text>To :</Text>
                            <Text style={styles.textInput}>ปลายทาง</Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={value.flight_to}
                            />

                            <Text>Flight :</Text>
                            <Text style={styles.textInput}>เที่ยวบิน</Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={value.flight}
                            />

                            {item.flight_carry ? (
                              <>
                                <Text>Baggage :</Text>
                                <Text style={styles.textInput}>สัมภาระ</Text>
                                <TextInput
                                  editable={false}
                                  style={styles.inputStyle}
                                  value={value.flight_carry}
                                />
                              </>
                            ) : null}
                          </View>
                        );
                      })
                    : item.booking_type == 2
                    ? item.booking.map((value) => {
                        return (
                          <View
                            style={{
                              padding: 12,
                              marginTop: "8%",
                              // marginTop: 30,
                              // marginBottom: 20,
                              borderWidth: 1,
                              borderColor: "#398DDD",
                              borderRadius: 10,
                            }}
                          >
                            <Text>Province :</Text>
                            <Text style={styles.textInput}>จังหวัด</Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={value.province}
                            />

                            <Text>Accommodation (Province, Hotel name) :</Text>
                            <Text style={styles.textInput}>
                              ที่พัก (จังหวัดชื่อโรงแรม)
                            </Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={value.hotel_name}
                            />

                            <Text>Check in date(D/M/Y) :</Text>
                            <Text style={styles.textInput}>เช็คอิน</Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={value.checkin}
                            />

                            <Text>Check out date(D/M/Y) :</Text>
                            <Text style={styles.textInput}>เช็คเอาต์</Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={value.checkout}
                            />
                          </View>
                        );
                      })
                    : item.booking_type == 3
                    ? item.booking.map((value) => {
                        return (
                          <View
                            style={{
                              padding: 12,
                              marginTop: "8%",
                              // marginTop: 30,
                              // marginBottom: 20,
                              borderWidth: 1,
                              borderColor: "#398DDD",
                              borderRadius: 10,
                            }}
                          >
                            <Text>Date :</Text>
                            <Text style={styles.textInput}>วันออกเดินทาง</Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={value.ground_date}
                            />

                            <Text>Time :</Text>
                            <Text style={styles.textInput}>เวลาเดินทาง</Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={value.ground_time}
                            />

                            <Text>From :</Text>
                            <Text style={styles.textInput}>ต้นทาง</Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={value.ground_from}
                            />

                            <Text>To :</Text>
                            <Text style={styles.textInput}>ปลายทาง</Text>
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={value.ground_to}
                            />
                          </View>
                        );
                      })
                    : null}

                  <View
                    style={{
                      marginVertical: "10%",
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

                  {/* <View style={{ marginTop: 15 }}> */}
                  <View>
                    <Text style={{ marginHorizontal: 10,}}>
                      Approved :{" "}
                    </Text>
                    <Text
                      style={{
                        color: "grey",
                        marginHorizontal: 10,
                      }}
                    >
                      อนุมัติโดย
                    </Text>
                    {/* </View> */}

                    <View style={styles.confirmStyle}>
                      <Text style={{ textAlign: "center" }}>
                        {item.particlapant_supervisor != null
                          ? item.particlapant_supervisor
                          : ""}
                      </Text>
                      <Divider
                        style={{ paddingBottom: 1, backgroundColor: "blue" }}
                      />
                      <View style={styles.textConfirm}>
                        <Text>Particlapant's Supervisor</Text>
                        <Text>ผู้บังคับบัญชาของผู้เข้าฝึกอบรม</Text>
                      </View>
                    </View>

                    <View style={{ marginHorizontal: 8}}>
                      <Text>Acknowledged By HR :</Text>
                    </View>

                    <View style={styles.confirmStyle}>
                      <Text style={{ textAlign: "center" }}>
                        {item.human_resources_manager != null
                          ? item.human_resources_manager
                          : ""}
                      </Text>
                      <Divider
                        style={{ paddingBottom: 1, backgroundColor: "blue" }}
                      />
                      <View style={styles.textConfirm}>
                        <Text>Human Resources Manager</Text>
                        <Text>ผู้จัดการฝ่ายทรัพยากรบุคคล</Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      margin: 20,
                    }}
                  >
                    <TouchableOpacity
                      onPress={props.closeModal}
                      style={{
                        backgroundColor: "#cc2900",
                        width: WIDTH / 5,
                        height: HEIGHT * 0.04,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ color: "white" }}>ปิด</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          : null}
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    // marginVertical: 18,
    marginTop: 18,
  },
  marginText: {
    marginTop: 5,
  },
  inputStyle: {
    backgroundColor: "#DCDCDC",
    borderRadius: 15,
    height: HEIGHT / 25,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  textInput: {
    color: "grey",
  },
  confirmStyle: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  textConfirm: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
});

export default ModalBookingStatus;
