// import * as React from "react";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  Alert,
} from "react-native";
import { Divider, Avatar } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { httpClient } from "../../core/HttpClient";
import { CheckBox } from "react-native-elements";
import { Button, Picker } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/Ionicons";
import FormData from "form-data";

const HEIGHT = Dimensions.get("window").height;

// เริ่ม
export default class FlightBookingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: "",
      lang: "",
      lang_id: "",
      firstname: "",
      lastname: "",
      position: "",
      dept: "",
      firstflight: "",
      startDate: "DD/MM/YYYY",
      endDate: "DD/MM/YYYY",
      startTime: "00:00",
      endTime: "00:00",
      isDatePickerVisible: false,
      date: new Date(),
      identification: "",
      phone: "",
      birthday: "",
      province: "",
      select_1: [],
      select_2: [],
      isTimePickerVisible: false,
      isStartTime: false,
      froms: "",
      froms_id: "",
      tos: "",
      tos_id: "",
      purpose: "",
      purposeEtc: "",
      baggage: "",
      airportCheck: false,
      checkBaggage: false,
      flight: [],
      flightItem: {
        data: {
          dates: "DD/MM/YYYY",
          startTime: "00:00",
          endTime: "00:00",
          froms: "",
          froms_id: "",
          tos: "",
          tos_id: "",
          checkEtc: false,
          flight: "",
          checkBaggage: false,
          baggage: "",
        },
      },
      tem: -1,
    };
  }

  async componentDidMount() {
    let id = await AsyncStorage.getItem("userId");
    this.setState({ user_id: id });

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
                firstname:
                  this.state.lang === "EN" ? row.firstname_en : row.firstname,
                lastname:
                  this.state.lang === "EN" ? row.lastname_en : row.lastname,
                position: row.position_title,
                dept: row.dep_title,
                identification: row.identification,
                phone: row.phone,
                birthday: row.birthday,
                province:
                  this.state.lang === "EN" ? row.pv_name_en : row.pv_name_th,
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });

      httpClient
        .get(`/Training/FlighBookingScreen/`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            this.setState({
              select_1: result,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

      httpClient
        .get(`/Training/FlighBookingScreenPurpose/`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            this.setState({
              select_2: result,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {}
  }

  // เอก
  formatTime = (date) => {
    let d = new Date(date),
      hours = d.getHours().toString(),
      minutes = d.getMinutes().toString();

    hours.length < 2 ? (hours = "0" + hours) : null;
    minutes.length < 2 ? (minutes = "0" + minutes) : null;

    return [hours, minutes].join(":");
  };

  showTimePicker = (props, index) => {
    this.setState({ isTimePickerVisible: true });
    if (props == "start" && index == null) {
      this.setState({ isStartTime: true });
    } else if (props == "start" && index >= 0) {
      this.setState({ isStartTime: true, tem: index });
    } else if (props >= 0) {
      this.setState({ tem: props });
    }
  };

  hideTimePicker = () => {
    this.setState({ isTimePickerVisible: false });
  };

  handleTimePicker = (date) => {
    date = this.formatTime(date);

    if (this.state.isStartTime && this.state.tem == -1) {
      this.setState({ startTime: date, isStartTime: false, tem: -1 });
    } else if (this.state.isStartTime && this.state.tem >= 0) {
      if (this.state.tem >= 0) {
        let tem = this.state.tem;
        let flight = [...this.state.flight];
        let item = { ...flight[tem] };
        let data = { ...item["data"] };
        data.startTime = date;
        item["data"] = data;
        flight[tem] = item;
        this.setState({ flight: flight, tem: -1, isStartTime: false });
      }
    } else if (this.state.tem >= 0) {
      if (this.state.tem >= 0) {
        let tem = this.state.tem;
        let flight = [...this.state.flight];
        let item = { ...flight[tem] };
        let data = { ...item["data"] };
        data.endTime = date;
        item["data"] = data;
        flight[tem] = item;
        this.setState({ flight: flight, tem: -1 });
      }
    } else {
      this.setState({ endTime: date });
    }
    this.hideTimePicker();
  };
  // เวลา

  // วันที่
  formatDate = (date) => {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
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
    if (props != "start" && props >= 0) {
      this.setState({ tem: props });
    }
  };

  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };
  handleConfirm = (dates) => {
    var datess = this.formatDate(dates);

    if (this.state.isStart) {
      this.setState({ startDate: datess, isStart: false });
    } else {
      if (this.state.tem > -1) {
        let tem = this.state.tem;
        let flight = [...this.state.flight];
        let item = { ...flight[tem] };
        let data = { ...item["data"] };
        data.dates = datess;
        item["data"] = data;
        flight[tem] = item;
        this.setState({ flight: flight });
        console.log(flight);
      }
    }

    this.hideDatePicker();
  };

  deleteFlight(index, courseItem) {
    let itemCopy = [...courseItem];
    itemCopy.splice(index, 1);
    this.setState({
      flight: itemCopy,
    });
  }

  //บันทึกข้อมูล
  onPressSend = () => {
    try {
      const {
        user_id,
        purpose,
        purposeEtc,
        province,
        startDate,
        startTime,
        endTime,
        froms_id,
        froms,
        tos,
        tos_id,
        firstflight,
        airportCheck,
        baggage,
        checkBaggage,
        flight,
      } = this.state;
      if (
        (purpose == "" && purpose != 3) ||
        (purposeEtc == "" && purpose == 3)
      ) {
        this.state.lang === "EN"
          ? Alert.alert("Please select a travel purpose.")
          : Alert.alert("กรุณาเลือกวัตถุประสงค์ในการเดินทาง");
      } else if (startDate == "DD/MM/YYYY") {
        this.state.lang === "EN"
          ? Alert.alert("Please select a departure date")
          : Alert.alert("กรุณาเลือกวันเดินทาง");
      } else if (startTime == "00:00") {
        this.state.lang === "EN"
          ? Alert.alert("Please select a travel time")
          : Alert.alert("กรุณาเลือกเวลาเดินทาง");
      } else if (endTime == "00:00") {
        this.state.lang === "EN"
          ? Alert.alert("Please select an end time")
          : Alert.alert("กรุณาเลือกเวลาสิ้นสุดการเดินทาง");
      } else if (froms_id == "" && froms == "") {
        this.state.lang === "EN"
          ? Alert.alert("Please select a departure flight.")
          : Alert.alert("โปรดเลือกเที่ยวบินต้นทาง");
      } else if (tos_id == "" && tos == "") {
        this.state.lang === "EN"
          ? Alert.alert("Please select destination flight")
          : Alert.alert("โปรดเลือกเที่ยวบินปลายทาง");
      } else if (firstflight == "") {
        this.state.lang === "EN"
          ? Alert.alert("Please enter your flight")
          : Alert.alert("กรุณากรอกเที่ยวบินของคุณ");
      } else if (checkBaggage == true && baggage == "") {
        this.state.lang === "EN"
          ? Alert.alert("Please enter your baggage weight.")
          : Alert.alert("กรุณาป้อนน้ำหนักสัมภาระของคุณ");
      } else {
        var endi = flight.length - 1;
        var error = false;
        if (flight.length > 0) {
          var index = 0;
          do {
            error = true;
            var param = flight[index].data;
            if (param.dates == "DD/MM/YYYY") {
              this.state.lang === "EN"
                ? Alert.alert(
                    "Please select a departure date" +
                      " \n (Flight field " +
                      (index + 2) +
                      ")"
                  )
                : Alert.alert(
                    "กรุณาเลือกวันเดินทาง" +
                      " \n (ช่องกรอกเที่ยวบินที่  " +
                      (index + 2) +
                      ")"
                  );
            } else if (param.startTime == "00:00") {
              this.state.lang === "EN"
                ? Alert.alert(
                    "Please select a travel time" +
                      " \n (Flight field " +
                      (index + 2) +
                      ")"
                  )
                : Alert.alert(
                    "กรุณาเลือกเวลาเดินทาง" +
                      " \n (ช่องกรอกเที่ยวบินที่  " +
                      (index + 2) +
                      ")"
                  );
            } else if (param.endTime == "00:00") {
              this.state.lang === "EN"
                ? Alert.alert(
                    "Please select an end time" +
                      " \n (Flight field " +
                      (index + 2) +
                      ")"
                  )
                : Alert.alert(
                    "กรุณาเลือกเวลาสิ้นสุดการเดินทาง" +
                      " \n (ช่องกรอกเที่ยวบินที่  " +
                      (index + 2) +
                      ")"
                  );
            } else if (param.froms_id == "" && param.froms == "") {
              this.state.lang === "EN"
                ? Alert.alert(
                    "Please select a departure flight" +
                      " \n (Flight field " +
                      (index + 2) +
                      ")"
                  )
                : Alert.alert(
                    "โปรดเลือกเที่ยวบินต้นทาง" +
                      " \n (ช่องกรอกเที่ยวบินที่  " +
                      (index + 2) +
                      ")"
                  );
            } else if (param.tos_id == "" && param.tos == "") {
              this.state.lang === "EN"
                ? Alert.alert(
                    "Please select destination flight" +
                      " \n (Flight field " +
                      (index + 2) +
                      ")"
                  )
                : Alert.alert(
                    "โปรดเลือกเที่ยวบินปลายทาง" +
                      " \n (ช่องกรอกเที่ยวบินที่  " +
                      (index + 2) +
                      ")"
                  );
            } else if (param.flight == "") {
              this.state.lang === "EN"
                ? Alert.alert(
                    "Please enter your flight" +
                      " \n (Flight field " +
                      (index + 2) +
                      ")"
                  )
                : Alert.alert(
                    "กรุณาใส่เที่ยวบินของคุณ" +
                      " \n (ช่องกรอกเที่ยวบินที่  " +
                      (index + 2) +
                      ")"
                  );
            } else if (param.checkBaggage == true && param.baggage == "") {
              this.state.lang === "EN"
                ? Alert.alert(
                    "Please enter your baggage weight" +
                      " \n (Flight field " +
                      (index + 2) +
                      ")"
                  )
                : Alert.alert(
                    "กรุณาป้อนน้ำหนักสัมภาระของคุณ" +
                      " \n (ช่องกรอกเที่ยวบินที่  " +
                      (index + 2) +
                      ")"
                  );
            } else {
              error = !error;
            }
            index++;
          } while (index <= endi && error != true);
        }
        if ((error != true && flight.length > 0) || flight.length < 1) {
          const params = {
            user_id,
            startDate,
            startTime,
            endTime,
            froms,
            froms_id,
            tos,
            tos_id,
            firstflight,
            province,
            baggage,
            airportCheck,
            purpose,
            purpose_etc: purposeEtc,
            flight,
          };

          const datas = params;

          Alert.alert(
            this.state.lang === "EN" ? "Alert" : "แจ้งเตือน",
            this.state.lang === "EN" ? "Confirm" : "ยืนยัน",
            [
              {
                text: this.state.lang === "EN" ? "CANCEL" : "ยกเลิก",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              ,
              {
                text: this.state.lang === "EN" ? "OK" : "ตกลง",
                onPress: () => {
                  httpClient
                    .post(`/Training/InsertFlightBooking`, datas)
                    .then((response) => {
                      const result = response.data;

                      if (result === true) {
                        Alert.alert(
                          this.state.lang === "EN" ? "Alert" : "แจ้งเตือน",
                          this.state.lang === "EN"
                            ? "Problem reported"
                            : "บันทึกเที่ยวบินสำเร็จ",
                          [
                            {
                              text: this.state.lang === "EN" ? "OK" : "ตกลง",
                              onPress: () => this.reset(),
                            },
                          ],
                          { cancelable: false }
                        );
                      } else {
                        Alert.alert(
                          this.state.lang === "EN"
                            ? `Can't save FlightBooking`
                            : "ไม่สามารถบันทึกเที่ยวบินได้"
                        );
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                },
              },
            ]
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  reset = () => {
    this.setState({
      startDate: "DD/MM/YYYY",
      endDate: "DD/MM/YYYY",
      startTime: "00:00",
      endTime: "00:00",
      isDatePickerVisible: false,
      isTimePickerVisible: false,
      isStartTime: false,
      froms: "",
      froms_id: "",
      tos: "",
      tos_id: "",
      purpose: "",
      purposeEtc: "",
      firstflight: "",
      baggage: "",
      airportCheck: false,
      checkBaggage: false,
      flight: [],
    });
  };

  render() {
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
          {/* Start flight booking form section 1 */}
          <View style={styles.containerSec1}>
            {/* <View style={styles.textHeader}> */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#4393de",
                marginTop: 18,
                alignSelf: "center",
              }}
            >
              {this.state.lang === "EN"
                ? "EXTERRAN (THAILAND) LTD."
                : "บริษัทเอ็กซ์เธอร์แลน ประเทศไทย จำกัด"}
            </Text>

            <Text
              style={{
                alignSelf: "center",
                fontSize: 16,
                marginTop: 12,
                marginBottom: 15,
              }}
            >
              {this.state.lang === "EN" ? "Flight" : "เครื่องบิน"}
            </Text>
            {/* </View> */}

            <View>
              <Divider style={{ backgroundColor: "black", borderWidth: 2 }} />
            </View>

            {/* ส่วนที่1 */}
            <View style={{ margin: 20, marginHorizontal: 8}}>
              <Text style={{ marginTop: 10 }}>Name:</Text>
              <Text style={styles.textInput}>ชื่อ</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.firstname}
              />

              <Text>Last Name:</Text>
              <Text style={styles.textInput}>นามสกุล</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.lastname}
              />

              <Text>ID No:</Text>
              <Text style={styles.textInput}>เลขบัตรประชาชน</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.identification}
              />

              <Text>Phone No:</Text>
              <Text style={styles.textInput}>เบอร์โทรศัพท์</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.phone ? this.state.phone : "-"}
              />

              <Text>Birthday:</Text>
              <Text style={styles.textInput}>วันเกิด</Text>
              <TextInput
                style={styles.inputStyle}
                // value={this.state.birthday}
                value={this.formatDate(this.state.birthday)}
              />

              <Text>Province:</Text>
              <Text style={styles.textInput}>จังหวัด</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.province}
              />

              <Text>Purpose:</Text>
              <Text style={styles.textInput}>วัตถุประสงค์ในการเดินทาง</Text>
              <Picker
                mode="dropdown"
                iosIcon={
                  <Icon
                    name="angle-down"
                    style={{ width: "8%", paddingHorizontal: 2 }}
                  />
                }
                style={styles.inputLightStyle}
                placeholder={
                  this.state.lang === "EN"
                    ? "Please select your travel purpose"
                    : "กรุณาเลือกวัตถุประสงค์ในการเดินทาง"
                }
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.purpose}
                onValueChange={(text) =>
                  this.setState({ purpose: text, purposeEtc: "" })
                }
                textStyle={{ fontSize: 14 }}
              >
                {/* <Picker.Item
                  label={
                    this.state.lang === "EN"
                      ? "Please select your travel purpose"
                      : "กรุณาเลือกวัตถุประสงค์ในการเดินทาง"
                  }
                  value=""
                /> */}
                {this.state.select_2.map((data) => {
                  return (
                    <Picker.Item
                      label={
                        this.state.lang === "EN"
                          ? data.purpose_travel_en
                          : data.purpose_travel_th
                      }
                      value={data.id}
                    />
                  );
                })}
              </Picker>

              {/* กรณีเลือกอื่นๆ */}
              {this.state.purpose == 3 && (
                <View>
                  <Text>Purpose:</Text>
                  <Text style={styles.textInput}>
                    กรุณาระบุวัตถุประสงค์ อื่นๆ
                  </Text>
                  <TextInput
                    style={styles.inputStyle1}
                    placeholder={
                      this.state.lang === "EN"
                        ? "Please enter purpose"
                        : "กรุณากรอกวัตถุประสงค์"
                    }
                    value={this.state.purposeEtc}
                    onChangeText={(text) => this.setState({ purposeEtc: text })}
                  ></TextInput>
                </View>
              )}
              {/* กรณีเลือกอื่นๆ */}
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
          {/* จบส่วนที่1 */}

          {/* ส่วนที่2 */}
          <View style={styles.containerSec2}>
            <View style={styles.contentInSec2}>
              <Text>Date:</Text>
              <Text style={styles.textInput}>วันออกเดินทาง</Text>
              <TouchableOpacity onPress={() => this.showDatePicker("start")}>
                <View style={styles.inputDate}>
                  <Text style={{ color: "#bfc6ea" }}>
                    {this.state.startDate}
                  </Text>
                </View>
              </TouchableOpacity>

              <Text>Time:</Text>
              <Text style={styles.textInput}>เวลาเดินทาง</Text>
              <TouchableOpacity onPress={() => this.showTimePicker("start")}>
                <View style={styles.inputDate}>
                  <Text style={{ color: "#bfc6ea" }}>
                    {this.state.startTime}
                  </Text>
                </View>
              </TouchableOpacity>

              <Text>Time:</Text>
              <Text style={styles.textInput}>สิ้นสุดเดินทาง</Text>
              <TouchableOpacity onPress={() => this.showTimePicker()}>
                <View style={styles.inputDate}>
                  <Text style={{ color: "#bfc6ea" }}>{this.state.endTime}</Text>
                </View>
              </TouchableOpacity>

              <Text>From:</Text>
              <Text style={styles.textInput}>ต้นทาง</Text>
              {this.state.airportCheck == false && (
                <View>
                  <Picker
                    mode="dropdown"
                    iosIcon={
                      <Icon
                        name="angle-down"
                        style={{ width: "8%", paddingHorizontal: 2 }}
                      />
                    }
                    style={styles.inputLightStyle}
                    placeholder={this.state.lang === "EN" ? "Please select from the flight." : "กรุณาเลือกเที่ยวบินต้นทาง"}
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.froms_id}
                    onValueChange={(text) =>
                      this.setState({ froms_id: text, froms: "" })
                    }
                    textStyle={{ fontSize: 14 }}
                  >
                    {/* <Picker.Item
                      label={
                        this.state.lang === "EN"
                          ? "Please select from the flight"
                          : "กรุณาเลือกเที่ยวบินต้นทาง"
                      }
                      value=""
                    /> */}

                    {this.state.select_1.map((data) => {
                      return (
                        <Picker.Item
                          label={
                            this.state.lang === "EN"
                              ? data.airport_name_en +
                                "(" +
                                data.airport_code +
                                ")"
                              : data.airport_name +
                                "(" +
                                data.airport_code +
                                ")"
                          }
                          value={data.id}
                        />
                      );
                    })}
                  </Picker>
                </View>
              )}
              {/* กรณีติ๊ก Checkbox */}
              {this.state.airportCheck == true && (
                <View>
                  <TextInput
                    style={styles.inputStyle1}
                    placeholder={
                      this.state.lang === "EN"
                        ? "Please enter from the flight."
                        : "กรุณากรอกเที่ยวบินต้นทาง"
                    }
                    value={this.state.froms}
                    onChangeText={(text) =>
                      this.setState({ froms: text, froms_id: "" })
                    }
                  ></TextInput>
                </View>
              )}
              {/* กรณีติ๊ก Checkbox */}

              <Text>To:</Text>
              <Text style={styles.textInput}>ปลายทาง</Text>
              {this.state.airportCheck == false && (
                <View>
                  <Picker
                    mode="dropdown"
                    iosIcon={
                      <Icon
                        name="angle-down"
                        style={{ width: "8%", paddingHorizontal: 2 }}
                      />
                    }
                    style={styles.inputLightStyle}
                    placeholder={this.state.lang === "EN" ? "Please select end the flight." : "กรุณาเลือกเที่ยวบินปลายทาง"}
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.tos_id}
                    onValueChange={(text) => this.setState({ tos_id: text })}
                    textStyle={{ fontSize: 14 }}
                  >
                    {/* <Picker.Item
                      label={
                        this.state.lang === "EN"
                          ? "Please select end the flight"
                          : "กรุณาเลือกเที่ยวบินปลายทาง"
                      }
                      value=""
                    /> */}
                    {this.state.select_1.map((data) => {
                      return (
                        <Picker.Item
                          label={
                            this.state.lang === "EN"
                              ? data.airport_name_en +
                                "(" +
                                data.airport_code +
                                ")"
                              : data.airport_name +
                                "(" +
                                data.airport_code +
                                ")"
                          }
                          value={data.id}
                        />
                      );
                    })}
                  </Picker>
                </View>
              )}
              {/* กรณีติ๊ก Checkbox */}
              {this.state.airportCheck == true && (
                <View>
                  <TextInput
                    style={styles.inputStyle1}
                    placeholder={
                      this.state.lang === "EN"
                        ? "Please enter end the flight."
                        : "กรุณากรอกเที่ยวบินปลายทาง"
                    }
                    value={this.state.tos}
                    onChangeText={(text) => this.setState({ tos: text })}
                  ></TextInput>
                </View>
              )}

              {/* กรณีติ๊ก Checkbox */}

              {/* Checkbox */}
              <View style={styles.checkboxContainer}>
                <CheckBox
                  checked={this.state.airportCheck}
                  onPress={() => {
                    this.setState({
                      airportCheck: !this.state.airportCheck,
                      tos_id: "",
                      tos: "",
                      froms_id: "",
                      froms_id: "",
                    });
                  }}
                  style={styles.checkbox}
                  title={this.state.lang === "EN" ? "Baggage" : "อื่นๆ"}
                />
              </View>
              {/* Checkbox */}

              <Text>Flight:</Text>
              <Text style={styles.textInput}>เที่ยวบิน</Text>
              <TextInput
                style={styles.inputStyle1}
                placeholder={this.state.lang === "EN" ? "Please enter your flight." : "กรุณากรอกเที่ยวบิน"}
                value={this.state.firstflight}
                onChangeText={(text) => this.setState({ firstflight: text })}
              ></TextInput>

              <Text>Baggage:</Text>
              <Text style={styles.textInput}>สัมภาระ</Text>
              {/* Checkbox */}
              <View style={styles.checkboxContainer}>
                <CheckBox
                  checked={this.state.checkBaggage}
                  onPress={() => {
                    this.setState({
                      checkBaggage: !this.state.checkBaggage,
                      baggage: "",
                    });
                  }}
                  style={styles.checkbox}
                  title={this.state.lang === "EN" ? "Baggage" : "สัมภาระ"}
                />
              </View>
              {/* Checkbox */}

              {/* กรณีติ๊ก checkbox */}
              {this.state.checkBaggage == true && (
                <View>
                  <TextInput
                    style={styles.inputStyle1}
                    placeholder={this.state.lang === "EN" ? "Please enter your baggage weight." : "กรุณากรอกน้ำหนักสัมภาระ"}
                    value={this.state.baggage}
                    onChangeText={(text) => this.setState({ baggage: text })}
                  ></TextInput>
                </View>
              )}
              {/* กรณีติ๊ก checkbox */}

              <DateTimePickerModal
                // isVisible={isTimePickerVisible}
                mode="time"
                // onConfirm={handleTimePicker}
                // onCancel={hideTimePicker}
              />
            </View>
          </View>
          {/* จบส่วนที่2 */}

          {/* เพิ่มเที่ยวบิน */}
          {this.state.flight.map((item, index) => {
            return (
              <View style={{ marginTop: "8%" }}>
                <View style={styles.containerSec2}>
                  <View style={styles.contentInSec2}>
                    <Text>Date:</Text>
                    <Text style={styles.textInput}>วันออกเดินทาง</Text>
                    <TouchableOpacity
                      onPress={() => this.showDatePicker(index)}
                    >
                      <View style={styles.inputDate}>
                        <Text style={{ color: "#bfc6ea" }}>
                          {item.data.dates}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <Text>Time:</Text>
                    <Text style={styles.textInput}>เวลาเดินทาง</Text>
                    <TouchableOpacity
                      onPress={() => this.showTimePicker("start", index)}
                    >
                      <View style={styles.inputDate}>
                        <Text style={{ color: "#bfc6ea" }}>
                          {item.data.startTime}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <Text>Time:</Text>
                    <Text style={styles.textInput}>สิ้นสุดเดินทาง</Text>
                    <TouchableOpacity
                      onPress={() => this.showTimePicker(index)}
                    >
                      <View style={styles.inputDate}>
                        <Text style={{ color: "#bfc6ea" }}>
                          {item.data.endTime}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <Text>From:</Text>
                    <Text style={styles.textInput}>ต้นทาง</Text>
                    {item.data.checkEtc == false && (
                      <View>
                        <Picker
                          mode="dropdown"
                          iosIcon={
                            <Icon
                              name="angle-down"
                              style={{ width: "8%", paddingHorizontal: 2 }}
                            />
                          }
                          style={styles.inputLightStyle}
                          placeholder={this.state.lang === "EN" ? "Please select from the flight." : "กรุณาเลือกเที่ยวบินต้นทาง"}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={item.data.froms_id}
                          onValueChange={(text) => {
                            let flight = [...this.state.flight];
                            let item = { ...flight[index] };
                            let data = { ...item["data"] };
                            data.froms = "";
                            data.froms_id = text;
                            item["data"] = data;
                            flight[index] = item;
                            this.setState({ flight: flight });
                            console.log(this.state.flight);
                          }}
                          textStyle={{ fontSize: 14 }}
                        >
                          {/* <Picker.Item
                            label={
                              this.state.lang === "EN"
                                ? "Please select form the flight"
                                : "กรุณาเลือกเที่ยวบินต้นทาง"
                            }
                            value=""
                          /> */}

                          {this.state.select_1.map((data) => {
                            return (
                              <Picker.Item
                                label={
                                  this.state.lang === "EN"
                                    ? data.airport_name_en +
                                      "(" +
                                      data.airport_code +
                                      ")"
                                    : data.airport_name +
                                      "(" +
                                      data.airport_code +
                                      ")"
                                }
                                value={data.id}
                              />
                            );
                          })}
                        </Picker>
                      </View>
                    )}
                    {/* กรณีติ๊ก Checkbox */}
                    {item.data.checkEtc == true && (
                      <View>
                        <TextInput
                          style={styles.inputStyle1}
                          placeholder={
                            this.state.lang === "EN"
                              ? "Please enter from the flight."
                              : "กรุณากรอกเที่ยวบินต้นทาง"
                          }
                          onChangeText={(text) => {
                            let flight = [...this.state.flight];
                            let item = { ...flight[index] };
                            let data = { ...item["data"] };
                            data.froms = text;
                            data.froms_id = "";
                            item["data"] = data;
                            flight[index] = item;
                            this.setState({ flight: flight });
                            console.log(this.state.flight);
                          }}
                        ></TextInput>
                      </View>
                    )}
                    {/* กรณีติ๊ก Checkbox */}

                    <Text>To:</Text>
                    <Text style={styles.textInput}>ปลายทาง</Text>
                    {item.data.checkEtc == false && (
                      <View>
                        <Picker
                          mode="dropdown"
                          iosIcon={
                            <Icon
                              name="angle-down"
                              style={{ width: "8%", paddingHorizontal: 2 }}
                            />
                          }
                          style={styles.inputLightStyle}
                          placeholder={this.state.lang === "EN" ? "Please select end the flight." : "กรุณาเลือกเที่ยวบินปลายทาง"}
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={item.data.tos_id}
                          onValueChange={(text) => {
                            let flight = [...this.state.flight];
                            let item = { ...flight[index] };
                            let data = { ...item["data"] };
                            data.tos = "";
                            data.tos_id = text;
                            item["data"] = data;
                            flight[index] = item;
                            this.setState({ flight: flight });
                            console.log(this.state.flight);
                          }}
                          textStyle={{ fontSize: 14 }}
                        >
                          {/* <Picker.Item
                            label={this.state.lang === "EN" ? "Please select from the flight." : "กรุณาเลือกเที่ยวบินต้นทาง"}
                            value=""
                          /> */}
                          {this.state.select_1.map((data) => {
                            return (
                              <Picker.Item
                                label={
                                  this.state.lang === "EN"
                                    ? data.airport_name_en +
                                      "(" +
                                      data.airport_code +
                                      ")"
                                    : data.airport_name +
                                      "(" +
                                      data.airport_code +
                                      ")"
                                }
                                value={data.id}
                              />
                            );
                          })}
                        </Picker>
                      </View>
                    )}
                    {/* กรณีติ๊ก Checkbox */}
                    {item.data.checkEtc == true && (
                      <View>
                        <TextInput
                          style={styles.inputStyle1}
                          placeholder={
                            this.state.lang === "EN"
                              ? "Please enter end the flight."
                              : "กรุณากรอกเที่ยวบินปลายทาง"
                          }
                          value={item.data.tos}
                          onChangeText={(text) => {
                            let flight = [...this.state.flight];
                            let item = { ...flight[index] };
                            let data = { ...item["data"] };
                            data.tos = text;
                            data.tos_id = "";
                            item["data"] = data;
                            flight[index] = item;
                            this.setState({ flight: flight });
                            console.log(this.state.flight);
                          }}
                        ></TextInput>
                      </View>
                    )}

                    {/* กรณีติ๊ก Checkbox */}

                    {/* Checkbox */}
                    <View style={styles.checkboxContainer}>
                      <CheckBox
                        checked={item.data.checkEtc}
                        onPress={() => {
                          let flight = [...this.state.flight];
                          let item = { ...flight[index] };
                          let data = { ...item["data"] };
                          data.checkEtc = !data.checkEtc;
                          data.froms = "";
                          data.froms_id = "";
                          data.tos = "";
                          data.tos_id = "";
                          item["data"] = data;
                          flight[index] = item;
                          this.setState({ flight: flight });
                          console.log(this.state.flight);
                        }}
                        style={styles.checkbox}
                        title={this.state.lang === "EN" ? "Baggage" : "อื่นๆ"}
                      />
                    </View>
                    {/* Checkbox */}

                    <Text>Flight:</Text>
                    <Text style={styles.textInput}>เที่ยวบิน</Text>
                    <TextInput
                      style={styles.inputStyle1}
                      placeholder="กรุณากรอกเที่ยวบิน"
                      value={item.data.flight}
                      onChangeText={(text) => {
                        let flight = [...this.state.flight];
                        let item = { ...flight[index] };
                        let data = { ...item["data"] };
                        data.flight = text;
                        item["data"] = data;
                        flight[index] = item;
                        this.setState({ flight: flight });
                        console.log(this.state.flight);
                      }}
                    ></TextInput>

                    <Text>Baggage:</Text>
                    <Text style={styles.textInput}>สัมภาระ</Text>
                    {/* Checkbox */}
                    <View style={styles.checkboxContainer}>
                      <CheckBox
                        checked={item.data.checkBaggage}
                        onPress={() => {
                          let flight = [...this.state.flight];
                          let item = { ...flight[index] };
                          let data = { ...item["data"] };
                          data.checkBaggage = !data.checkBaggage;
                          data.baggage = "";
                          item["data"] = data;
                          flight[index] = item;
                          this.setState({ flight: flight });
                          console.log(this.state.flight);
                        }}
                        style={styles.checkbox}
                        title={this.state.lang === "EN" ? "Baggage" : "สัมภาระ"}
                      />
                    </View>
                    {/* Checkbox */}

                    {/* กรณีติ๊ก checkbox */}
                    {item.data.checkBaggage == true && (
                      <View>
                        <TextInput
                          style={styles.inputStyle1}
                          placeholder={this.state.lang === "EN" ? "Please enter your baggage weight." : "กรุณากรอกน้ำหนักสัมภาระ"}
                          value={item.data.baggage}
                          onChangeText={(text) => {
                            let flight = [...this.state.flight];
                            let item = { ...flight[index] };
                            let data = { ...item["data"] };
                            data.baggage = text;
                            item["data"] = data;
                            flight[index] = item;
                            this.setState({ flight: flight });
                            console.log(this.state.flight);
                          }}
                        ></TextInput>
                      </View>
                    )}
                    {/* กรณีติ๊ก checkbox */}

                    <View style={{ marginRight: 20 }}>
                      <Button
                        iconLeft
                        light
                        style={styles.btnDelFlightStyle}
                        onPress={() =>
                          this.deleteFlight(index, this.state.flight)
                        }
                      >
                        <Icons
                          name="md-remove-circle"
                          size={20}
                          style={{
                            marginLeft: 10,
                            marginRight: 5,
                            color: "white",
                          }}
                        />
                        <Text
                          style={{
                            color: "white",
                            marginRight: 10,
                            fontSize: 14,
                          }}
                        >
                          {this.state.lang === "EN" ? "Delete" : "ลบ"}
                        </Text>
                      </Button>
                    </View>

                    <DateTimePickerModal
                      // isVisible={isTimePickerVisible}
                      mode="time"
                      // onConfirm={handleTimePicker}
                      // onCancel={hideTimePicker}
                    />
                  </View>
                </View>
              </View>
            );
          })}

          {/* เพิ่มเที่ยวบิน */}

          {/* โชว์ DateTimePickerModal*/}
          <DateTimePickerModal
            isVisible={this.state.isDatePickerVisible}
            mode="date"
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
          />

          <DateTimePickerModal
            isVisible={this.state.isTimePickerVisible}
            mode="time"
            onConfirm={this.handleTimePicker}
            onCancel={this.hideTimePicker}
          />

          {/* Action Button */}
          <View style={styles.buttonContainer}>
            <Button
              style={styles.btnAddFlightStyle}
              onPress={() =>
                this.setState({
                  flight: [...this.state.flight, this.state.flightItem],
                })
              }
            >
              <Icon
                name="plus"
                size={20}
                style={{ color: "white", marginLeft: 10, marginRight: 5 }}
              />
              <Text style={{ color: "white", marginRight: 10 }}>
                {this.state.lang === "EN" ? "Add Flight" : "เพิ่มเที่ยวบิน"}
              </Text>
            </Button>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingVertical: 20,
              marginBottom: 12,
            }}
          >
            <View style={styles.buttonContainer}>
              <Button
                style={styles.btnConfirmStyle}
                onPress={() => this.onPressSend()}
              >
                <Text style={{ color: "white" }}>
                  {this.state.lang === "EN" ? "Submit" : "ยืนยัน"}
                </Text>
              </Button>
            </View>

            <View style={styles.buttonContainer}>
              <Button style={styles.btnCancelStyle}>
                <Text style={{ color: "white" }}>
                  {this.state.lang === "EN" ? "Cancle" : "ยกเลิก"}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

//จบ

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  containerSec1: {
    marginHorizontal: 8,
    marginVertical: 18,
  },
  textHeader: {
    alignItems: "center",
    padding: 12,
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
  textInput: {
    color: "grey",
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
  inputLightStyle1: {
    borderWidth: 1,
    borderRadius: 10,
    // height: HEIGHT / 15,
    height: HEIGHT / 18,
    width: "100%",
    marginTop: 10,
    paddingLeft: 10,
    marginBottom: 10,
    borderColor: "#007aff",
  },
  arrowDownStyle: {
    backgroundColor: "#F4F4F4",
  },
  containerSec2: {
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#398DDD",
  },
  contentInSec2: {
    padding: 12,
  },
  buttonContainer: {
    alignSelf: "center",
    justifyContent: "center",
    paddingTop: 20,
    width: "30%",
    borderRadius: 4,
  },
  buttonContainer1: {
    alignSelf: "center",
    justifyContent: "center",
    paddingTop: 20,
    width: "30%",
    borderRadius: 4,
    marginTop: 2,
    marginBottom: 18,
  },
  btnAddFlightStyle: {
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#005ce6",
    borderRadius: 10,
  },
  btnDelFlightStyle: {
    backgroundColor: "#b30000",
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  btnConfirmStyle: {
    backgroundColor: "#449D44",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    paddingHorizontal: 32,
  },
  btnCancelStyle: {
    backgroundColor: "#5A6268",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    paddingHorizontal: 32,
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
  checkboxContainer: {
    flexDirection: "row",
    margin: 5,
    justifyContent: "flex-start",
  },
  checkbox: {
    alignSelf: "center",
    borderRadius: 1,
    height: HEIGHT / 40,
    width: "6%",
    // padding: 20,
    margin: 8,
  },
  label: {
    margin: 12,
  },
});
