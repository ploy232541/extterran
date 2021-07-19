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
const ModalTrainingUnderStatus = (props) => {
  // props.request_id

  return (
    <Modal
      backdropOpacity={0.5}
      isVisible={props.chkVisible}
      onBackdropPress={props.closeModal}
    >
      <ScrollView
        style={{
          flex: 1,
          borderWidth: 1,
          borderRadius: 12,
          marginTop: 20,
          borderColor: "#d9d9d9",
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
                      fontSize: 18,
                      marginBottom: 10,
                    }}
                  >
                    ติดตามสถานะ
                  </Text>
                  <View style={{ marginHorizontal: 20 }}>
                    <Divider style={{ backgroundColor: "#d9d9d9" }} />
                  </View>

                  <Text
                    style={{
                      fontSize: 16,
                      color: "#4393de",
                      marginTop: 10,
                      alignSelf: "center",
                    }}
                  >
                    บริษัท เอ็กซ์เธอร์แอน ประเทศไทย จำกัด
                  </Text>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 16,
                      marginBottom: 15,
                      marginTop: 10,
                    }}
                  >
                    Training Request
                  </Text>
                  <View style={{ marginHorizontal: 48 }}>
                    <Divider style={{ backgroundColor: "#d9d9d9" }} />
                  </View>

                  <View style={{ margin: 20 }}>
                    <Text style={{ marginTop: 10 }}>First name:</Text>
                    <Text style={styles.textInput}>ชื่อ</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.firstname}
                    />

                    <Text>Last name:</Text>
                    <Text style={styles.textInput}>นามสกุล</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.lastname}
                    />

                    <Text>Position:</Text>
                    <Text style={styles.textInput}>ตำแหน่ง</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.position}
                    />

                    <Text>Dept:</Text>
                    <Text style={styles.textInput}>แผนก</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.department}
                    />

                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                      <Divider style={{ paddingBottom: 1 }} />
                    </View>

                    <Text>Expense:</Text>
                    <Text style={styles.textInput}>
                      ค่าใช้จ่ายต่อบุคคล (ไม่รวมภาษี)
                    </Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.expense}
                    />

                    <Text>Name of Course:</Text>
                    <Text style={styles.textInput}>ชื่อหลักสูตร</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.course_title}
                    />

                    <Text>Start Date:</Text>
                    <Text style={styles.textInput}>วันที่เริ่มฝึกอบรบ</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.start_date}
                    />

                    <Text>End Date:</Text>
                    <Text style={styles.textInput}>วันที่สิ้นสุดฝึกอบรบ</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.end_date}
                    />

                    <Text>Total:</Text>
                    <Text style={styles.textInput}>รวมวันฝึกอบรม</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.total_date}
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
                    <Text>Pre-Requisities for Training:</Text>
                    <Text style={styles.textInput}>
                      คุณสมบัติขั้นพื้นฐานเพื่อฝึกอบรม
                    </Text>
                    {item.qualification
                      ? item.qualification.map((item, key) => {
                          return (
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={key + 1 + ". " + item}
                            />
                          );
                        })
                      : null}

                    <Text>Expected Result of Training:</Text>
                    <Text style={styles.textInput}>
                      ผลที่คาดว่าจะได้รับจากการฝึกอบรม
                    </Text>
                    {item.expected
                      ? item.expected.map((item, key) => {
                          return (
                            <TextInput
                              editable={false}
                              style={styles.inputStyle}
                              value={key + 1 + ". " + item}
                            />
                          );
                        })
                      : null}

                    <Text>Particpant/Requeste:</Text>
                    <Text style={styles.textInput}>
                      ผู้เข้าอบรม/ผู้ยื่นคำขอ
                    </Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.participant}
                    />

                    <Text>Date:</Text>
                    <Text style={styles.textInput}>วันที่</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.created_date}
                    />

                    <Text>Place:</Text>
                    <Text style={styles.textInput}>สถานที่ฝึกอบรม</Text>
                    <TextInput
                      editable={false}
                      style={styles.inputStyle}
                      value={item.request_place}
                    />
                  </View>

                  <View style={{ margin: 20 }}>
                    <View style={{ paddingTop: 20 }}>
                      <Text>Approved : </Text>
                      <Text style={styles.textInput}>อนุมัติโดย</Text>
                    </View>

                    {item.approved_step == 4 ? (
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
                          <Text>
                            ผู้บังคับบัญชาของผู้เข้าฝึกอบรม / ผู้ยื่นคำขอ
                          </Text>
                        </View>
                      </View>
                    ) : null}

                    <View style={styles.confirmStyle}>
                      <Text style={{ textAlign: "center" }}>
                        {item.country_manager != null
                          ? item.country_manager
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
                        {item.hr_training_coordinator != null
                          ? item.hr_training_coordinator
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

export default ModalTrainingUnderStatus;
