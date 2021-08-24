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

import { Rows, Table } from "react-native-table-component";

import "intl";
import "intl/locale-data/jsonp/en";
import RadioForm from "react-native-simple-radio-button";

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

function fixedCoursePicker(selectedCourse) {
  return (
    <View style={styles.coursePickerStyles}>
      <Picker enabled={false}>
        <Picker.Item label={selectedCourse} value={selectedCourse} />
      </Picker>
    </View>
  );
}
var radio_props = [
  { label: "BBS พฤติกรรม", value: 0 },
  { label: "SWA การหยุดงาน", value: 1 },
  { label: "HazOb รายงานความสภาพเสี่ยงที่จะเกิดอุบัติภัย", value: 2 },
  {
    label: "Near Miss สภาพที่เป็นอันตราย/เหตุการณ์เกือบเกิดอุบัติเหตุ",
    value: 3,
  },
  { label: "Other", value: 4 },
];
var radio_check = [
  { label: "Yes (ใช่)\t", value: 0 },
  { label: "No (ไม่)\t", value: 1 },
  { label: "N/A\t", value: 2 },
];
var radio_check1 = [
  { label: "No/ไม่ใช่\t", value: 0 },
  {
    label: "Yes/ใช่ (Please provide detail / กรุณาระบุรายละเอียดใน Other\t",
    value: 1,
  },
];
const radio_severity = [
  { label: "Severe / ร้ายแรงที่สุด", value: 0 },
  { label: "Major / ร้ายแรงมาก", value: 1 },
  { label: "Serious / ร้ายแรง", value: 2 },
  { label: "Minor / ไม่ร้ายแรง", value: 3 },
  { label: "Incidental / เล็กน้อย", value: 4 },
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
  { accNumber: "9.4 ระยะห่างระหว่างรถ" },
];
const radio_probability = [
  { label: "Frequent / เกิดขึ้นบ่อยมาก", value: 0 },
  { label: "Occational / เกิดได้บ่อยก", value: 1 },
  { label: "Seldom / นาน ๆ ครั้ง", value: 2 },
  { label: "Unlikely / มีโอกาสเกิดขึ้นน้อย", value: 3 },
  { label: "Remote / เกิดขึ้นได้ยากมาก", value: 4 },
];
const radio_BBS = [
  { label: "Safe \t", value: 0 },
  { label: "At risk \t", value: 1 },
  { label: "N/A \t", value: 2 },
];
export default class TrainingFormScreen extends Component {
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
      sublocation: [],
      reportype: -1,
    };
  }

  async componentDidMount() {
    let id = await AsyncStorage.getItem("userId");

    this.setState({
      user_id: id,
      dateNow: this.formatDate(now()),
      dateTimeNow: this.formatDateTime(now()),
      dateThai: this.formatThai(now()),
      dateEng: this.formatEng(now()),
    });
    const res = await AsyncStorage.getItem("language");
    if (res === "EN") {
      this.setState({ lang: "EN", lang_id: 1 });
    } else {
      this.setState({ lang: "TH", lang_id: 2 });
    }

    try {
      httpClient
        .get(`/Training/TrainingFormScreen/${id}`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            for (let i = 0; i < result.length; i++) {
              var row = result[i];

              this.setState({
                profile: row,
                firstname:
                  this.state.lang === "EN" ? row.firstname_en : row.firstname,
                lastname:
                  this.state.lang === "EN" ? row.lastname_en : row.lastname,
                position: row.position_title,
                dept: row.dep_title,
              });
            }
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
      month = "" + d.getMonth(),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };
  formatDateTime = (date) => {
    let d = new Date(date),
      month = "" + d.getMonth(),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      H = d.getHours(),
      M = d.getMinutes(),
      S = d.getSeconds();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (M.length < 2) M = "0" + M;
    if (S.length < 2) S = "0" + S;
    let dates = [day, month, year].join("/") + " " + [H, M, S].join(":");

    return dates;
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
    var dates = this.formatDatetotal(dates);
    var datethai = this.formatThai(dates);
    var dateeng = this.formatEng(dates);

    if (this.state.isStart) {
      this.setState({
        startDate: date,
        startcul: dates,
        isStart: false,
        startdatethai: datethai,
        startdateeng: dateeng,
      });
      if (this.state.endcul != 0) {
        this.culDate(dates, this.state.endcul);
      }
    } else {
      this.setState({
        endDate: date,
        endcul: dates,
        enddatethai: datethai,
        enddateeng: dateeng,
      });

      if (this.state.startcul != 0) {
        this.culDate(this.state.startcul, dates);
      }
    }
    this.changPlace();
    this.hideDatePicker();
  };

  render() {
    const { listFeedBack, upload_file } = this.state;
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
          <View style={styles.containerSec1}>
            {/* <View style={styles.textHeader}> */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#4393de",
                marginTop: 18,
                marginBottom: 15,
                alignSelf: "center",
              }}
            >
              แบบฟอร์มรายงาน
            </Text>

            {/* </View> */}

            <View>
              <Divider style={{ backgroundColor: "black", borderWidth: 2 }} />
            </View>

            {/* ส่วนที่1 */}
            <View style={{ margin: 20, marginHorizontal: 8 }}>
              <Text style={styles.textInputEng}>First name :</Text>
              <Text style={styles.textInputThai}>ชื่อ</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.firstname}
              />

              <Text style={styles.textInputEng}>Last name:</Text>
              <Text style={styles.textInputThai}>นามสกุล</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.lastname}
              />

              <Text style={styles.textInputEng}>Position :</Text>
              <Text style={styles.textInputThai}>ตำแหน่ง</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.position}
              />

              <Text style={styles.textInputEng}>Dept :</Text>
              <Text style={styles.textInputThai}>แผนก</Text>
              <TextInput style={styles.inputStyle} value={this.state.dept} />
              <Text style={styles.textInputEng}>
                Staff's residence :<Text style={{ color: "red" }}>*</Text>
              </Text>
              <Text style={styles.textInputThai}>ที่พัก</Text>
              <TextInput
                keyboardType="text"
                value={this.state.nameplace_etc}
                style={styles.inputStyle1}
                maxLength={100}
                onChangeText={this.changPlace}
                placeholder="กรุณากรอกที่พัก"
              />
              <Text style={styles.textInputEng}>
                Work Location :<Text style={{ color: "red" }}>*</Text>
              </Text>
              <Text style={styles.textInputThai}>สถาณที่ทำงาน</Text>
              <TextInput
                keyboardType="text"
                value={this.state.nameplace_etc}
                style={styles.inputStyle1}
                maxLength={100}
                onChangeText={this.changPlace}
                placeholder="กรุณากรอกสถาณที่ทำงาน"
              />
            </View>

            <View
              style={{
                marginBottom: 10,
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
                locale="th_TH"
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
                // selectedValue={this.state.course}
                onValueChange={(t) => this.onPickerValueChange(t)}
                textStyle={{ fontSize: 14 }}
                placeholder={
                  this.state.lang === "EN"
                    ? "Please select location"
                    : "กรุณาเลือกสถานที่พบเหตุการณ์"
                }
              >
                {this.state.location.map((data) => {
                  return (
                    <Picker.Item label={data.type_name} value={data.type_id} />
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
                selectedValue={this.state.course}
                onValueChange={(t) => this.onPickerValueChange(t)}
                textStyle={{ fontSize: 14 }}
                placeholder={
                  this.state.lang === "EN"
                    ? "Please select sub location"
                    : "กรุณาเลือกบริเวณที่พบเหตุการณ์"
                }
              >
                {this.state.sublocation.map((data) => {
                  return (
                    <Picker.Item label={data.type_name} value={data.type_id} />
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
          {/* ส่วนที่3  */}
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#4393de",
              marginBottom: 15,
              alignSelf: "center",
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
                  marginBottom: 2,
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
                    margin: 4,
                  }}
                ></View>
              </View>
            </View>
          </View>
          {/*  จบส่วนที่3 */}
          <View
            style={{
              marginVertical: 30,
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
          {/*ตัวเลือกที่ 1  */}
          {(this.state.reportype == 0 || this.state.reportype == 4) && (
            <View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#4393de",
                  marginBottom: 15,
                  alignSelf: "center",
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
                    value={this.state.nameplace_etc}
                    style={styles.inputStyle1}
                    onChangeText={this.changPlace}
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
                          onPress={(item) => this.onChange1(index, item)}
                        />
                      </View>
                    </View>
                    <Text style={styles.textInputEng}>12. Other :</Text>
                    <Text style={styles.textInputThai}>อื่นๆ</Text>
                    <TextInput
                      keyboardType="text"
                      value={this.state.nameplace_etc}
                      style={styles.inputStyle1}
                      onChangeText={this.changPlace}
                      placeholder="อธิบายรายละเอียด"
                    />
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
                    value={this.state.nameplace_etc}
                    style={styles.inputStyle1}
                    onChangeText={this.changPlace}
                    placeholder="อธิบายรายละเอียด"
                  />
                  <Text style={styles.textInputEng}>
                    10. Critical Behavior Inventory (CBI) 1-9 :
                    <Text style={{ color: "red" }}> *</Text>
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
                              onPress={(item) => this.onChange(index, item)}
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
                          onPress={(item) => this.onChange1(index, item)}
                        />
                      </View>
                    </View>
                    <Text style={styles.textInputEng}>12. Other :</Text>
                    <Text style={styles.textInputThai}>อื่นๆ</Text>
                    <TextInput
                      keyboardType="text"
                      value={this.state.nameplace_etc}
                      style={styles.inputStyle1}
                      onChangeText={this.changPlace}
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
                  alignSelf: "center",
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
                    value={this.state.nameplace_etc}
                    style={styles.inputStyle1}
                    onChangeText={this.changPlace}
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
                    value={this.state.nameplace_etc}
                    style={styles.inputStyle1}
                    onChangeText={this.changPlace}
                    placeholder="อธิบายรายละเอียด"
                  />
                  <Text style={styles.textInputEng}>
                    9. Comments/Responses :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>คำชี้แจงหรือการแก้ไข</Text>
                  <TextInput
                    keyboardType="text"
                    value={this.state.nameplace_etc}
                    style={styles.inputStyle1}
                    onChangeText={this.changPlace}
                    placeholder="อธิบายรายละเอียด"
                  />
                  <Text style={styles.textInputEng}>
                    10. Was work activity resumed? :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    มีการทำงานต่อ หลังจากหาแนวทางแก้ไขแล้วหรือไม่
                  </Text>

                  <View style={styles.containerSec}>
                    <View>
                      <View style={{ marginVertical: 2, marginHorizontal: 24 }}>
                        <RadioForm
                          radio_props={radio_check}
                          formHorizontal={true}
                          initial={-1}
                          onPress={(item) => this.onChange1(index, item)}
                        />
                      </View>
                    </View>
                  </View>
                  <Text style={styles.textInputEng}>
                    11. Was SWA valid (real problem)? :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    การหยุดงานครั้งนี้ถูกต้องแล้ว (มีปัญหาจริงหรือไม่)
                  </Text>

                  <View style={styles.containerSec}>
                    <View>
                      <View style={{ marginVertical: 2, marginHorizontal: 24 }}>
                        <RadioForm
                          radio_props={radio_check}
                          formHorizontal={true}
                          initial={-1}
                          onPress={(item) => this.onChange1(index, item)}
                        />
                      </View>
                    </View>
                  </View>
                  <Text style={styles.textInputEng}>
                    12. Was issue resolved? :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    มีการแก้ปัญหาเรียบร้อยแล้ว (หรือต้องทำในระยะยาว)
                  </Text>

                  <View style={styles.containerSec}>
                    <View>
                      <View style={{ marginVertical: 2, marginHorizontal: 24 }}>
                        <RadioForm
                          radio_props={radio_check}
                          formHorizontal={true}
                          initial={-1}
                          onPress={(item) => this.onChange1(index, item)}
                        />
                      </View>
                    </View>
                  </View>
                  <Text style={styles.textInputEng}>
                    13. Is follow up action required? if yes explain :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    มีการติดตามผลหรือไม่ โปรดอธิบาย ในข้อถัดไป
                  </Text>

                  <View style={styles.containerSec}>
                    <View>
                      <View style={{ marginVertical: 2, marginHorizontal: 24 }}>
                        <RadioForm
                          radio_props={radio_check}
                          formHorizontal={true}
                          initial={-1}
                          onPress={(item) => this.onChange1(index, item)}
                        />
                      </View>
                    </View>
                  </View>
                  <Text style={styles.textInputEng}>
                    14. Actions detail Explanation :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  {/* <Text style={styles.textInputThai}>คำชี้แจงหรือการแก้ไข</Text> */}
                  <TextInput
                    keyboardType="text"
                    value={this.state.nameplace_etc}
                    style={styles.inputStyle1}
                    onChangeText={this.changPlace}
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
                  alignSelf: "center",
                }}
              >
                {
                  " Stop Work Authority/Responsibility (SWA/SWR) \n การใช้อำนาจในการหยุดงาน"
                }
              </Text>
              <View style={styles.containerSec2}>
                <View style={styles.contentInSec2}>
                  <Text style={styles.textInputEng}>
                    8. Category :<Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}> ประเภท</Text>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxCategory}
                      onPress={() => {
                        this.setState({
                          CheckboxCategory: !this.state.CheckboxCategory,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Aviation Operations / ปฏิบัติการอากาศยาน"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxCategory1}
                      onPress={() => {
                        this.setState({
                          CheckboxCategory1: !this.state.CheckboxCategory1,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Environment Impact / ผลกระทบต่อสิ่งแวดล้อม"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxCategory2}
                      onPress={() => {
                        this.setState({
                          CheckboxCategory2: !this.state.CheckboxCategory2,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Fire & Explosion / ไฟไหม้และการระเบิด"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxCategory3}
                      onPress={() => {
                        this.setState({
                          CheckboxCategory3: !this.state.CheckboxCategory3,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Injury & Illness / บาดเจ็บและการเจ็บป่วย"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxCategory4}
                      onPress={() => {
                        this.setState({
                          CheckboxCategory4: !this.state.CheckboxCategory4,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Marine Accident / อุบัติเหตุทางทะเล"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxCategory5}
                      onPress={() => {
                        this.setState({
                          CheckboxCategory5: !this.state.CheckboxCategory5,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Motor Vehicle Crash / อุบัติเหตุด้านยานพาหนะ"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxCategory6}
                      onPress={() => {
                        this.setState({
                          CheckboxCategory6: !this.state.CheckboxCategory6,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Policy, Law Non-Compliance / การละเมิดกฎฯ"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxCategory7}
                      onPress={() => {
                        this.setState({
                          CheckboxCategory7: !this.state.CheckboxCategory7,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Process Upset / ระบบกระบวนการผลิตขัดข้อง"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxCategory8}
                      onPress={() => {
                        this.setState({
                          CheckboxCategory8: !this.state.CheckboxCategory8,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Property, Equipment Damage / ทรัพย์สินเสียหาย"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxCategory9}
                      onPress={() => {
                        this.setState({
                          CheckboxCategory9: !this.state.CheckboxCategory9,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Splill or Release / การรั่วไหลของก๊าซและของแหลว"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxCategory10}
                      onPress={() => {
                        this.setState({
                          CheckboxCategory10: !this.state.CheckboxCategory10,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Other"}
                    />
                    {this.state.CheckboxCategory10 == true && (
                      <View>
                        <TextInput
                          style={styles.inputStyle}
                          placeholder="อธิบายรายละเอียด"
                          onChangeText={(text) =>
                            this.setState({ Otherhazob1: text })
                          }
                        ></TextInput>
                      </View>
                    )}
                  </View>
                  <Text style={styles.textInputEng}>
                    9. Related with :<Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}> เกี่ยวเนื่องกับ</Text>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxRelated}
                      onPress={() => {
                        this.setState({
                          CheckboxRelated: !this.state.CheckboxRelated,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Chemical / สารเคมี"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxRelated1}
                      onPress={() => {
                        this.setState({
                          CheckboxRelated1: !this.state.CheckboxRelated1,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Electrical / ไฟฟ้า"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxRelated2}
                      onPress={() => {
                        this.setState({
                          CheckboxRelated2: !this.state.CheckboxRelated2,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Fall Hazard Management / การจัดการงานบนที่สูง"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxRelated3}
                      onPress={() => {
                        this.setState({
                          CheckboxRelated3: !this.state.CheckboxRelated3,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Houskeeping / ความเป็นระเบียบเรียบร้อย"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxRelated4}
                      onPress={() => {
                        this.setState({
                          CheckboxRelated4: !this.state.CheckboxRelated4,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Hygiene, Sanitation / อนามัยและความสะอาด"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxRelated5}
                      onPress={() => {
                        this.setState({
                          CheckboxRelated5: !this.state.CheckboxRelated5,
                        });
                      }}
                      style={styles.checkbox}
                      title={
                        "Labeling, Marketing & Signs / ฉลาก, เครื่องหมาย ป้าย"
                      }
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxRelated6}
                      onPress={() => {
                        this.setState({
                          CheckboxRelated6: !this.state.CheckboxRelated6,
                        });
                      }}
                      style={styles.checkbox}
                      title={
                        "Lifting Appliances / อุปกรณ์การยก, ผูก และเคลื่อนย้าย"
                      }
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxRelated7}
                      onPress={() => {
                        this.setState({
                          CheckboxRelated7: !this.state.CheckboxRelated7,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Mechanical / เครื่องจักรกล"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxRelated8}
                      onPress={() => {
                        this.setState({
                          CheckboxRelated8: !this.state.CheckboxRelated8,
                        });
                      }}
                      style={styles.checkbox}
                      title={"PPE / อุปกรณ์ป้องกันอันตรายส่วนบุคคล"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxRelated9}
                      onPress={() => {
                        this.setState({
                          CheckboxRelated9: !this.state.CheckboxRelated9,
                        });
                      }}
                      style={styles.checkbox}
                      title={
                        "Safety, Life Saving Eqipment / อุปกรณ์ความปลอดภัย"
                      }
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxRelated10}
                      onPress={() => {
                        this.setState({
                          CheckboxRelated10: !this.state.CheckboxRelated10,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Vehicles / ยานพาหนะ, การขนส่ง"}
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxRelated11}
                      onPress={() => {
                        this.setState({
                          CheckboxRelated11: !this.state.CheckboxRelated11,
                        });
                      }}
                      style={styles.checkbox}
                      title={
                        "Welding, Burning / งานเชื่อม. งานเกี่ยวกับความร้อน"
                      }
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxRelated12}
                      onPress={() => {
                        this.setState({
                          CheckboxRelated12: !this.state.CheckboxRelated12,
                        });
                      }}
                      style={styles.checkbox}
                      title={
                        "Walking Surface, Railings, Ladders / ทางเดิน, บันได"
                      }
                    />
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      checked={this.state.CheckboxRelated13}
                      onPress={() => {
                        this.setState({
                          CheckboxRelated13: !this.state.CheckboxRelated13,
                        });
                      }}
                      style={styles.checkbox}
                      title={"Other"}
                    />
                    <TextInput
                      keyboardType="text"
                      value={this.state.nameplace_etc}
                      style={styles.inputStyle1}
                      onChangeText={this.changPlace}
                      placeholder="อธิบายรายละเอียด"
                    />
                  </View>
                  <Text style={styles.textInputEng}>
                    10. Description :<Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                    รายละเอียด- โปรดอธิบาย
                  </Text>
                  <TextInput
                    keyboardType="text"
                    value={this.state.nameplace_etc}
                    style={styles.inputStyle1}
                    onChangeText={this.changPlace}
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
                      marginBottom: 2,
                    }}
                  >
                    <RadioForm
                      radio_props={radio_severity}
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
                        margin: 4,
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
                      marginBottom: 2,
                    }}
                  >
                    <RadioForm
                      radio_props={radio_probability}
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
                        margin: 4,
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
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: 2,
                      marginBottom: 2,
                    }}
                  >
                    <RadioForm
                      radio_props={radio_check1}
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
                        margin: 4,
                      }}
                    ></View>
                  </View>
                  <TextInput
                    keyboardType="text"
                    value={this.state.nameplace_etc}
                    style={styles.inputStyle1}
                    onChangeText={this.changPlace}
                    placeholder="อธิบายรายละเอียด"
                  />
                  <Text style={styles.textInputEng}>
                    14. Recommendation Actio :
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <Text style={styles.textInputThai}>
                  ข้อแนะนำเพื่อการแก้ไข
                  </Text>
                  <TextInput
                    keyboardType="text"
                    value={this.state.nameplace_etc}
                    style={styles.inputStyle1}
                    onChangeText={this.changPlace}
                    placeholder="อธิบายรายละเอียด"
                  />
                </View>
              </View>
            </View>
          )}
          {/* ตัวเลือกที่ 3 */}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    marginHorizontal: WIDTH / 20,
    marginVertical: HEIGHT / 36,
    // marginBottom: 32,
  },
  containerSec1: {
    // borderWidth: 1,
    // padding: 12,
    // borderRadius: 8,
    // marginHorizontal: 20,
    // marginTop: 18,
    marginHorizontal: 8,
    marginVertical: 18,
  },
  //กรอบข้อมูลรอบนอก
  containerSec2: {
    marginHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#398DDD",
  },
  containerSec4: {
    marginHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "red",
  },
  containerSec5: {
    marginHorizontal: 12,
    marginBottom: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "gray",
  },
  containerSec3: {
    marginTop: 18,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#999999",
    backgroundColor: "#fff",
  },
  contentInSec2: {
    padding: 12,
  },
  textHeader: {
    alignItems: "center",
    padding: 14,
  },
  textHeader1: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 15,
  },
  textHeader2: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 8,
    alignSelf: "center",
  },
  inputStyle: {
    backgroundColor: "#DCDCDC",
    borderRadius: 15,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  inputStyle1: {
    borderRadius: 15,
    borderColor: "#007aff",
    borderWidth: 1,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  inputStyle2: {
    borderRadius: 15,
    borderColor: "#007aff",
    borderWidth: 1,
    height: HEIGHT / 20,
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    width: "85%",
  },
  inputStyle3: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    height: HEIGHT / 20,
    paddingLeft: 18,
    marginTop: 8,
    marginHorizontal: 8,
    width: 270,
  },
  inputStyle4: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    height: HEIGHT / 20,
    paddingLeft: 18,
    marginLeft: -298,
    //marginHorizontal: 20,
    marginTop: 15,
    width: "123%",
  },
  inputStyle5: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    height: HEIGHT / 20,
    paddingLeft: 18,
    marginTop: 8,
    marginHorizontal: 12,
    width: "78%",
  },
  inputStyle6: {
    backgroundColor: "#fff",
    borderRadius: 15,
    height: HEIGHT / 20,
    marginTop: 8,
    paddingLeft: 18,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  ///กรอบเพิ่มข้อมูล
  pickerContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginVertical: 1,
    marginTop: 1,
    marginBottom: 4,
  },
  pickerContainer1: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 1,
    marginTop: 1,
    marginBottom: 4,
  },
  pickerContainer2: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    // paddingVertical: 12,
    // marginBottom: 2,
  },
  textInputEng: {
    marginTop: 10,
  },
  textInputEng1: {
    marginTop: 5,
    marginHorizontal: 8,
    textAlign: "left",
  },
  textInputEng2: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 5,
  },
  textInputEng3: {
    marginTop: 5,
    fontSize: 12,
  },
  textInputEng4: {
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 12,
  },
  textInputEng5: {
    marginTop: 12,
    textAlign: "justify",
    // marginHorizontal: 8,
  },
  textInputThai: {
    color: "grey",
  },
  textInputThai1: {
    marginTop: 5,
    fontSize: 14,
    textAlign: "center",
  },
  textInputThai2: {
    marginTop: 15,
    textAlign: "justify",
    // marginHorizontal: 8,
  },
  textInputEng6: {
    textAlign: "justify",
    // marginHorizontal: 8,
  },
  textInputThai3: {
    textAlign: "justify",
    // marginHorizontal: 8,
  },
  textInputThai4: {
    textAlign: "justify",
    // marginHorizontal: 8,
    marginBottom: 4,
  },
  textInputThai5: {
    textAlign: "justify",
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
    borderColor: "#007aff",
  },
  viewBorderDropdown: {
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    paddingLeft: 10,
    marginTop: 10,
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
    borderColor: "#007aff",
  },
  confirmStyle: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
  },
  confirmStyle1: {
    marginTop: 2,
    marginBottom: 10,
    marginHorizontal: 14,
    // paddingTop: 2,
    // paddingBottom: 10,
  },
  textConfirm: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    margin: 7,
  },
  addButton: {
    borderRadius: 50,
    backgroundColor: "#4392de",
    width: WIDTH / 11,
    height: HEIGHT / 21,
    marginHorizontal: 2,
    marginTop: 5,
    fontSize: 24,
  },
  deleteButton: {
    borderRadius: 50,
    backgroundColor: "red",
    width: WIDTH / 11,
    height: HEIGHT / 21,
    marginHorizontal: 5,
    marginTop: 8,
    fontSize: 24,
  },
  logo1: {
    marginTop: 4,
    // marginBottom: 12,
    alignItems: "center",
    width: 250,
    height: 120,
    // width: WIDTH / 2,
    // height: HEIGHT / 2,
  },
  head: {
    height: 40,
    backgroundColor: "#f1f8ff",
  },
  text: {
    margin: 6,
    textAlign: "center",
  },

  checkboxContainer: {
    justifyContent: "flex-start",
    // flexDirection: "row",

    marginBottom: 5,
    marginTop: 5,
  },
  checkbox: {
    alignSelf: "center",
    borderRadius: 1,
  },
  label: {
    margin: 18,
    // marginHorizontal: 18,
  },
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
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 22,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonCancel: {
    backgroundColor: "gray",
  },
  buttonAccept: {
    backgroundColor: "blue",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  textStyle1: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  logo: {
    width: WIDTH / 5,
    height: HEIGHT / 12,
    marginLeft: 8,
    alignItems: "center",
    marginTop: 2,
  },
  logo2: {
    width: WIDTH / 3,
    height: HEIGHT / 9,
    // padding: 1,
    alignItems: "center",
    marginTop: 5,
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
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 24,
    elevation: 2,
    // margin:5
  },
  buttonOpen: {
    backgroundColor: "green",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  containerSec: {
    flex: 1,
    backgroundColor: "#ff0",
    borderRadius: 20,
  },
});
