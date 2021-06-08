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
} from "react-native";
import { Divider, Avatar } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { httpClient } from "../../core/HttpClient";
import { CheckBox } from "react-native-elements";
import { Picker } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

const HEIGHT = Dimensions.get("window").height;

// เริ่ม
export default class FlightBookingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: "",
      lang_id: "",
      firstname: "",
      lastname: "",
      position: "",
      dept: "",
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
      formFlight: "",
      toFlight: "",
      purpose: "",
      purposeEtc: "",
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
    if (props == "start" && index==null) {
      this.setState({ isStartTime: true });
    } else if (props == "start" && index>=0) {
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
  formatDatetotal = (date) => {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [month, day, year].join("/");
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
    var dates = this.formatDatetotal(dates);

    if (this.state.isStart) {
      this.setState({ startDate: datess, startcul: dates, isStart: false });
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

  culDate = (startcul, endcul) => {
    let date1 = new Date(startcul);
    let date2 = new Date(endcul);
    this.setState({
      total: "0",
    });
    if (date2 >= date1) {
      let diffInMs = Math.abs(date2 - date1);
      let totals = diffInMs / (1000 * 60 * 60 * 24) + 1;
      this.setState({
        total: totals.toString(),
      });
    }
  };
  deleteFlight(index, courseItem) {
    let itemCopy = [...courseItem];
    itemCopy.splice(index, 1);
    this.setState({
      flight: itemCopy,
    });
  }

  render() {
    return (
      <View style={styles.background}>
        <ScrollView>
          {/* Start flight booking form section 1 */}
          <View style={styles.containerSec1}>
            <View style={styles.textHeader}>
              <Text style={{ color: "#398DDD", fontSize: 20 }}>
                บริษัทเอ็กซ์เธอร์แลน ประเทศไทย จำกัด
              </Text>
              <Text style={{ paddingTop: 16, fontSize: 18 }}>Flight</Text>
            </View>

            <Divider style={{ paddingBottom: 1, marginTop: 5 }} />

            {/* ส่วนที่1 */}
            <Text style={{ marginTop: 10 }}>Name:</Text>
            <Text style={styles.textInput}>ชื่อ</Text>
            <TextInput style={styles.inputStyle} value={this.state.firstname} />

            <Text>Last Name:</Text>
            <Text style={styles.textInput}>นามสกุล</Text>
            <TextInput style={styles.inputStyle} value={this.state.lastname} />

            <Text>ID No:</Text>
            <Text style={styles.textInput}>เลขบัตรประชาชน</Text>
            <TextInput
              style={styles.inputStyle}
              value={this.state.identification}
            />

            <Text>Phone No:</Text>
            <Text style={styles.textInput}>เบอร์โทรศัพท์</Text>
            <TextInput style={styles.inputStyle} value={this.state.phone} />

            <Text>Birthday:</Text>
            <Text style={styles.textInput}>วันเกิด</Text>
            <TextInput
              style={styles.inputStyle}
              // value={this.state.birthday}
              value={this.formatDate(this.state.birthday)}
            />

            <Text>Province:</Text>
            <Text style={styles.textInput}>จังหวัด</Text>
            <TextInput style={styles.inputStyle} value={this.state.province} />

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
              placeholder={this.state.lang === "EN" ? "Selecte" : "เลือก"}
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.purpose}
              onValueChange={(text) => this.setState({ purpose: text })}
              textStyle={{ fontSize: 14 }}
            >
              <Picker.Item
                label={
                  this.state.lang === "EN"
                    ? "Please select your travel purpose"
                    : "กรุณาเลือกวัตถุประสงค์ในการเดินทาง"
                }
                value=""
              />
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
          {/* จบส่วนที่1 */}

          <View
            style={{
              marginVertical: 40,
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
                    placeholder={this.state.lang === "EN" ? "Selecte" : "เลือก"}
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.formFlight}
                    onValueChange={(text) =>
                      this.setState({ formFlight: text })
                    }
                    textStyle={{ fontSize: 14 }}
                  >
                    <Picker.Item
                      label={
                        this.state.lang === "EN"
                          ? "Please select a source"
                          : "กรุณาเลือกต้นทาง"
                      }
                      value=""
                    />

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
                        ? "Please enter the departure flight"
                        : "กรุณากรอกเที่ยวบินต้นทาง"
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
                    placeholder={this.state.lang === "EN" ? "Selecte" : "เลือก"}
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.toFlight}
                    onValueChange={(text) => this.setState({ toFlight: text })}
                    textStyle={{ fontSize: 14 }}
                  >
                    <Picker.Item
                      label={
                        this.state.lang === "EN"
                          ? "Please select a source"
                          : "กรุณาเลือกต้นทาง"
                      }
                      value=""
                    />
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
                        ? "Please enter destination flight"
                        : "กรุณากรอกเที่ยวบินปลายทาง"
                    }
                  ></TextInput>
                </View>
              )}

              {/* กรณีติ๊ก Checkbox */}

              {/* Checkbox */}
              <View style={styles.checkboxContainer}>
                <CheckBox
                  checked={this.state.airportCheck}
                  onPress={() => {
                    this.setState({ airportCheck: !this.state.airportCheck });
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
              ></TextInput>

              <Text>Baggage:</Text>
              <Text style={styles.textInput}>สัมภาระ</Text>
              {/* Checkbox */}
              <View style={styles.checkboxContainer}>
                <CheckBox
                  checked={this.state.checkBaggage}
                  onPress={() => {
                    this.setState({ checkBaggage: !this.state.checkBaggage });
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
                    placeholder="กรุณากรอกน้ำหนักสัมภาระ"
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
          <View style={{ marginBottom: 12, marginTop: 12 }}>
            {this.state.flight.map((item, index) => {
              return (
                <View>
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
                            placeholder={
                              this.state.lang === "EN" ? "Selecte" : "เลือก"
                            }
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
                            <Picker.Item
                              label={
                                this.state.lang === "EN"
                                  ? "Please select a source"
                                  : "กรุณาเลือกต้นทาง"
                              }
                              value=""
                            />

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
                                        ")" +
                                        data.id
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
                                ? "Please enter the departure flight"
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
                            placeholder={
                              this.state.lang === "EN" ? "Selecte" : "เลือก"
                            }
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
                            <Picker.Item
                              label={
                                this.state.lang === "EN"
                                  ? "Please select a source"
                                  : "กรุณาเลือกต้นทาง"
                              }
                              value=""
                            />
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
                                ? "Please enter destination flight"
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
                            item["data"] = data;
                            flight[index] = item;
                            this.setState({ flight: flight });
                            console.log(this.state.flight);
                          }}
                          style={styles.checkbox}
                          title={
                            this.state.lang === "EN" ? "Baggage" : "สัมภาระ"
                          }
                        />
                      </View>
                      {/* Checkbox */}

                      {/* กรณีติ๊ก checkbox */}
                      {item.data.checkBaggage == true && (
                        <View>
                          <TextInput
                            style={styles.inputStyle1}
                            placeholder="กรุณากรอกน้ำหนักสัมภาระ"
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

                      <DateTimePickerModal
                        // isVisible={isTimePickerVisible}
                        mode="time"
                        // onConfirm={handleTimePicker}
                        // onCancel={hideTimePicker}
                      />
                    </View>
                  </View>

                  <View style={styles.buttonContainer1}>
                    <TouchableOpacity
                      style={styles.btnDelFlightStyle}
                      onPress={() =>
                        this.deleteFlight(index, this.state.flight)
                      }
                    >
                      <Text style={{ color: "white" }}>ลบเที่ยวบิน</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }
            )
            }
          </View>
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
            <TouchableOpacity
              style={styles.btnAddFlightStyle}
              onPress={() =>
                this.setState({
                  flight: [...this.state.flight, this.state.flightItem],
                })
              }
            >
              <Text style={{ color: "white" }}>เพิ่มเที่ยวบิน</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingVertical: 24,
              marginBottom: 40,
            }}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.btnConfirmStyle}>
                <Text style={{ color: "white" }}>ยืนยัน</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.btnCancelStyle}>
                <Text style={{ color: "white" }}>ยกเลิก</Text>
              </TouchableOpacity>
            </View>
          </View>
        
        </ScrollView>
      </View>
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
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 18,
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
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#999999",
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
    marginTop: 2,
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
    backgroundColor: "#0097fc",
    padding: 8,
    alignItems: "center",
    borderRadius: 4,
  },
  btnDelFlightStyle: {
    backgroundColor: "red",
    padding: 8,
    alignItems: "center",
    borderRadius: 4,
  },
  btnConfirmStyle: {
    backgroundColor: "#449D44",
    padding: 8,
    alignItems: "center",
    borderRadius: 16,
  },
  btnCancelStyle: {
    backgroundColor: "#5A6268",
    padding: 8,
    alignItems: "center",
    borderRadius: 16,
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
