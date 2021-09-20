import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
  AsyncStorage,
  Pressable,
  Modal,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import React, { Component, createRef } from "react";
import { Avatar } from "react-native-paper";
import { CheckBox, Divider } from "react-native-elements";
import { Button, Label, Picker, Row } from "native-base";
import { httpClient } from "../../core/HttpClient";
import { TouchableOpacity } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { now } from "moment";
import Icon from "react-native-vector-icons/FontAwesome";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Rows, Table } from "react-native-table-component";

import "intl";
import "intl/locale-data/jsonp/en";
import RadioForm from "react-native-simple-radio-button";

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

var radio_props = [
  { label: "BBS พฤติกรรม", value: 0 },
  { label: "SWA การหยุดงาน", value: 1 },
  { label: "HazOb รายงานความสภาพเสี่ยงที่จะเกิดอุบัติภัย", value: 2 },
  {
    label: "Near Miss สภาพที่เป็นอันตราย/เหตุการณ์เกือบเกิดอุบัติเหตุ",
    value: 3
  },
  { label: "Other", value: 4 }
];
var radio_check = [
  { label: "Yes (ใช่)\t", value: 0 },
  { label: "No (ไม่)\t", value: 1 },
  { label: "N/A\t", value: 2 }
];
var dropdown_check = [
  { title: "Yes (ใช่)\t", id: 1 },
  { title: "No (ไม่)\t", id: 2 },
  { title: "N/A\t", id: 3 }
];
var situation = [
  { title: "No/ไม่ใช่", status: false },
  {
    title: "Yes/ใช่ (Please provide detail / กรุณาระบุรายละเอียดใน Other",
    status: false
  },
  { title: "Other", status: false }
];
const radio_severity = [
  { label: "Severe / ร้ายแรงที่สุด", value: 0 },
  { label: "Major / ร้ายแรงมาก", value: 1 },
  { label: "Serious / ร้ายแรง", value: 2 },
  { label: "Minor / ไม่ร้ายแรง", value: 3 },
  { label: "Incidental / เล็กน้อย", value: 4 }
];

const accounts = [
  { accNumber: "1.1 อยู่ในจุดอันตราย" },
  { accNumber: "1.2 สายตามองทางเดิน" },
  { accNumber: "1.3 สายตามองงานที่จะทำ" },
  { accNumber: "1.4 จุดที่อาจถูก หนีบ ตัด ดึง บาด" },
  { accNumber: "1.5 การขึ้นลงบันใดหรือทางต่างระดับ" },
  { accNumber: "2.1 การเคลื่อนย้ายวัสดุโดยการยก หย่อน ดัน หรือดึง" },
  { accNumber: "2.2 การบิดเอี้ยวตัว" },
  { accNumber: "2.3 การเอื้อม หยิบ จับสิ่งของ" },
  { accNumber: "3.1 การเลือกใช้เครื่องมืออุปกณ์" },
  { accNumber: "3.2 อุปกรณ์ป้องกัน กั้น แยก หรือเตือนภัย" },
  { accNumber: "4.1 การวางแผนและการบ่งชี้อันตรายในงาน" },
  { accNumber: "4.2 การปฏิบัติตามขั้นตอนระเบียบการปฏิบัติงาน" },
  { accNumber: "4.3 การตัดแยกระบบแหล่งพลังงาน" },
  { accNumber: "4.4 งานที่ก่อให้เกิดความร้อนและประกายไฟ" },
  { accNumber: "4.5 งานในที่อับอากาศ" },
  { accNumber: "4.7 การสื่อสารระหว่างเพื่อนร่วมงาน" },
  { accNumber: "5.1 ความมั่นคงแข็งเเรงของพื้นโครงสร้าง" },
  { accNumber: "5.2 ความสะอาดเรียบร้อย" },
  { accNumber: "5.3 แสงสว่างเพียงพอกับงาน" },
  { accNumber: "6.1 การหยุดพักระหว่างทำงานเป็นระยะ" },
  { accNumber: "6.2 ตำแหน่งของคอและหลัง" },
  { accNumber: "6.5 ตำแหน่งของไหล่" },
  { accNumber: "6.6 ตำแหน่งของการวางข้อมือและแขน" },
  { accNumber: "6.9 ตำแหน่งของการวางเท้า" },
  { accNumber: "7.1 การป้องกันการหกรั่วไหล" },
  { accNumber: "7.2 การจัดการกรณีมีการหกรั่วไหล" },
  { accNumber: "7.3 การจัดการของเสีย" },
  { accNumber: "8.1 อุปกรณ์ป้องกันศรีษะ" },
  { accNumber: "8.2 อุปกรณ์ป้องกันใบหน้าและตวงตา" },
  { accNumber: "8.3 อุปกรณ์ป้องกันหูและการได้ยิน" },
  { accNumber: "8.4 อุปกรณ์ป้องกันระบบทางเดินหายใจ" },
  { accNumber: "8.5 อุปกรณ์ป้องกันมือ" },
  { accNumber: "8.6 อุปกรณ์ป้องกันการตกจากที่สูง" },
  { accNumber: "8.7 ชุดปฏิบัติงาน" },
  { accNumber: "8.8 อุปกรณ์ชูชีพ" },
  { accNumber: "8.9 อุปกรณ์ป้องกันเท้า" },
  { accNumber: "9.2 เข็มขัดนิรภัย" },
  { accNumber: "9.3 อัตราความเร็ว" },
  { accNumber: "9.4 ระยะห่างระหว่างรถ" }
];
const radio_probability = [
  { label: "Frequent / เกิดขึ้นบ่อยมาก", value: 0 },
  { label: "Occational / เกิดได้บ่อยก", value: 1 },
  { label: "Seldom / นาน ๆ ครั้ง", value: 2 },
  { label: "Unlikely / มีโอกาสเกิดขึ้นน้อย", value: 3 },
  { label: "Remote / เกิดขึ้นได้ยากมาก", value: 4 }
];
const radio_BBS = [
  { label: "Safe \t", value: 0 },
  { label: "At risk \t", value: 1 },
  { label: "N/A \t", value: 2 }
];

const cataegery = [
  { title: "Aviation Operations / ปฏิบัติการอากาศยาน", status: false },
  { title: "Environment Impact / ผลกระทบต่อสิ่งแวดล้อม", status: false },
  { title: "Fire & Explosion / ไฟไหม้และการระเบิด", status: false },
  { title: "Injury & Illness / บาดเจ็บและการเจ็บป่วย", status: false },
  { title: "Marine Accident / อุบัติเหตุทางทะเล", status: false },
  { title: "Motor Vehicle Crash / อุบัติเหตุด้านยานพาหนะ", status: false },
  { title: "Policy, Law Non-Compliance / การละเมิดกฎฯ", status: false },
  { title: "Process Upset / ระบบกระบวนการผลิตขัดข้อง", status: false },
  { title: "Property, Equipment Damage / ทรัพย์สินเสียหาย", status: false },
  { title: "Splill or Release / การรั่วไหลของก๊าซและของแหลว", status: false },
  { title: "Other", status: false }
];
const relatedwith = [
  { title: "Chemical / สารเคมี", status: false },
  { title: "Electrical / ไฟฟ้า", status: false },
  { title: "Fall Hazard Management / การจัดการงานบนที่สูง", status: false },
  { title: "Houskeeping / ความเป็นระเบียบเรียบร้อย", status: false },
  { title: "Hygiene, Sanitation / อนามัยและความสะอาด", status: false },
  {
    title: "Labeling, Marketing & Signs / ฉลาก, เครื่องหมาย ป้าย",
    status: false
  },
  {
    title: "Lifting Appliances / อุปกรณ์การยก, ผูก และเคลื่อนย้าย",
    status: false
  },
  { title: "Mechanical / เครื่องจักรกล", status: false },
  { title: "PPE / อุปกรณ์ป้องกันอันตรายส่วนบุคคล", status: false },
  { title: "Safety, Life Saving Eqipment / อุปกรณ์ความปลอดภัย", status: false },
  { title: "Vehicles / ยานพาหนะ, การขนส่ง", status: false },
  {
    title: "Welding, Burning / งานเชื่อม. งานเกี่ยวกับความร้อน",
    status: false
  },
  {
    title: "Walking Surface, Railings, Ladders / ทางเดิน, บันได",
    status: false
  },
  { title: "Other", status: false }
];
export default class MainProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: "",
      lang: "",
      firstname: "",
      position: "",
      dept: "",
      lang_id: 1,
      expense: null,
      showinputExpense: true,
      showuninputExpense: false,
      startDate: "DD/MM/YYYY",
      isStart: false,
      isDatePickerVisible: false,
      location: [],
      location_seleced: "",
      sublocation: [],
      sublocation_seleced: "",
      reportype: -1,
      reportype_detail: "",
      profile: [],
      question: [],
      resumed: "",
      explain: "",
      explain: "",
      resolved: "",
      realproblem: "",
      loading: true
    };
  }

  async componentDidMount() {
    for (var index in cataegery) {
      cataegery[index].status = false;
    }
    for (var index in relatedwith) {
      relatedwith[index].status = false;
    }
    for (var index in situation) {
      situation[index].status = false;
    }
    let id = await AsyncStorage.getItem("userId");

    this.setState({
      user_id: id
    });
    const res = await AsyncStorage.getItem("language");
    if (res === "EN") {
      this.setState({ lang: "EN", lang_id: 1 });
    } else {
      this.setState({ lang: "TH", lang_id: 2 });
    }

    try {
      httpClient
        .get(`/Profile/getProfile/${id}`)
        .then((response) => {
          const result = response.data;
          this.setState({ loading: false });
          if (result != null) {
            this.setState({
              profile: result.profile[0],
              question: result.question,
              location: result.location
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      Alert.alert(err);
    }
  }

  formatDate = (date) => {
    let d = new Date(date),
      month = "" +( d.getMonth()+1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  showDatePicker = (props) => {
    this.setState({ isDatePickerVisible: true });
    if (props == "start") {
      this.setState({ isStart: true });
    }
  };
  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };
  handleConfirm = (dates) => {
    var date = this.formatDate(dates);

    if (this.state.isStart) {
      this.setState({
        startDate: date
      });
    }

    this.hideDatePicker();
  };
  onPressSend = () => {
    const {
      user_id,
      location_seleced,
      sublocation_seleced,
      reportype,
      reportype_detail,
      startDate,
      question
    } = this.state;
    if (startDate === "DD/MM/YYYY") {
      Alert.alert(
        this.lang == "EN" ? "Please select date " : "กรุณาเลือกวันที่"
      );
    } else if (location_seleced == "" || location_seleced == null) {
      Alert.alert(
        this.lang == "EN"
          ? "Please select location "
          : "กรุณาเลือกสถานที่พบเหตุการณ์"
      );
    } else if (sublocation_seleced == "" || sublocation_seleced == null) {
      Alert.alert(
        this.lang == "EN"
          ? "Please select sub location "
          : "กรุณาเลือกบริเวณที่พบเหตุการณ์"
      );
    } else if (reportype == -1) {
      Alert.alert(
        this.lang == "EN"
          ? "Please select repory type "
          : "กรุณาเลือกประเภทการรายงาน" + reportype
      );
    } else if (
      reportype == 4 &&
      (reportype_detail == "" || reportype_detail == null)
    ) {
      Alert.alert(
        this.lang == "EN" ? "Please enter report  " : "กรุณาป้อนประเภทการรายงาน"
      );
    } else {
      const datahead = {
        user_id,
        location_seleced,
        sublocation_seleced,
        reportype: reportype + 1,
        reportype_detail
      };
      let data = [];
      if (reportype == 0 || reportype == 4) {
        data = question.slice(0, 44);
        let errors = false;
        let index = 0;
        let ends = data.length - 1;
        do {
          let item = data[index];
          if (item == data[0] || item == data[1] || item == data[2]) {
            if (
              item.question_type == 1 ||
              item.question_type == 2 ||
              item.question_type == 6
            ) {
              if (!item.answer_detail || item.answer_detail == "") {
                errors = !errors;
                Alert.alert(
                  this.lang == "EN"
                    ? "Please enter  " + item.question_name
                    : "กรุณาอธิบายรายละเอียด " + item.question_name
                );
              }
            } else {
              if (!item.answer_id || item.answer_id == "") {
                errors = !errors;
                Alert.alert(
                  this.lang == "EN"
                    ? "Please select  " + item.question_name
                    : "กรุณาเลือกรายการ " + item.question_name
                );
              }
            }
          }

          index++;
        } while (!errors && index <= ends);
        if (!errors && index >= ends) {
          let senddata = [];
          senddata.push(datahead);
          senddata.push(data);
          this.sentNow(senddata);
        }
      } else if (reportype == 1) {
        data = question.slice(44, 52);
        let errors = false;
        let index = 0;
        let ends = data.length - 1;
        do {
          let item = data[index];

          if (
            item.question_type == 1 ||
            item.question_type == 2 ||
            item.question_type == 6
          ) {
            if (
              !item.answer_detail ||
              item.answer_detail == "" ||
              item.answer_detail == null
            ) {
              errors = !errors;
              Alert.alert(
                this.lang == "EN"
                  ? "Please enter  " + item.question_name
                  : "กรุณาอธิบายรายละเอียด " + item.question_name
              );
            }
          } else {
            if (!item.answer_id || item.answer_id == "") {
              errors = !errors;
              Alert.alert(
                this.lang == "EN"
                  ? "Please select  " + item.question_name
                  : "กรุณาเลือกรายการ " + item.question_name
              );
            }
          }

          index++;
        } while (!errors && index <= ends);
        if (!errors && index >= ends) {
          let senddata = [];
          senddata.push(datahead);
          senddata.push(data);
          this.sentNow(senddata);
        }
      } else if (reportype == 2 || reportype == 3) {
        data = question.slice(52);
        let errors = false;
        let index = 0;
        let ends = data.length - 1;

        do {
          let item = data[index];
          if (item != data[1] && item != data[3] && item != data[ends - 1]) {
            if (
              item.question_type == 1 ||
              item.question_type == 2 ||
              item.question_type == 6
            ) {
              if (!item.answer_detail || item.answer_detail == "") {
                errors = !errors;
                Alert.alert(
                  this.lang == "EN"
                    ? "Please enter  " + item.question_name
                    : "กรุณาอธิบายรายละเอียด " + item.question_name
                );
              }
            } else {
              if (item == data[0] || item == data[2]) {
                if (item.answer_id) {
                  let checks = false;
                  for (var a of item.answer_id) {
                    if (a.status == true) {
                      checks = true;
                    }
                  }
                  if (checks == false) {
                    errors = !errors;
                    Alert.alert(
                      this.lang == "EN"
                        ? "Please select  " + item.question_name
                        : "กรุณาเลือกรายการ " + item.question_name
                    );
                  } else {
                    if (
                      item.answer_id[item.answer_id.length - 1].status == true
                    ) {
                      if (
                        !data[index + 1].answer_detail ||
                        data[index + 1].answer_detail == ""
                      ) {
                        errors = !errors;
                        Alert.alert(
                          this.lang == "EN"
                            ? "Please enter  " + data[index + 1].question_name
                            : "กรุณาอธิบายรายละเอียด " +
                                data[index + 1].question_name
                        );
                      }
                    }
                  }
                } else {
                  errors = !errors;
                  Alert.alert(
                    this.lang == "EN"
                      ? "Please select  " + item.question_name
                      : "กรุณาเลือกรายการ " + item.question_name
                  );
                }
              } else if (!item.answer_id || item.answer_id == "") {
                errors = !errors;
                Alert.alert(
                  this.lang == "EN"
                    ? "Please select  " + item.question_name
                    : "กรุณาเลือกรายการ " + item.question_name
                );
              }
            }
          }
          index++;
        } while (!errors && index <= ends);
        if (!errors && index >= ends) {
          let senddata = [];
          senddata.push(datahead);
          senddata.push(data);
          this.sentNow(senddata);
        }
      }
    }
  };
  sentNow = (senddata) => {
    Alert.alert(
      this.state.lang === "EN" ? "Alert" : "แจ้งเตือน",
      this.state.lang === "EN" ? "Confirm" : "ยืนยัน",
      [
        {
          text: this.state.lang === "EN" ? "CANCEL" : "ยกเลิก",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        ,
        {
          text: this.state.lang === "EN" ? "OK" : "ตกลง",
          onPress: () => {
            httpClient
              .post(`/Profile/InsertInfomotionReport`, senddata)
              .then((response) => {
                const result = response.data;

                if (result === true) {
                  Alert.alert(
                    this.state.lang === "EN" ? "Alert" : "แจ้งเตือน",
                    this.state.lang === "EN" ? "Success" : "สำเร็จ",
                    [
                      {
                        text: this.state.lang === "EN" ? "OK" : "ตกลง",
                        onPress: this.props.navigation.goBack()
                      }
                    ],
                    { cancelable: false }
                  );
                } else {
                  Alert.alert(
                    this.state.lang === "EN"
                      ? `Can't save Form`
                      : "ไม่สามารถส่งแบบฟอร์มได้"
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      ]
    );
  };
  render() {
    if (this.state.loading) {
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
    let question = [...this.state.question];

    return (
      // <ScrollView style={{ backgroundColor: "#d9d9d9" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <View
          style={{
            flex: 1,
            borderWidth: 2,
            borderRadius: 12,
            marginTop: 20,
            borderColor: "white",
            backgroundColor: "white",
            marginHorizontal: 15,
            marginBottom: 20
          }}
        >
          <View style={styles.containerSec1}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#4393de",
                marginTop: 18,
                marginBottom: 15,
                alignSelf: "center"
              }}
            >
              แบบฟอร์มรายงาน
            </Text>

            <View>
              <Divider style={{ backgroundColor: "black", borderWidth: 2 }} />
            </View>

            {/* ส่วนที่1 */}
            <View style={{ margin: 20, marginHorizontal: 8 }}>
              <Text style={styles.textInputEng}>First name :</Text>
              <Text style={styles.textInputThai}>ชื่อ</Text>
              <TextInput
                style={styles.inputStyle}
                value={
                  this.state.lang === "EN"
                    ? this.state.profile.firstname_en
                    : this.state.profile.firstname
                }
              />

              <Text style={styles.textInputEng}>Last name:</Text>
              <Text style={styles.textInputThai}>นามสกุล</Text>
              <TextInput
                style={styles.inputStyle}
                value={
                  this.state.lang === "EN"
                    ? this.state.profile.lastname_en
                    : this.state.profile.lastname
                }
              />

              <Text style={styles.textInputEng}>Position :</Text>
              <Text style={styles.textInputThai}>ตำแหน่ง</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.profile.position_title}
              />

              <Text style={styles.textInputEng}>Dept :</Text>
              <Text style={styles.textInputThai}>แผนก</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.profile.dep_title}
              />
              <Text style={styles.textInputEng}>Staff's residence :</Text>
              <Text style={styles.textInputThai}>ที่พัก</Text>
              <TextInput style={styles.inputStyle} />
              <Text style={styles.textInputEng}>Work location :</Text>
              <Text style={styles.textInputThai}>สถาณที่ทำงาน</Text>
              <TextInput style={styles.inputStyle} />
            </View>

            <View
              style={{
                marginBottom: 10,
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
          </View>
          {/* ส่วนที่1 */}
          {/* ส่วนที่2 */}
          <View style={styles.containerSec2}>
            <View style={styles.contentInSec2}>
              <Text style={styles.textInputEng}>
                Observation date :<Text style={{ color: "red" }}>*</Text>
              </Text>
              <Text style={styles.textInputThai}>วันที่พบเห็น</Text>
              <TouchableOpacity onPress={() => this.showDatePicker("start")}>
                <View style={styles.inputDate}>
                  <Text style={{ paddingLeft: 10 }}>
                    {this.state.startDate}
                  </Text>
                </View>
              </TouchableOpacity>

              <DateTimePickerModal
                locale={this.state.lang == "EN" ? "en_EN" : "th_TH"}
                isVisible={this.state.isDatePickerVisible}
                mode="date"
                onConfirm={this.handleConfirm}
                onCancel={this.hideDatePicker}
              />
              <Text style={styles.textInputEng}>
                {" "}
                Location :<Text style={{ color: "red" }}>*</Text>
              </Text>
              <Text style={styles.textInputThai}>สถานที่พบเหตุการณ์</Text>

              <Picker
                mode="dropdown"
                iosIcon={
                  <Icon
                    name="angle-down"
                    style={{ width: "8%", paddingHorizontal: 2 }}
                  />
                }
                style={styles.inputLightStyle}
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.location_seleced}
                onValueChange={(t) => {
                  this.setState({
                    location_seleced: t,
                    sublocation_seleced: ""
                  });
                  if (t != "") {
                    try {
                      httpClient
                        .get(`/Profile/getSubLocation/${t}`)
                        .then((response) => {
                          const result = response.data;

                          if (result != null) {
                            this.setState({
                              sublocation: result
                            });
                          }
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    } catch (error) {}
                  }
                }}
                textStyle={{ fontSize: 14 }}
                placeholder={
                  this.state.lang === "EN"
                    ? "Please select location"
                    : "กรุณาเลือกสถานที่พบเหตุการณ์"
                }
              >
                <Picker.Item
                  label={"กรุณาเลือกสถานที่พบเหตุการณ์"}
                  value={""}
                />
                {this.state.location.map((data) => {
                  return (
                    <Picker.Item
                      label={data.work_location_ot}
                      value={data.id}
                    />
                  );
                })}
              </Picker>
              <Text style={styles.textInputEng}>
                Sub Location :<Text style={{ color: "red" }}>*</Text>
              </Text>
              <Text style={styles.textInputThai}>บริเวณที่พบเหตุการณ์</Text>

              <Picker
                mode="dropdown"
                iosIcon={
                  <Icon
                    name="angle-down"
                    style={{ width: "8%", paddingHorizontal: 2 }}
                  />
                }
                style={styles.inputLightStyle}
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.sublocation_seleced}
                onValueChange={(t) => this.setState({ sublocation_seleced: t })}
                textStyle={{ fontSize: 14 }}
              >
                <Picker.Item
                  label={"กรุณาเลือกสถานที่พบเหตุการณ์"}
                  value={""}
                />
                {this.state.sublocation.map((data) => {
                  return (
                    <Picker.Item
                      label={data.loca_ot_sub_title}
                      value={data.id}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
          {/* จบส่วนที่2 */}
          <View
            style={{
              marginVertical: 30,
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
          {/* ส่วนที่3  */}
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#4393de",
              marginBottom: 15,
              alignSelf: "center"
            }}
          >
            Report Type ประเภทของรายงาน
          </Text>
          <View style={styles.containerSec2}>
            <View style={styles.contentInSec2}>
              <Text style={styles.textInputEng}>
                What kind of report :<Text style={{ color: "red" }}> *</Text>
              </Text>
              <Text style={styles.textInputThai}>ประเภทของรายงาน</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 2,
                  marginBottom: 2
                }}
              >
                <RadioForm
                  radio_props={radio_props}
                  initial={-1}
                  onPress={(item) => {
                    this.setState({ reportype: item });
                  }}
                />
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    paddingVertical: 2,
                    margin: 4
                  }}
                ></View>
              </View>
              {this.state.reportype == 4 && (
                <TextInput
                  keyboardType="text"
                  value={this.state.reportype_detail}
                  style={styles.inputStyle1}
                  onChangeText={(t) => this.setState({ reportype_detail: t })}
                  placeholder="อธิบายรายละเอียด"
                />
              )}
            </View>
          </View>
          {/*  จบส่วนที่3 */}
          <View
            style={{
              marginVertical: 30,
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
          {/*ตัวเลือกที่ 1  */}
          {(this.state.reportype == 0 || this.state.reportype == 4) && (
            <View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#4393de",
                  marginBottom: 15,
                  alignSelf: "center"
                }}
              >
                BBS Observation การสังเกตพฤติกรรมความปลอดภัย
              </Text>
              <View style={styles.containerSec2}>
                <View style={styles.contentInSec2}>
                  <Text style={styles.textInputEng}>
                    7. Observation Detail :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}> เรื่องที่เจอ</Text>
                  <TextInput
                    keyboardType="text"
                    style={styles.inputStyle1}
                    onChangeText={(t) => {
                      let item = { ...question[0] };
                      item.answer_id = "";
                      item.answer_detail = t;
                      question[0] = item;

                      this.setState({ question });
                    }}
                    placeholder="อธิบายรายละเอียด"
                  />
                  <Text style={styles.textInputEng}>
                    8. Activated Stop Work :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    {" "}
                    ได้มีการหยุดงานหรือไม่
                  </Text>

                  <View style={styles.containerSec}>
                    <View>
                      <View style={{ marginVertical: 2, marginHorizontal: 24 }}>
                        <RadioForm
                          radio_props={radio_check}
                          formHorizontal={true}
                          initial={-1}
                          onPress={(t) => {
                            let item = { ...question[1] };
                            item.answer_id = t + 1;
                            item.answer_detail = "";
                            question[1] = item;

                            this.setState({ question });
                          }}
                        />
                      </View>
                    </View>
                  </View>
                  <Text style={styles.textInputEng}>
                    9. Recommendation for improvement :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    การแก้ไขเพื่อไม่ให้เกิดขึ้นอีก
                    หรือการสนับสนุนการปฏิบัติอย่างปลอดภัย
                  </Text>
                  <TextInput
                    keyboardType="text"
                    style={styles.inputStyle1}
                    onChangeText={(t) => {
                      let item = { ...question[2] };
                      item.answer_id = "";
                      item.answer_detail = t;
                      question[2] = item;

                      this.setState({ question });
                    }}
                    placeholder="อธิบายรายละเอียด"
                  />
                  <Text style={styles.textInputEng}>
                    10. Critical Behavior Inventory (CBI) 1-9 :
                  </Text>
                  <View style={styles.containerSec}>
                    {accounts.map((account, index) => {
                      return (
                        <View key={account.accNumber}>
                          <Text style={{ marginVertical: 10, paddingLeft: 8 }}>
                            {account.accNumber}
                          </Text>
                          <View
                            style={{ marginVertical: 2, marginHorizontal: 24 }}
                          >
                            <RadioForm
                              radio_props={radio_BBS}
                              formHorizontal={true}
                              initial={-1}
                              // onPress={(item) => this.onChange(index, item)}
                              onPress={(t) => {
                                let k = index + 3;
                                let item = { ...question[k] };
                                item.answer_id = t + 1;
                                item.answer_detail = "";
                                question[k] = item;

                                this.setState({ question });
                              }}
                            />
                          </View>
                        </View>
                      );
                    })}
                  </View>
                  <Text style={styles.textHead3}>11. Other/อื่นๆ</Text>
                  <View style={styles.containerSec}>
                    <View key={"อื่นๆ ระบุในข้อถัดไป"}>
                      <Text style={{ marginVertical: 10, paddingLeft: 8 }}>
                        {"อื่นๆ ระบุในข้อถัดไป"}
                      </Text>
                      <View style={{ marginVertical: 2, marginHorizontal: 24 }}>
                        <RadioForm
                          radio_props={radio_BBS}
                          formHorizontal={true}
                          initial={-1}
                          onPress={(t) => {
                            let item = { ...question[42] };
                            item.answer_id = t + 1;
                            item.answer_detail = "";
                            question[42] = item;

                            this.setState({ question });
                          }}
                        />
                      </View>
                    </View>
                    <Text style={styles.textInputEng}>12. Other :</Text>
                    <Text style={styles.textInputThai}>อื่นๆ</Text>
                    <TextInput
                      keyboardType="text"
                      style={styles.inputStyle1}
                      onChangeText={(t) => {
                        let item = { ...question[43] };
                        item.answer_id = "";
                        item.answer_detail = t;
                        question[43] = item;

                        this.setState({ question });
                      }}
                      placeholder="อธิบายรายละเอียด"
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
          {/* ตัวเลือกที่ 1 */}
          {/*ตัวเลือกที่ 2  */}
          {this.state.reportype == 1 && (
            <View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#4393de",
                  marginBottom: 15,
                  alignSelf: "center"
                }}
              >
                {
                  " Stop Work Authority/Responsibility (SWA/SWR) \n การใช้อำนาจในการหยุดงาน"
                }
              </Text>
              <View style={styles.containerSec2}>
                <View style={styles.contentInSec2}>
                  <Text style={styles.textInputEng}>
                    7. Stop Work Opportunity and Why :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    {" "}
                    อธิบายเหตุการณ์
                    การกระทำหรือสภาพการณ์ที่ไม่ปลอดภัยและการใช้อำนาจในการหยุดงาน
                  </Text>
                  <TextInput
                    keyboardType="text"
                    style={styles.inputStyle1}
                    onChangeText={(t) => {
                      let item = { ...question[44] };
                      item.answer_id = "";
                      item.answer_detail = t;
                      question[44] = item;

                      this.setState({ question });
                    }}
                    placeholder="อธิบายรายละเอียด"
                  />
                  <Text style={styles.textInputEng}>
                    8. Possible Consequences, if DO NOT STOP :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    {" "}
                    ผลกระทบต่อเนื่องที่อาจเกิดขึ้นตามมาถ้าไม่ใช้อำนาจในการหยุดงาน
                  </Text>
                  <TextInput
                    keyboardType="text"
                    style={styles.inputStyle1}
                    onChangeText={(t) => {
                      let item = { ...question[45] };
                      item.answer_id = "";
                      item.answer_detail = t;
                      question[45] = item;

                      this.setState({ question });
                    }}
                    placeholder="อธิบายรายละเอียด"
                  />
                  <Text style={styles.textInputEng}>
                    9. Comments/Responses :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>คำชี้แจงหรือการแก้ไข</Text>
                  <TextInput
                    keyboardType="text"
                    style={styles.inputStyle1}
                    onChangeText={(t) => {
                      let item = { ...question[46] };
                      item.answer_id = "";
                      item.answer_detail = t;
                      question[46] = item;

                      this.setState({ question });
                    }}
                    placeholder="อธิบายรายละเอียด"
                  />
                  <Text style={styles.textInputEng}>
                    10. Was work activity resumed? :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    มีการทำงานต่อ หลังจากหาแนวทางแก้ไขแล้วหรือไม่
                  </Text>
                  <Picker
                    mode="dropdown"
                    iosIcon={
                      <Icon
                        name="angle-down"
                        style={{ width: "8%", paddingHorizontal: 2 }}
                      />
                    }
                    style={styles.inputLightStyle}
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.resumed}
                    onValueChange={(t) => {
                      this.setState({ resumed: t });
                      let item = { ...question[47] };
                      item.answer_id = t;
                      item.answer_detail = "";
                      question[47] = item;

                      this.setState({ question });
                    }}
                    textStyle={{ fontSize: 14 }}
                    placeholder={
                      this.state.lang === "EN"
                        ? "Please select sub location"
                        : "โปรดเลือกคำตอบ"
                    }
                  >
                    {dropdown_check.map((data) => {
                      return <Picker.Item label={data.title} value={data.id} />;
                    })}
                  </Picker>

                  <Text style={styles.textInputEng}>
                    11. Was SWA valid (real problem)? :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    การหยุดงานครั้งนี้ถูกต้องแล้ว (มีปัญหาจริงหรือไม่)
                  </Text>

                  <Picker
                    mode="dropdown"
                    iosIcon={
                      <Icon
                        name="angle-down"
                        style={{ width: "8%", paddingHorizontal: 2 }}
                      />
                    }
                    style={styles.inputLightStyle}
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.realproblem}
                    onValueChange={(t) => {
                      this.setState({ realproblem: t });
                      let item = { ...question[48] };
                      item.answer_id = t;
                      item.answer_detail = "";
                      question[48] = item;

                      this.setState({ question });
                    }}
                    textStyle={{ fontSize: 14 }}
                    placeholder={
                      this.state.lang === "EN"
                        ? "Please select sub location"
                        : "โปรดเลือกคำตอบ"
                    }
                  >
                    {dropdown_check.map((data) => {
                      return <Picker.Item label={data.title} value={data.id} />;
                    })}
                  </Picker>
                  <Text style={styles.textInputEng}>
                    12. Was issue resolved? :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    มีการแก้ปัญหาเรียบร้อยแล้ว (หรือต้องทำในระยะยาว)
                  </Text>

                  <Picker
                    mode="dropdown"
                    iosIcon={
                      <Icon
                        name="angle-down"
                        style={{ width: "8%", paddingHorizontal: 2 }}
                      />
                    }
                    style={styles.inputLightStyle}
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.resolved}
                    onValueChange={(t) => {
                      this.setState({ resolved: t });
                      let item = { ...question[49] };
                      item.answer_id = t;
                      item.answer_detail = "";
                      question[49] = item;

                      this.setState({ question });
                    }}
                    textStyle={{ fontSize: 14 }}
                    placeholder={
                      this.state.lang === "EN"
                        ? "Please select sub location"
                        : "โปรดเลือกคำตอบ"
                    }
                  >
                    {dropdown_check.map((data) => {
                      return <Picker.Item label={data.title} value={data.id} />;
                    })}
                  </Picker>
                  <Text style={styles.textInputEng}>
                    13. Is follow up action required? if yes explain :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    มีการติดตามผลหรือไม่ โปรดอธิบาย ในข้อถัดไป
                  </Text>

                  <Picker
                    mode="dropdown"
                    iosIcon={
                      <Icon
                        name="angle-down"
                        style={{ width: "8%", paddingHorizontal: 2 }}
                      />
                    }
                    style={styles.inputLightStyle}
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.explain}
                    onValueChange={(t) => {
                      this.setState({ explain: t });
                      let item = { ...question[50] };
                      item.answer_id = t;
                      item.answer_detail = "";
                      question[50] = item;

                      this.setState({ question });
                    }}
                    textStyle={{ fontSize: 14 }}
                    placeholder={
                      this.state.lang === "EN"
                        ? "Please select sub location"
                        : "โปรดเลือกคำตอบ"
                    }
                  >
                    {dropdown_check.map((data) => {
                      return <Picker.Item label={data.title} value={data.id} />;
                    })}
                  </Picker>
                  <Text style={styles.textInputEng}>
                    14. Actions detail Explanation :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  {/* <Text style={styles.textInputThai}>คำชี้แจงหรือการแก้ไข</Text> */}
                  <TextInput
                    keyboardType="text"
                    style={styles.inputStyle1}
                    onChangeText={(t) => {
                      let item = { ...question[51] };
                      item.answer_id = "";
                      item.answer_detail = t;
                      question[51] = item;

                      this.setState({ question });
                    }}
                    placeholder="อธิบายรายละเอียด"
                  />
                </View>
              </View>
            </View>
          )}
          {/* ตัวเลือกที่ 2 */}
          {/*ตัวเลือกที่ 3  */}
          {(this.state.reportype == 2 || this.state.reportype == 3) && (
            <View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#4393de",
                  marginBottom: 15,
                  alignSelf: "center"
                }}
              >
                {
                  " HazOb & Near Miss Report"
                }
              </Text>
              <View style={styles.containerSec2}>
                <View style={styles.contentInSec2}>
                  <Text style={styles.textInputEng}>
                    8. Category :<Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}> ประเภท</Text>
                  {cataegery.map((items, index) => {
                    return (
                      <View>
                        <View style={styles.checkboxContainer}>
                          <CheckBox
                            checked={items.status}
                            onPress={(t) => {
                              cataegery[index].status =
                                !cataegery[index].status;
                              let item = { ...question[52] };
                              item.answer_id = cataegery;
                              item.answer_detail = "";
                              question[52] = item;

                              this.setState({ question });
                            }}
                            style={styles.checkbox}
                            title={items.title}
                          />
                        </View>
                        {items.status && index >= cataegery.length - 1 && (
                          <TextInput
                            keyboardType="text"
                            style={styles.inputStyle1}
                            onChangeText={(t) => {
                              let item = { ...question[53] };
                              item.answer_id = "";
                              item.answer_detail = t;
                              question[53] = item;

                              this.setState({ question });
                            }}
                            placeholder="อธิบายรายละเอียด"
                          />
                        )}
                      </View>
                    );
                  })}

                  <Text style={styles.textInputEng}>
                    9. Related with :<Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}> เกี่ยวเนื่องกับ</Text>
                  {relatedwith.map((items, index) => {
                    return (
                      <View>
                        <View style={styles.checkboxContainer}>
                          <CheckBox
                            checked={items.status}
                            onPress={(t) => {
                              relatedwith[index].status =
                                !relatedwith[index].status;
                              let item = { ...question[54] };
                              item.answer_id = relatedwith;
                              item.answer_detail = "";
                              question[54] = item;

                              this.setState({ question });
                            }}
                            style={styles.checkbox}
                            title={items.title}
                          />
                        </View>
                        {items.status && index >= relatedwith.length - 1 && (
                          <TextInput
                            keyboardType="text"
                            style={styles.inputStyle1}
                            onChangeText={(t) => {
                              let item = { ...question[55] };
                              item.answer_id = "";
                              item.answer_detail = t;
                              question[55] = item;

                              this.setState({ question });
                            }}
                            placeholder="อธิบายรายละเอียด"
                          />
                        )}
                      </View>
                    );
                  })}

                  <Text style={styles.textInputEng}>
                    10. Description :<Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    รายละเอียด- โปรดอธิบาย
                  </Text>
                  <TextInput
                    keyboardType="text"
                    style={styles.inputStyle1}
                    onChangeText={(t) => {
                      let item = { ...question[56] };
                      item.answer_id = "";
                      item.answer_detail = t;
                      question[56] = item;

                      this.setState({ question });
                    }}
                    placeholder="อธิบายรายละเอียด"
                  />
                  <Text style={styles.textInputEng}>
                    11. Severity - Impact :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>ความรุนแรง - ผลกระทบ</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: 2,
                      marginBottom: 2
                    }}
                  >
                    <RadioForm
                      radio_props={radio_severity}
                      initial={-1}
                      onPress={(t) => {
                        let item = { ...question[57] };
                        item.answer_id = t + 1;
                        item.answer_detail = "";
                        question[57] = item;

                        this.setState({ question });
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                        paddingVertical: 2,
                        margin: 4
                      }}
                    />
                  </View>
                  <Text style={styles.textInputEng}>
                    12. Probability - Likelihood :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>โอกาสที่จะเกิด</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: 2,
                      marginBottom: 2
                    }}
                  >
                    <RadioForm
                      radio_props={radio_probability}
                      initial={-1}
                      onPress={(t) => {
                        let item = { ...question[58] };
                        item.answer_id = t + 1;
                        item.answer_detail = "";
                        question[58] = item;

                        this.setState({ question });
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                        paddingVertical: 2,
                        margin: 4
                      }}
                    ></View>
                  </View>
                  <Text style={styles.textInputEng}>
                    13. Does the same situation exist in other area? :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    มีโอกาสพบความเสี่ยงดังกล่าวในสถานที่อื่นหรือไม่?
                  </Text>
                  {situation.map((items, index) => {
                    return (
                      <View>
                        <View style={styles.checkboxContainer}>
                          <CheckBox
                            checked={items.status}
                            onPress={(t) => {
                              situation[index].status =
                                !situation[index].status;
                              let item = { ...question[59] };
                              item.answer_id = situation;
                              item.answer_detail = "";
                              question[59] = item;

                              this.setState({ question });
                            }}
                            style={styles.checkbox}
                            title={items.title}
                          />
                        </View>
                      </View>
                    );
                  })}

                  <View>
                    <TextInput
                      keyboardType="text"
                      style={styles.inputStyle1}
                      editable={situation[situation.length - 1].status}
                      onChangeText={(t) => {
                        let item = { ...question[60] };
                        item.answer_id = "";
                        item.answer_detail = t;
                        question[60] = item;

                        this.setState({ question });
                      }}
                      placeholder="อธิบายรายละเอียด"
                    />
                  </View>

                  <Text style={styles.textInputEng}>
                    14. Recommendation Actio :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    ข้อแนะนำเพื่อการแก้ไข
                  </Text>

                  <View>
                    <TextInput
                      keyboardType="text"
                      style={styles.inputStyle1}
                      onChangeText={(t) => {
                        let item = { ...question[61] };
                        item.answer_id = "";
                        item.answer_detail = t;
                        question[61] = item;

                        this.setState({ question });
                      }}
                      placeholder="อธิบายรายละเอียด"
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
          {this.state.reportype != -1 && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 45,
                marginBottom: 10,
                marginTop: 10
              }}
            >
              <Pressable
                style={[stylesdialog.button, stylesdialog.buttonOpen]}
                onPress={() => this.onPressSend()}
              >
                <Text style={styles.textStyle}>
                  {this.state.lang === "EN" ? "Accept" : "ยืนยัน"}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Text style={styles.textStyle}>
                  {this.state.lang === "EN" ? "Cancel" : "ยกเลิก"}
                </Text>
              </Pressable>
            </View>
          )}
          {/* ตัวเลือกที่ 3 */}
          <View></View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white"
  },
  container: {
    flex: 1,
    marginHorizontal: WIDTH / 20,
    marginVertical: HEIGHT / 36
  },
  containerSec1: {
    marginHorizontal: 8,
    marginVertical: 18
  },
  //กรอบข้อมูลรอบนอก
  containerSec2: {
    marginHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#398DDD"
  },
  containerSec4: {
    marginHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "red"
  },
  containerSec5: {
    marginHorizontal: 12,
    marginBottom: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "gray"
  },
  containerSec3: {
    marginTop: 18,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#999999",
    backgroundColor: "#fff"
  },
  contentInSec2: {
    padding: 12
  },
  textHeader: {
    alignItems: "center",
    padding: 14
  },
  textHeader1: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 15
  },
  textHeader2: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 8,
    alignSelf: "center"
  },
  inputStyle: {
    backgroundColor: "#DCDCDC",
    borderRadius: 15,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10
  },
  inputStyle1: {
    borderRadius: 15,
    borderColor: "#007aff",
    borderWidth: 1,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10
  },
  inputStyle2: {
    borderRadius: 15,
    borderColor: "#007aff",
    borderWidth: 1,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    width: "85%"
  },
  inputStyle3: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    height: HEIGHT / 20,
    paddingLeft: 18,
    marginTop: 8,
    marginHorizontal: 8,
    width: 270
  },
  inputStyle4: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    height: HEIGHT / 20,
    paddingLeft: 18,
    marginLeft: -298,
    //marginHorizontal: 20,
    marginTop: 15,
    width: "123%"
  },
  inputStyle5: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    height: HEIGHT / 20,
    paddingLeft: 18,
    marginTop: 8,
    marginHorizontal: 12,
    width: "78%"
  },
  inputStyle6: {
    backgroundColor: "#fff",
    borderRadius: 15,
    height: HEIGHT / 20,
    marginTop: 8,
    paddingLeft: 18,
    marginHorizontal: 12,
    marginBottom: 12
  },
  ///กรอบเพิ่มข้อมูล
  pickerContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginVertical: 1,
    marginTop: 1,
    marginBottom: 4
  },
  pickerContainer1: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 1,
    marginTop: 1,
    marginBottom: 4
  },
  pickerContainer2: {
    flexDirection: "row",
    justifyContent: "space-evenly"
    // paddingVertical: 12,
    // marginBottom: 2,
  },
  textInputEng: {
    marginTop: 10
  },
  textInputEng1: {
    marginTop: 5,
    marginHorizontal: 8,
    textAlign: "left"
  },
  textInputEng2: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 5
  },
  textInputEng3: {
    marginTop: 5,
    fontSize: 12
  },
  textInputEng4: {
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 12
  },
  textInputEng5: {
    marginTop: 12,
    textAlign: "justify"
    // marginHorizontal: 8,
  },
  textInputThai: {
    color: "grey"
  },
  textInputThai1: {
    marginTop: 5,
    fontSize: 14,
    textAlign: "center"
  },
  textInputThai2: {
    marginTop: 15,
    textAlign: "justify"
    // marginHorizontal: 8,
  },
  textInputEng6: {
    textAlign: "justify"
    // marginHorizontal: 8,
  },
  textInputThai3: {
    textAlign: "justify"
    // marginHorizontal: 8,
  },
  textInputThai4: {
    textAlign: "justify",
    // marginHorizontal: 8,
    marginBottom: 4
  },
  textInputThai5: {
    textAlign: "justify"
    // marginHorizontal: 8,
    // marginBottom: 18,
  },
  inputLightStyle: {
    borderWidth: 1,
    borderRadius: 10,
    // height: HEIGHT / 15,
    height: HEIGHT / 18,
    width: "100%",
    marginTop: 10,
    // paddingLeft: 10,
    marginBottom: 10,
    borderColor: "#007aff"
  },
  viewBorderDropdown: {
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    paddingLeft: 10,
    marginTop: 10
  },
  inputDate: {
    borderWidth: 1,
    borderRadius: 10,
    height: HEIGHT / 18,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    flex: 1,
    justifyContent: "center",
    borderColor: "#007aff"
  },
  confirmStyle: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30
  },
  confirmStyle1: {
    marginTop: 2,
    marginBottom: 10,
    marginHorizontal: 14
    // paddingTop: 2,
    // paddingBottom: 10,
  },
  textConfirm: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10
  },
  addButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    margin: 7
  },
  addButton: {
    borderRadius: 50,
    backgroundColor: "#4392de",
    width: WIDTH / 11,
    height: HEIGHT / 21,
    marginHorizontal: 2,
    marginTop: 5,
    fontSize: 24
  },
  deleteButton: {
    borderRadius: 50,
    backgroundColor: "red",
    width: WIDTH / 11,
    height: HEIGHT / 21,
    marginHorizontal: 5,
    marginTop: 8,
    fontSize: 24
  },
  logo1: {
    marginTop: 4,
    // marginBottom: 12,
    alignItems: "center",
    width: 250,
    height: 120
    // width: WIDTH / 2,
    // height: HEIGHT / 2,
  },
  head: {
    height: 40,
    backgroundColor: "#f1f8ff"
  },
  text: {
    margin: 6,
    textAlign: "center"
  },

  checkboxContainer: {
    justifyContent: "flex-start",
    // flexDirection: "row",

    marginBottom: 5,
    marginTop: 5
  },
  checkbox: {
    alignSelf: "center",
    borderRadius: 1
  },
  label: {
    margin: 18
    // marginHorizontal: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 22,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF"
  },
  buttonCancel: {
    backgroundColor: "gray"
  },
  buttonAccept: {
    backgroundColor: "blue"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  textStyle1: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  logo: {
    width: WIDTH / 5,
    height: HEIGHT / 12,
    marginLeft: 8,
    alignItems: "center",
    marginTop: 2
  },
  logo2: {
    width: WIDTH / 3,
    height: HEIGHT / 9,
    // padding: 1,
    alignItems: "center",
    marginTop: 5
  }
});
const stylesdialog = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 24,
    elevation: 2
    // margin:5
  },
  buttonOpen: {
    backgroundColor: "green"
  },
  buttonClose: {
    backgroundColor: "#2196F3"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  containerSec: {
    flex: 1,
    backgroundColor: "#ff0",
    borderRadius: 20
  }
});
