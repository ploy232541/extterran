import React, { Component } from "react";
import {
  Avatar,
  Colors,
  DataTable,
  Divider,
  IconButton,
} from "react-native-paper";
import {
  Button,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  TouchableOpacity,
  Pressable,
  Alert,
  TextInput,
} from "react-native";

import { httpClient } from "../../core/HttpClient";

let WIDTH = Dimensions.get("window").width;
let HEIGHT = Dimensions.get("window").height;

export default class TrainingStatusScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      page: 0,
      optionsPerPage: [2, 3, 4],
      itemsPerPage: "",
      training_request_status: [],
      status: {
        th: {
          0: "รอการอนุมัติ",
          1: "ผ่านการอนุมัติ",
          2: "ไม่ผ่านการอนุมัติ",
          3: "รอการอนุมัติ",
        },
        en: {
          0: "In Progress",
          1: "Approved",
          2: "Not Approved",
          3: "In Progress",
        },
      },
    };
  }
  async componentDidMount() {
    let id = await AsyncStorage.getItem("userId");
    const res = await AsyncStorage.getItem("language");
    if (res === "EN") {
      this.setState({ lang: "EN" });
    } else {
      this.setState({ lang: "TH" });
    }
    this.setState({ itemsPerPage: this.state.optionsPerPage[0] });

    try {
      httpClient
        .get(`/Training/TrainingRequestStatusData/${id}`)
        .then((response) => {
          const result = response.data;

          if (result != null) {
            this.setState({
              training_request_status: result,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      Alert.alert(error);
    }
  }
  checkStatus = (status) => {
    return this.lang === "EN"
      ? this.state.status.en[status]
      : this.state.status.th[status];
  };
  //aek
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  // มี 3 ช่อง ลายเซ็น
  showdialog() {
    const { modalVisible } = this.state;
    return (
      <View style={stylesdialog.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <ScrollView>
            <View style={stylesdialog.centeredView}>
              <View style={stylesdialog.modalView}>
                <View style={styles.containerSec1}>
                  <Text style={stylesdialog.modalText}>
                    {this.state.lang === "EN" ? "Track Status" : "ติดตามสถานะ"}
                  </Text>
                  <Text style={stylesdialog.modalText1}>
                    {this.state.lang === "EN"
                      ? "Exotheran Thailand Co., Ltd."
                      : "บริษัทเอ็กซ์เธอร์แลน ประเทศไทย จำกัด"}
                  </Text>
                  <Text style={stylesdialog.modalText2}>Training Request</Text>

                  <Divider
                    style={{
                      paddingBottom: 1,
                      marginTop: 15,
                      marginBottom: 15,
                    }}
                  />

                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "space-around",
                      // paddingVertical: 24,
                      // marginBottom: 20,
                    }}
                  >
                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "First Name:" : "ชื่อ:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Last Name:"
                        : "นามสกุล:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "Position:" : "ตำแหน่ง:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "Dept:" : "แผนก:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <View
                      style={{
                        marginVertical: 18,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Divider style={{ paddingBottom: 1, flex: 1 }} />
                      <Avatar.Icon
                        icon="arrow-down"
                        size={30}
                        style={{ backgroundColor: "#6c757d" }}
                      />
                      <Divider style={{ paddingBottom: 1, flex: 1 }} />
                    </View>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Expense (excluded vat):"
                        : "ค่าใช้จ่ายต่อบุคคล (ไม่รวมภาษี):"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Name of Course:"
                        : "ชื่อหลักสูตร:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Start Date:"
                        : "วันที่เริ่มฝึกอบรม:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "End Date:"
                        : "วันที่สิ้นสุดฝึกอบรม:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Total:"
                        : "รวมวันฝึกอบรม:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle1}></TextInput>

                    <Divider
                      style={{
                        paddingBottom: 1,
                        marginTop: 15,
                        marginBottom: 15,
                      }}
                    />

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Pre-Requisities for Training:"
                        : "คุณสมบัติขั้นพื้นฐานเพื่อฝึกอบรม:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Expected Result of Training:"
                        : "ผลที่คาดว่าจะได้รับจากการฝึกอบรม:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Divider
                      style={{
                        paddingBottom: 1,
                        marginTop: 15,
                        marginBottom: 15,
                      }}
                    />

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Participant/Requeste:"
                        : "ผู้เข้าอบรม/ผู้ยื่นคำขอ:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "Date:" : "วันที่:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <View
                      style={{
                        marginVertical: 18,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Divider style={{ paddingBottom: 1, flex: 1 }} />
                      <Avatar.Icon
                        icon="check"
                        size={30}
                        style={{ backgroundColor: "#6c757d" }}
                      />
                      <Divider style={{ paddingBottom: 1, flex: 1 }} />
                    </View>

                    <Text>
                      {this.state.lang === "EN" ? "Approved:" : "อนุมัติโดย:"}{" "}
                    </Text>
                    <View style={styles.confirmStyle}>
                      <Divider
                        style={{ paddingBottom: 1, backgroundColor: "blue" }}
                      />
                      <View style={styles.textConfirm}>
                        <Text>Country Manager</Text>
                        <Text>ผู้จัดการ</Text>
                      </View>
                    </View>

                    <Text>Acknowledged By HR:</Text>
                    <View style={styles.confirmStyle}>
                      <Divider
                        style={{ paddingBottom: 1, backgroundColor: "blue" }}
                      />
                      <View style={styles.textConfirm}>
                        <Text>HR Training Coordinator</Text>
                        <Text>เจ้าหน้าที่</Text>
                      </View>
                    </View>

                    {/* ซ่อนได้ */}
                    <View style={styles.confirmStyle}>
                      <Divider
                        style={{ paddingBottom: 1, backgroundColor: "blue" }}
                      />
                      <View style={styles.textConfirm}>
                        <Text>Human Resources Manager</Text>
                        <Text>ผู้จัดการฝ่ายทรัพยากรบุคคล</Text>
                      </View>
                    </View>
                    {/* ซ่อนได้ */}
                  </View>
                </View>

                {/* <Pressable
                    style={{margin: 12,}}
                    onPress={() => this.setModalVisible(!modalVisible)}
                  >
                    <Text style={stylesdialog.textStyle}>
                      {this.state.lang === "EN" ? "Close" : "ปิด"}
                    </Text>
                  </Pressable>  */}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[stylesdialog.button, stylesdialog.buttonClose]}
                    onPress={() => this.setModalVisible(!modalVisible)}
                  >
                    <Text style={{ color: "white" }}>
                      {this.state.lang === "EN" ? "Close" : "ปิด"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* <Pressable
                    style={[stylesdialog.button, stylesdialog.buttonClose1]}
                    onPress={() => this.setModalVisible(!modalVisible)}
                  >
                    <Text style={stylesdialog.textStyle}>
                      {" "}
                      {this.state.lang === "EN" ? "Cancle" : "ยกเลิก"}
                    </Text>
                  </Pressable> */}
              </View>
            </View>
          </ScrollView>
        </Modal>
      </View>
    );
  }
  // มี 3 ช่อง ลายเซ็น

  // มี 4 ช่อง ลายเซ็น
  showdialog1() {
    const { modalVisible } = this.state;
    return (
      <View style={stylesdialog.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <ScrollView>
            <View style={stylesdialog.centeredView}>
              <View style={stylesdialog.modalView}>
                <View style={styles.containerSec1}>
                  <Text style={stylesdialog.modalText}>
                    {this.state.lang === "EN" ? "Track Status" : "ติดตามสถานะ"}
                  </Text>
                  <Text style={stylesdialog.modalText1}>
                    {this.state.lang === "EN"
                      ? "Exotheran Thailand Co., Ltd."
                      : "บริษัทเอ็กซ์เธอร์แลน ประเทศไทย จำกัด"}
                  </Text>
                  <Text style={stylesdialog.modalText2}>Training Request</Text>

                  <Divider
                    style={{
                      paddingBottom: 1,
                      marginTop: 15,
                      marginBottom: 15,
                    }}
                  />

                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "space-around",
                      // paddingVertical: 24,
                      // marginBottom: 20,
                    }}
                  >
                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "First Name:" : "ชื่อ:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Last Name:"
                        : "นามสกุล:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "Position:" : "ตำแหน่ง:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "Dept:" : "แผนก:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <View
                      style={{
                        marginVertical: 18,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Divider style={{ paddingBottom: 1, flex: 1 }} />
                      <Avatar.Icon
                        icon="arrow-down"
                        size={30}
                        style={{ backgroundColor: "#6c757d" }}
                      />
                      <Divider style={{ paddingBottom: 1, flex: 1 }} />
                    </View>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Expense (excluded vat):"
                        : "ค่าใช้จ่ายต่อบุคคล (ไม่รวมภาษี):"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Name of Course:"
                        : "ชื่อหลักสูตร:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Start Date:"
                        : "วันที่เริ่มฝึกอบรม:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "End Date:"
                        : "วันที่สิ้นสุดฝึกอบรม:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Total:"
                        : "รวมวันฝึกอบรม:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle1}></TextInput>

                    <Divider
                      style={{
                        paddingBottom: 1,
                        marginTop: 15,
                        marginBottom: 15,
                      }}
                    />

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Pre-Requisities for Training:"
                        : "คุณสมบัติขั้นพื้นฐานเพื่อฝึกอบรม:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Expected Result of Training:"
                        : "ผลที่คาดว่าจะได้รับจากการฝึกอบรม:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Divider
                      style={{
                        paddingBottom: 1,
                        marginTop: 15,
                        marginBottom: 15,
                      }}
                    />

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Participant/Requeste:"
                        : "ผู้เข้าอบรม/ผู้ยื่นคำขอ:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "Date:" : "วันที่:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <View
                      style={{
                        marginVertical: 18,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Divider style={{ paddingBottom: 1, flex: 1 }} />
                      <Avatar.Icon
                        icon="check"
                        size={30}
                        style={{ backgroundColor: "#6c757d" }}
                      />
                      <Divider style={{ paddingBottom: 1, flex: 1 }} />
                    </View>

                    <Text>
                      {this.state.lang === "EN" ? "Approved:" : "อนุมัติโดย:"}{" "}
                    </Text>
                    <View style={styles.confirmStyle}>
                      <Divider
                        style={{ paddingBottom: 1, backgroundColor: "blue" }}
                      />
                      <View style={styles.textConfirm}>
                        <Text>Particlapant's Supervisor</Text>
                        <Text>ผู้บังคับบัญชาของผู้เข้าฝึกอบรม</Text>
                      </View>
                    </View>

                    <View style={styles.confirmStyle}>
                      <Divider
                        style={{ paddingBottom: 1, backgroundColor: "blue" }}
                      />
                      <View style={styles.textConfirm}>
                        <Text>Country Manager</Text>
                        <Text>ผู้จัดการ</Text>
                      </View>
                    </View>

                    <Text>Acknowledged By HR:</Text>
                    <View style={styles.confirmStyle}>
                      <Divider
                        style={{ paddingBottom: 1, backgroundColor: "blue" }}
                      />
                      <View style={styles.textConfirm}>
                        <Text>HR Training Coordinator</Text>
                        <Text>เจ้าหน้าที่</Text>
                      </View>
                    </View>

                    <View style={styles.confirmStyle}>
                      <Divider
                        style={{ paddingBottom: 1, backgroundColor: "blue" }}
                      />
                      <View style={styles.textConfirm}>
                        <Text>Human Resources Manager</Text>
                        <Text>ผู้จัดการฝ่ายทรัพยากรบุคคล</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[stylesdialog.button, stylesdialog.buttonClose]}
                    onPress={() => this.setModalVisible(!modalVisible)}
                  >
                    <Text style={{ color: "white" }}>
                      {this.state.lang === "EN" ? "Close" : "ปิด"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </View>
    );
  }
  // มี 4 ช่อง ลายเซ็น

  // มี 2 ช่อง ลายเซ็น Flight
  showdialog2() {
    const { modalVisible } = this.state;
    return (
      <View style={stylesdialog.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <ScrollView>
            <View style={stylesdialog.centeredView}>
              <View style={stylesdialog.modalView}>
                <View style={styles.containerSec1}>
                  <Text style={stylesdialog.modalText}>
                    {this.state.lang === "EN"
                      ? "Booking Request"
                      : "ใบคำขอ Booking"}
                  </Text>
                  <Text style={stylesdialog.modalText1}>
                    {this.state.lang === "EN"
                      ? "Exotheran Thailand Co., Ltd."
                      : "บริษัทเอ็กซ์เธอร์แลน ประเทศไทย จำกัด"}
                  </Text>
                  <Text style={stylesdialog.modalText2}>Booking Request</Text>

                  <Divider
                    style={{
                      paddingBottom: 1,
                      marginTop: 15,
                      marginBottom: 15,
                    }}
                  />

                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "space-around",
                      // paddingVertical: 24,
                      // marginBottom: 20,
                    }}
                  >
                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "First Name:" : "ชื่อ:"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Last Name:"
                        : "นามสกุล:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "ID No:" : "เลขบัตรประชาชน:"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Phone No:"
                        : "เบอร์โทรศัพท์:"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "Birthday:" : "วันเกิด:"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "Province:" : "จังหวัด:"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Purpose:"
                        : "วัตถุประสงค์ในการเดินทาง:"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <View
                      style={{
                        marginVertical: 18,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Divider style={{ paddingBottom: 1, flex: 1 }} />
                      <Avatar.Icon
                        icon="check"
                        size={30}
                        style={{ backgroundColor: "#6c757d" }}
                      />
                      <Divider style={{ paddingBottom: 1, flex: 1 }} />
                    </View>

                    <Text>
                      {this.state.lang === "EN" ? "Approved:" : "อนุมัติโดย:"}{" "}
                    </Text>
                    <View style={styles.confirmStyle}>
                      <Divider
                        style={{ paddingBottom: 1, backgroundColor: "blue" }}
                      />
                      <View style={styles.textConfirm}>
                        <Text>Particlapant's Supervisor</Text>
                        <Text>ผู้บังคับบัญชาของผู้เข้าฝึกอบรม</Text>
                      </View>
                    </View>

                    <Text>Acknowledged By HR:</Text>
                    <View style={styles.confirmStyle}>
                      <Divider
                        style={{ paddingBottom: 1, backgroundColor: "blue" }}
                      />
                      <View style={styles.textConfirm}>
                        <Text>Human Resources Manager</Text>
                        <Text>ผู้จัดการฝ่ายทรัพยากรบุคคล</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[stylesdialog.button, stylesdialog.buttonClose]}
                    onPress={() => this.setModalVisible(!modalVisible)}
                  >
                    <Text style={{ color: "white" }}>
                      {this.state.lang === "EN" ? "Close" : "ปิด"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </View>
    );
  }
  // มี 2 ช่อง ลายเซ็น Flight

  // มี 2 ช่อง ลายเซ็น Accom
  showdialog3() {
    const { modalVisible } = this.state;
    return (
      <View style={stylesdialog.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <ScrollView>
            <View style={stylesdialog.centeredView}>
              <View style={stylesdialog.modalView}>
                <View style={styles.containerSec1}>
                  <Text style={stylesdialog.modalText}>
                    {this.state.lang === "EN"
                      ? "Booking Request"
                      : "ใบคำขอ Booking"}
                  </Text>
                  <Text style={stylesdialog.modalText1}>
                    {this.state.lang === "EN"
                      ? "Exotheran Thailand Co., Ltd."
                      : "บริษัทเอ็กซ์เธอร์แลน ประเทศไทย จำกัด"}
                  </Text>
                  <Text style={stylesdialog.modalText2}>Booking Request</Text>

                  <Divider
                    style={{
                      paddingBottom: 1,
                      marginTop: 15,
                      marginBottom: 15,
                    }}
                  />

                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "space-around",
                      // paddingVertical: 24,
                      // marginBottom: 20,
                    }}
                  >
                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "First Name:" : "ชื่อ:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Last Name:"
                        : "นามสกุล:"}{" "}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "ID No:" : "เลขบัตรประชาชน:"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Phone No:"
                        : "เบอร์โทรศัพท์:"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "Province:" : "จังหวัด:"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "District:" : "อำเภอ"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "Subdistrict:" : "ตำบล"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN" ? "Zip:" : "รหัสไปรษณีย์"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Purpose:"
                        : "วัตถุประสงค์ในการเดินทาง"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {" "}
                      {this.state.lang === "EN"
                        ? "Other Purpose:"
                        : "วัตถุประสงค์ในการเดินทาง อื่นๆ"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <View
                      style={{
                        marginVertical: 18,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Divider style={{ paddingBottom: 1, flex: 1 }} />
                      <Avatar.Icon
                        icon="arrow-down"
                        size={30}
                        style={{ backgroundColor: "#6c757d" }}
                      />
                      <Divider style={{ paddingBottom: 1, flex: 1 }} />
                    </View>

                    <Text>
                      {this.state.lang === "EN" ? "Province:" : "จังหวัด:"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {this.state.lang === "EN"
                        ? "Accommodation (Province, Hotel name):"
                        : "ที่พัก (จังหวัดชื่อโรงแรม):"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {this.state.lang === "EN"
                        ? "Check in date(D/M/Y):"
                        : "เช็คอิน:"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {this.state.lang === "EN"
                        ? "Check out date(D/M/Y):"
                        : "เช็คเอาต์:"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    {/* เพิ่มการจองได้เรื่อยๆ */}
                    <Divider
                      style={{
                        paddingBottom: 1,
                        marginTop: 15,
                        marginBottom: 15,
                      }}
                    />

                    <Text>
                      {this.state.lang === "EN" ? "Province:" : "จังหวัด:"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {this.state.lang === "EN"
                        ? "Accommodation (Province, Hotel name):"
                        : "ที่พัก (จังหวัดชื่อโรงแรม):"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {this.state.lang === "EN"
                        ? "Check in date(D/M/Y):"
                        : "เช็คอิน:"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>

                    <Text>
                      {this.state.lang === "EN"
                        ? "Check out date(D/M/Y):"
                        : "เช็คเอาต์:"}
                    </Text>
                    <TextInput style={styles.inputStyle}></TextInput>
                    {/* เพิ่มการจองได้เรื่อยๆ */}

                    <View
                      style={{
                        marginVertical: 18,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Divider style={{ paddingBottom: 1, flex: 1 }} />
                      <Avatar.Icon
                        icon="check"
                        size={30}
                        style={{ backgroundColor: "#6c757d" }}
                      />
                      <Divider style={{ paddingBottom: 1, flex: 1 }} />
                    </View>

                    <Text>
                      {this.state.lang === "EN" ? "Approved:" : "อนุมัติโดย:"}{" "}
                    </Text>
                    <View style={styles.confirmStyle}>
                      <Divider
                        style={{ paddingBottom: 1, backgroundColor: "blue" }}
                      />
                      <View style={styles.textConfirm}>
                        <Text>Particlapant's Supervisor</Text>
                        <Text>ผู้บังคับบัญชาของผู้เข้าฝึกอบรม</Text>
                      </View>
                    </View>

                    <Text>Acknowledged By HR:</Text>
                    <View style={styles.confirmStyle}>
                      <Divider
                        style={{ paddingBottom: 1, backgroundColor: "blue" }}
                      />
                      <View style={styles.textConfirm}>
                        <Text>Human Resources Manager</Text>
                        <Text>ผู้จัดการฝ่ายทรัพยากรบุคคล</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[stylesdialog.button, stylesdialog.buttonClose]}
                    onPress={() => this.setModalVisible(!modalVisible)}
                  >
                    <Text style={{ color: "white" }}>
                      {this.state.lang === "EN" ? "Close" : "ปิด"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </View>
    );
  }
  // มี 2 ช่อง ลายเซ็น Accom

    // มี 2 ช่อง ลายเซ็น Ground
    showdialog4() {
      const { modalVisible } = this.state;
      return (
        <View style={stylesdialog.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              this.setModalVisible(!modalVisible);
            }}
          >
            <ScrollView>
              <View style={stylesdialog.centeredView}>
                <View style={stylesdialog.modalView}>
                  <View style={styles.containerSec1}>
                    <Text style={stylesdialog.modalText}>
                      {this.state.lang === "EN"
                        ? "Booking Request"
                        : "ใบคำขอ Booking"}
                    </Text>
                    <Text style={stylesdialog.modalText1}>
                      {this.state.lang === "EN"
                        ? "Exotheran Thailand Co., Ltd."
                        : "บริษัทเอ็กซ์เธอร์แลน ประเทศไทย จำกัด"}
                    </Text>
                    <Text style={stylesdialog.modalText2}>Booking Request</Text>
  
                    <Divider
                      style={{
                        paddingBottom: 1,
                        marginTop: 15,
                        marginBottom: 15,
                      }}
                    />
  
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "space-around",
                        // paddingVertical: 24,
                        // marginBottom: 20,
                      }}
                    >
                      <Text>
                        {" "}
                        {this.state.lang === "EN" ? "First Name:" : "ชื่อ:"}{" "}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
  
                      <Text>
                        {" "}
                        {this.state.lang === "EN"
                          ? "Last Name:"
                          : "นามสกุล:"}{" "}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
  
                      <Text>
                        {" "}
                        {this.state.lang === "EN" ? "ID No:" : "เลขบัตรประชาชน:"}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
  
                      <Text>
                        {" "}
                        {this.state.lang === "EN"
                          ? "Phone No:"
                          : "เบอร์โทรศัพท์:"}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
  
                      <Text>
                        {" "}
                        {this.state.lang === "EN" ? "Resident:" : "ที่อยู่:"}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>

                      <Text>
                        {" "}
                        {this.state.lang === "EN" ? "Province:" : "จังหวัด:"}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
  
                      <Text>
                        {" "}
                        {this.state.lang === "EN" ? "District:" : "อำเภอ"}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
  
                      <Text>
                        {" "}
                        {this.state.lang === "EN" ? "Subdistrict:" : "ตำบล"}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
  
                      <Text>
                        {" "}
                        {this.state.lang === "EN" ? "Zip:" : "รหัสไปรษณีย์"}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
  
                      <View
                        style={{
                          marginVertical: 18,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Divider style={{ paddingBottom: 1, flex: 1 }} />
                        <Avatar.Icon
                          icon="arrow-down"
                          size={30}
                          style={{ backgroundColor: "#6c757d" }}
                        />
                        <Divider style={{ paddingBottom: 1, flex: 1 }} />
                      </View>
  
                      <Text>
                        {this.state.lang === "EN" ? "Date:" : "วันออกเดินทาง:"}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
  
                      <Text>
                        {this.state.lang === "EN"
                          ? "Time:"
                          : "เวลาเดินทาง:"}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
  
                      <Text>
                        {this.state.lang === "EN"
                          ? "From:"
                          : "ต้นทาง:"}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
  
                      <Text>
                        {this.state.lang === "EN"
                          ? "To:"
                          : "ปลายทาง:"}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
  
                      {/* เพิ่มการจองได้เรื่อยๆ */}
                      <Divider
                        style={{
                          paddingBottom: 1,
                          marginTop: 15,
                          marginBottom: 15,
                        }}
                      />
  
  <Text>
                        {this.state.lang === "EN" ? "Date:" : "วันออกเดินทาง:"}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
  
                      <Text>
                        {this.state.lang === "EN"
                          ? "Time:"
                          : "เวลาเดินทาง:"}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
  
                      <Text>
                        {this.state.lang === "EN"
                          ? "From:"
                          : "ต้นทาง:"}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
  
                      <Text>
                        {this.state.lang === "EN"
                          ? "To:"
                          : "ปลายทาง:"}
                      </Text>
                      <TextInput style={styles.inputStyle}></TextInput>
                      {/* เพิ่มการจองได้เรื่อยๆ */}
  
                      <View
                        style={{
                          marginVertical: 18,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Divider style={{ paddingBottom: 1, flex: 1 }} />
                        <Avatar.Icon
                          icon="check"
                          size={30}
                          style={{ backgroundColor: "#6c757d" }}
                        />
                        <Divider style={{ paddingBottom: 1, flex: 1 }} />
                      </View>
  
                      <Text>
                        {this.state.lang === "EN" ? "Approved:" : "อนุมัติโดย:"}{" "}
                      </Text>
                      <View style={styles.confirmStyle}>
                        <Divider
                          style={{ paddingBottom: 1, backgroundColor: "blue" }}
                        />
                        <View style={styles.textConfirm}>
                          <Text>Particlapant's Supervisor</Text>
                          <Text>ผู้บังคับบัญชาของผู้เข้าฝึกอบรม</Text>
                        </View>
                      </View>
  
                      <Text>Acknowledged By HR:</Text>
                      <View style={styles.confirmStyle}>
                        <Divider
                          style={{ paddingBottom: 1, backgroundColor: "blue" }}
                        />
                        <View style={styles.textConfirm}>
                          <Text>Human Resources Manager</Text>
                          <Text>ผู้จัดการฝ่ายทรัพยากรบุคคล</Text>
                        </View>
                      </View>
                    </View>
                  </View>
  
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[stylesdialog.button, stylesdialog.buttonClose]}
                      onPress={() => this.setModalVisible(!modalVisible)}
                    >
                      <Text style={{ color: "white" }}>
                        {this.state.lang === "EN" ? "Close" : "ปิด"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </Modal>
        </View>
      );
    }
    // มี 2 ช่อง ลายเซ็น Ground

  render() {
    return (
      <View style={styles.background}>
        <ScrollView>
          <View>
            <Modal visible={this.state.modalVisible} style={{ width: "80%" }}>
              {/* {modalContent(trainingRequestData)} */}
              <Button
                title="close"
                type="outline"
                // onPress={() => setModalVisible(false)}
              />
            </Modal>
          </View>
          <View style={styles.container}>
            <View style={{ paddingTop: 20 }}>
              <View
                style={{ justifyContent: "space-evenly", alignItems: "center" }}
              >
                <Text style={styles.titleStyle}>
                  {this.state.lang === "EN"
                    ? "Training request status"
                    : "สถานะใบคำร้องขอฝึกอบรม"}
                </Text>
              </View>
              <View>
                <View style={styles.container1}>
                  {/* <View style={styles.container}> */}
                  <DataTable style={{ borderWidth: 1 }}>
                    <DataTable.Header>
                      <DataTable.Title>
                        <Text style={{ textAlign: "center" }}>No</Text>
                      </DataTable.Title>
                      <DataTable.Title>
                        <Text style={{ textAlign: "center" }}>หลักสูตร</Text>
                      </DataTable.Title>
                      <DataTable.Title>
                        <Text
                          style={{ textAlign: "center", paddingHorizontal: 2 }}
                        >
                          ติดตามสถานะ
                        </Text>
                      </DataTable.Title>
                      <DataTable.Title>
                        <Text
                          style={{ textAlign: "center", paddingHorizontal: 2 }}
                        >
                          สถานะการอนุมัติ
                        </Text>
                      </DataTable.Title>
                      <DataTable.Title>
                        <Text style={{ textAlign: "center" }}>พิมพ์</Text>
                      </DataTable.Title>
                    </DataTable.Header>
                    {this.state.training_request_status.map((data, index) => {
                      return (
                        <DataTable.Row>
                          <DataTable.Cell style={{ textAlign: "center" }}>
                            {index + 1}
                          </DataTable.Cell>
                          <DataTable.Cell style={{ textAlign: "center" }}>
                            {data.course_title}
                          </DataTable.Cell>
                          <DataTable.Cell>
                            <IconButton
                              icon="menu"
                              color={Colors.green500}
                              size={40}
                              onPress={(index) => this.setModalVisible(true)}
                            />
                          </DataTable.Cell>
                          <DataTable.Cell>
                            {this.checkStatus(data.request_status)}
                          </DataTable.Cell>
                          <DataTable.Cell>
                            {" "}
                            <IconButton
                              icon="printer"
                              color={Colors.red500}
                              size={30}
                              onPress={() => Alert.alert("อยู่ระหว่างการพัฒนา")}
                            />
                          </DataTable.Cell>
                        </DataTable.Row>
                      );
                    })}

                    <DataTable.Pagination
                      page={this.state.page}
                      numberOfPages={5}
                      onPageChange={(page) => this.setState({ page: page })}
                      label="1-2 of 6"
                      optionsPerPage={this.state.optionsPerPage}
                      itemsPerPage={this.state.itemsPerPage}
                      setItemsPerPage={this.state.setItemsPerPage}
                      showFastPagination
                      optionsLabel={"Rows per page"}
                    />
                  </DataTable>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.container}>
            <View style={{ paddingTop: 20 }}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={styles.titleStyle}>สถานะการอนุมัติ Booking</Text>
              </View>
              <View>
                <View style={styles.container}>
                  <DataTable>
                    <DataTable.Header>
                      <DataTable.Title>No</DataTable.Title>
                      <DataTable.Title>หลักสูตร</DataTable.Title>
                      <DataTable.Title>ติดตามสถานะ</DataTable.Title>
                      <DataTable.Title>สถานะการอนุมัติ</DataTable.Title>
                      <DataTable.Title>พิมพ์</DataTable.Title>
                    </DataTable.Header>

                    {this.state.training_request_status.map((data, index) => {
                      return (
                        <DataTable.Row>
                          <DataTable.Cell>{index + 1}</DataTable.Cell>
                          <DataTable.Cell>{data.course_title}</DataTable.Cell>
                          <DataTable.Cell>
                            <IconButton
                              icon="menu"
                              color={Colors.red500}
                              size={30}
                              onPress={() => Alert.alert("อยู่ระหว่างการพัฒนา")}
                            />
                          </DataTable.Cell>
                          <DataTable.Cell>
                            {this.checkStatus(data.request_status)}
                          </DataTable.Cell>
                          <DataTable.Cell>
                            {" "}
                            <IconButton
                              icon="printer"
                              color={Colors.red500}
                              size={30}
                              onPress={() => Alert.alert("อยู่ระหว่างการพัฒนา")}
                            />
                          </DataTable.Cell>
                        </DataTable.Row>
                      );
                    })}

                    <DataTable.Pagination
                      page={this.state.page}
                      numberOfPages={5}
                      onPageChange={(page) => this.setState({ page: page })}
                      label="1-2 of 6"
                      optionsPerPage={this.state.optionsPerPage}
                      itemsPerPage={this.state.itemsPerPage}
                      setItemsPerPage={this.state.setItemsPerPage}
                      showFastPagination
                      optionsLabel={"Rows per page"}
                    />
                  </DataTable>
                </View>
              </View>
            </View>
          </View>
          {/* ส่วน showdialog */}
          <View>{this.showdialog()}</View>
          {/* จบส่วน showdialog*/}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    paddingTop: 20,
    marginHorizontal: 8,
  },
  container1: {
    paddingTop: 20,
    marginHorizontal: 1,
  },
  containerSec1: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 18,
  },
  titleStyle: {
    fontWeight: "bold",
  },
  textInputThai: {
    color: "grey",
  },
  backgroundTable: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  head: {
    height: 36,
  },
  text: {
    margin: 4,
    fontSize: 12,
    alignSelf: "center",
  },
  noneDataStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: -1,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  modalContainer: {
    padding: 20,
    alignItems: "center",
  },
  divider: {
    width: "100%",
    height: 2,
    backgroundColor: "#DCDCDC",
    marginVertical: 16,
  },
  textInput: {
    width: WIDTH * (80 / 100),
    height: HEIGHT * (6 / 100),
    marginVertical: 16,
  },
  inputStyle: {
    backgroundColor: "#DCDCDC",
    borderRadius: 15,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  inputStyle1: {
    borderRadius: 15,
    backgroundColor: "#DCDCDC",
    borderWidth: 1,
    height: HEIGHT / 20,
    width: WIDTH * (80 / 100),
    marginTop: 10,
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  textInputTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginVertical: 8,
  },
  statusText: {
    alignSelf: "center",
  },
  buttonContainer: {
    alignSelf: "center",
    justifyContent: "center",
    // paddingTop: 20,
    width: "30%",
    borderRadius: 4,
    marginTop: 28,
  },
  btnConfirmStyle: {
    backgroundColor: "#3bb54a",
    padding: 8,
    alignItems: "center",
    borderRadius: 16,
  },
  confirmStyle: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
  },
  textConfirm: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
});
const stylesdialog = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#3bb54a",
  },
  buttonClose1: {
    backgroundColor: "#6c757d",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  },
  modalText1: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 18,
    color: "#398DDD",
    fontWeight: "bold",
  },
  modalText2: {
    // marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
});

