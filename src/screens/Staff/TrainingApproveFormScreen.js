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
import { AsyncStorage } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-elements";
import AntIcon from "react-native-vector-icons/AntDesign";
import { Dimensions } from "react-native";
import HTML from "react-native-render-html";
import Modal from "react-native-modal";
import { httpClient } from "../../utils/Provider";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const TrainingApproveFormScreen = ({ navigation, route }) => {
  const [lang, setLang] = useState("TH");
  const [dataArray, setDataArray] = useState([]);
  const [noApprove, setNoApprove] = useState(false);
  const [approval_note, setApproval_note] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = () => {
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
// console.log(route.params.require_id);
      httpClient
        .get(`/Team/getTrainingRequestApprove/${route.params.request_id}/${lang_id}`)
        .then((response) => {
          let res = response.data;
          if (res != null) {
            setDataArray(res);
           setLoading(false)
            // console.log(res);
          }
            else{
              setLoading(false)
            }
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
          style: "cancel",
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
              console.log(route);
              let param = {
                request_id: route.params.request_id,
                user_id: user_id,
                approval_status: approval_status,
                approval_note: approval_note,
              };

              httpClient
                .post(`/Team/saveTrainingRequestApprove`, param)
                .then((response) => {
                  let res = response.data;
                  if (res == true) {
                    Alert.alert(
                      lang == "EN" ? "Successful" : "บันทึกเรียบร้อย",
                      "",
                      [{ text: "OK", onPress: route.closeModal }]
                    );
                  }
                })
                .catch((e) => console.log(e));
            } else {
              Alert.alert(
                lang == "EN" ? "Please enter a reason." : "โปรดกรอกเหตุผลด้วย"
              );
            }
          },
        },
      ]
    );
  };

     if (loading) {
          return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
        }}
      >
        {dataArray ? (
          <View style={styles.container}>
            <Text
              style={{  alignSelf: "center", fontSize: 20, fontWeight: "bold"  }}
            >   
              {lang == "EN"
              ? "Training Request"
              : "ใบคำขอฝึกอบรม"}
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
              Training Request
            </Text>
            
            <View>
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

              <Text>Last name:</Text>
              <Text style={styles.textInput}>นามสกุล</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.lastname}
              />

              <Text>Position :</Text>
              <Text style={styles.textInput}>ตำแหน่ง</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.position}
              />

              <Text>Dept :</Text>
              <Text style={styles.textInput}>แผนก</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.department}
              />

              <View style={{ marginTop: 10, marginBottom: 10 }}>
                <Divider style={{ paddingBottom: 1 }} />
              </View>

              <Text>Expense :</Text>
              <Text style={styles.textInput}>
                ค่าใช้จ่ายต่อบุคคล (ไม่รวมภาษี)
              </Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.expense}
              />

              <Text>Name of Course :</Text>
              <Text style={styles.textInput}>ชื่อหลักสูตร</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.course_name}
              />

              <Text>Start Date :</Text>
              <Text style={styles.textInput}>วันที่เริ่มฝึกอบรบ</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.start_date}
              />

              <Text>End Date :</Text>
              <Text style={styles.textInput}>วันที่สิ้นสุดฝึกอบรบ</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.end_date}
              />

              <Text>Total :</Text>
              <Text style={styles.textInput}>รวมวันฝึกอบรม</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.total}
              />
            </View>
            {/* <Divider style={{ backgroundColor: "black", marginHorizontal: 10 }} />

                        <View style={{ margin: 20 }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text>ไฟล์แนบ</Text>
                            <TouchableOpacity style={{ marginLeft: 30 }}>
                                <View
                                style={{
                                    backgroundColor: "#f0efef",
                                    width: 80,
                                    height: HEIGHT * 0.04,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderWidth: 1,
                                    borderRadius: 5,
                                }}
                                >
                                <AntIcon name="filetext1" size={24} />
                                </View>
                            </TouchableOpacity>
                            </View>
                        </View> */}

            <Divider
              style={{ backgroundColor: "black", marginHorizontal: 10 }}
            />
            <View style={{ margin: 20 }}>
              <Text>Pre-Requisities for Training :</Text>
              <Text style={styles.textInput}>
                คุณสมบัติขั้นพื้นฐานเพื่อฝึกอบรม
              </Text>
              {dataArray.pre_requisities
                ? dataArray.pre_requisities.map((item, key) => {
                    return (
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={key + 1 + ". " + item.qual_qualification}
                      />
                    );
                  })
                : null}

              <Text>Expected Result of Training :</Text>
              <Text style={styles.textInput}>
                ผลที่คาดว่าจะได้รับจากการฝึกอบรม
              </Text>
              {dataArray.expected_result_of_training
                ? dataArray.expected_result_of_training.map((item, key) => {
                    return (
                      <TextInput
                        editable={false}
                        style={styles.inputStyle}
                        value={key + 1 + ". " + item.exp_expected}
                      />
                    );
                  })
                : null}

              <Text>Particpant/Requeste :</Text>
              <Text style={styles.textInput}>ผู้เข้าอบรม/ผู้ยื่นคำขอ</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.participant_requeste}
              />

              <Text>Date :</Text>
              <Text style={styles.textInput}>วันที่</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.date}
              />

              <Text>Place :</Text>
              <Text style={styles.textInput}>สถานที่ฝึกอบรม</Text>
              <TextInput
                editable={false}
                style={styles.inputStyle}
                value={dataArray.place}
              />
            </View>

            <View style={{ margin: 20 }}>
              <View style={{ paddingTop: 20 }}>
                <Text>Approved : </Text>
                <Text style={styles.textInput}>อนุมัติโดย</Text>
              </View>

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
                  <Text>ผู้บังคับบัญชาของผู้เข้าฝึกอบรม / ผู้ยื่นคำขอ</Text>
                </View>
              </View>

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

              <View style={{ paddingTop: 20 }}>
                <Text>Acknowledged By HR:</Text>
              </View>

              <View style={styles.confirmStyle}>
                <Text style={{ textAlign: "center" }}>
                  {dataArray.ht_training_coordinator != null
                    ? dataArray.ht_training_coordinator
                    : ""}
                </Text>
                <Divider
                  style={{ paddingBottom: 1, backgroundColor: "blue" }}
                />
                <View style={styles.textConfirm}>
                  <Text>HR Training Coordinator</Text>
                  <Text>เจ้าหน้าที่</Text>
                </View>
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
                    margin: 20,
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
                      borderRadius: 4,
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
                      height: HEIGHT * 0.04,
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
                  onPress={() => submitApprove(1)}
                  style={{
                    backgroundColor: "green",
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
                  onPress={() => setNoApprove(true)}
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
                  onPress={route.closeModal}
                  style={{
                    backgroundColor: "gray",
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

export default TrainingApproveFormScreen;
