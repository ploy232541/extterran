import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Alert
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

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const BookingApproveFormScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("TH");
  const [dataArray, setDataArray] = useState([]);
  const [noApprove, setNoApprove] = useState(false);
  const [approval_note, setApproval_note] = useState(null);

  useEffect(() => {
    const run = () => {
      getData();
    };

    run();
  }, []);

  const getData = async () => {
    try {
      //   setLoading(true)
      let getLang = await AsyncStorage.getItem("language");
      setLang(getLang);
      if (getLang == "EN") {
        var lang_id = "1";
      } else {
        var lang_id = "2";
      }

      httpClient
        .get(`/Team/getBookingRequestApprove/${props.booking_id}/${lang_id}`)
        .then((response) => {
          let res = response.data;
          if (res != null) {
            setDataArray(res);
            // setLoading(false)
          }
          //   else{
          //     setLoading(false)
          //   }
        })
        .catch((e) => console.log(e));
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
              let param = {
                booking_id: props.booking_id,
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
                      [{ text: "OK", onPress: props.closeModal }]
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

  //    if (loading) {
  //         return (
  //           <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
  //             <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //               <ActivityIndicator />
  //             </View>
  //           </SafeAreaView>
  //         );
  //     }
  return (
    <Modal visible={props.chkVisible} onBackdropPress={props.closeModal}>
      <ScrollView
        style={{
          flex: 1,
          borderWidth: 1,
          borderRadius: 12,
          marginTop: 20,
          borderColor: "#d9d9d9",
          backgroundColor: "white"
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {dataArray ? (
          <View style={styles.container}>
            <Text
              style={{ alignSelf: "center", fontSize: 18, marginBottom: 10 }}
            >
              ใบคำขอ Booking
            </Text>
            <View style={{ marginHorizontal: 20 }}>
              <Divider style={{ backgroundColor: "#d9d9d9" }} />
            </View>

            <Text
              style={{
                fontSize: 16,
                color: "#4393de",
                marginTop: 10,
                alignSelf: "center"
              }}
            >
              บริษัท เอ็กซ์เธอร์แอน (ประเทศไทย) จำกัด
            </Text>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 16,
                marginBottom: 15,
                marginTop: 10
              }}
            >
              Booking Request
            </Text>
            <View style={{ marginHorizontal: 48 }}>
              <Divider style={{ backgroundColor: "#d9d9d9" }} />
            </View>

            <View style={{ margin: 20 }}>
              <Text style={{ marginTop: 10 }}>First name :</Text>
              <Text style={styles.textInput}>ชื่อ</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.firstname}
              />

              <Text>Last name :</Text>
              <Text style={styles.textInput}>นามสกุล</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.lastname}
              />

              <Text>ID No :</Text>
              <Text style={styles.textInput}>เลขบัตรประชาชน</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.identification}
              />

              <Text>Phone No :</Text>
              <Text style={styles.textInput}>เบอร์โทรศัพท์</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.phone}
              />

              {dataArray.booking_type == 1 ? (
                <>
                  <Text>Birthday :</Text>
                  <Text style={styles.textInput}>วันเกิด</Text>
                  <TextInput
                    editable={false}
                    style={styles.inputStyle}
                    value={dataArray.birthday}
                  />
                </>
              ) : null}

              {dataArray.booking_type == 3 ? (
                <>
                  <Text>Resident :</Text>
                  <Text style={styles.textInput}>ที่อยู่</Text>
                  <TextInput
                    editable={false}
                    style={styles.inputStyle}
                    value={"-"}
                  />
                </>
              ) : null}

              <Text>Province :</Text>
              <Text style={styles.textInput}>จังหวัด</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.province}
              />

              {dataArray.booking_type == 2 || dataArray.booking_type == 3 ? (
                <>
                  <Text>District :</Text>
                  <Text style={styles.textInput}>อำเภอ</Text>
                  <TextInput
                    editable={false}
                    style={styles.inputStyle}
                    value={dataArray.district}
                  />

                  <Text>Subdistrict :</Text>
                  <Text style={styles.textInput}>ตำบล</Text>
                  <TextInput
                    editable={false}
                    style={styles.inputStyle}
                    value={dataArray.subdistrict}
                  />

                  <Text>Zip :</Text>
                  <Text style={styles.textInput}>รหัสไปรษณีย์</Text>
                  <TextInput
                    editable={false}
                    style={styles.inputStyle}
                    value={dataArray.zip}
                  />
                </>
              ) : null}

              {dataArray.booking_type != 3 ? (
                <>
                  {dataArray.purpose != null ? (
                    <>
                      <Text>Purpose :</Text>
                      <Text style={styles.textInput}>
                        วัตถุประสงค์ในการเดินทาง
                      </Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={dataArray.purpose}
                      />
                    </>
                  ) : null}
                  {dataArray.purpose_etc != null ? (
                    <>
                      <Text>Purpose :</Text>
                      <Text style={styles.textInput}>
                        วัตถุประสงค์ในการเดินทาง อื่นๆ
                      </Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={dataArray.purpose_etc}
                      />
                    </>
                  ) : null}
                </>
              ) : null}
            </View>

            <Divider
              style={{ backgroundColor: "black", marginHorizontal: 10 }}
            />

            {dataArray.booking_type == 1
              ? dataArray.arrType_1.map((item) => {
                  return (
                    <View
                      style={{
                        padding: 20,
                        marginTop: 30,
                        marginBottom: 30,
                        borderWidth: 1,
                        borderColor: "#e6e6e6",
                        borderRadius: 10
                      }}
                    >
                      <Text>Date :</Text>
                      <Text style={styles.textInput}>วันออกเดินทาง</Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={item.date}
                      />

                      <Text>Time :</Text>
                      <Text style={styles.textInput}>เวลาเดินทาง</Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={item.time_start}
                      />

                      <Text>Time :</Text>
                      <Text style={styles.textInput}>เวลาเดินทาง</Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={item.time_end}
                      />

                      <Text>From :</Text>
                      <Text style={styles.textInput}>ต้นทาง</Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={item.from}
                      />

                      <Text>To :</Text>
                      <Text style={styles.textInput}>ปลายทาง</Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={item.to}
                      />

                      <Text>Flight :</Text>
                      <Text style={styles.textInput}>เที่ยวบิน</Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={item.flight}
                      />

                      {item.baggage ? (
                        <>
                          <Text>Baggage :</Text>
                          <Text style={styles.textInput}>สัมภาระ</Text>
                          <TextInput
                            editable={false}
                            style={styles.inputStyle}
                            value={item.baggage}
                          />
                        </>
                      ) : null}
                    </View>
                  );
                })
              : dataArray.booking_type == 2
              ? dataArray.arrType_2.map((item) => {
                  return (
                    <View
                      style={{
                        padding: 20,
                        marginTop: 30,
                        marginBottom: 30,
                        borderWidth: 1,
                        borderColor: "#e6e6e6",
                        borderRadius: 10
                      }}
                    >
                      <Text>Province :</Text>
                      <Text style={styles.textInput}>จังหวัด</Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={item.province}
                      />

                      <Text>Accommodation (Province, Hotel name) :</Text>
                      <Text style={styles.textInput}>
                        ที่พัก (จังหวัดชื่อโรงแรม)
                      </Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={item.accommodation}
                      />

                      <Text>Check in date(D/M/Y) :</Text>
                      <Text style={styles.textInput}>เช็คอิน</Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={item.checkIn}
                      />

                      <Text>Check out date(D/M/Y) :</Text>
                      <Text style={styles.textInput}>เช็คเอาท์</Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={item.checkOut}
                      />
                    </View>
                  );
                })
              : dataArray.booking_type == 3
              ? dataArray.arrType_3.map((item) => {
                  return (
                    <View
                      style={{
                        padding: 20,
                        marginTop: 30,
                        marginBottom: 30,
                        borderWidth: 1,
                        borderColor: "#e6e6e6",
                        borderRadius: 10
                      }}
                    >
                      <Text>Date :</Text>
                      <Text style={styles.textInput}>วันออกเดินทาง</Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={item.date}
                      />

                      <Text>Time :</Text>
                      <Text style={styles.textInput}>เวลาเดินทาง</Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={item.time}
                      />

                      <Text>From :</Text>
                      <Text style={styles.textInput}>ต้นทาง</Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={item.from}
                      />

                      <Text>To :</Text>
                      <Text style={styles.textInput}>ปลายทาง</Text>
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={item.to}
                      />
                    </View>
                  );
                })
              : null}

            <Divider
              style={{ backgroundColor: "black", marginHorizontal: 10 }}
            />

            <View style={{ margin: 20 }}>
              <View style={{ paddingTop: 20 }}>
                <Text>Approved : </Text>
                <Text style={styles.textInput}>อนุมัติโดย</Text>
              </View>

              {dataArray.open == "open" ? (
                <>
                  <View style={styles.confirmStyle}>
                    <Text style={{ textAlign: "center" }}>
                      {dataArray.particlapant_supervisor != null
                        ? dataArray.particlapant_supervisor
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
                </>
              ) : (
                <>
                  <View style={styles.confirmStyle}>
                    <Text style={{ textAlign: "center" }}>
                      {dataArray.country_manager != null
                        ? dataArray.country_manager
                        : ""}
                    </Text>
                    <Divider
                      style={{ paddingBottom: 1, backgroundColor: "blue" }}
                    />
                    <View style={styles.textConfirm}>
                      <Text>Country Manager</Text>
                      <Text>ผู้จัดการ</Text>
                    </View>
                  </View>
                </>
              )}

              <View style={{ paddingTop: 20 }}>
                <Text>Acknowledged By HR :</Text>
              </View>

              <View style={styles.confirmStyle}>
                <Text style={{ textAlign: "center" }}>
                  {dataArray.human_resources_manager != null
                    ? dataArray.human_resources_manager
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

            {noApprove ? (
              <>
                <View>
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
                      height: HEIGHT * 0.04,
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
                      height: HEIGHT * 0.04,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 4
                    }}
                  >
                    <Text style={{ color: "white" }}>ย้อนกลับ</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={props.closeModal}
                    style={{
                      backgroundColor: "gray",
                      width: WIDTH / 5,
                      height: HEIGHT * 0.04,
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
                    height: HEIGHT * 0.04,
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
                    height: HEIGHT * 0.04,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 4
                  }}
                >
                  <Text style={{ color: "white" }}>ไม่อนุมัติ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={props.closeModal}
                  style={{
                    backgroundColor: "gray",
                    width: WIDTH / 5,
                    height: HEIGHT * 0.04,
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
  inputStyle: {
    backgroundColor: "#DCDCDC",
    borderRadius: 15,
    height: HEIGHT / 25,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10
  },
  textInput: {
    color: "grey"
  },
  confirmStyle: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30
  },
  textConfirm: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10
  }
});

export default BookingApproveFormScreen;
