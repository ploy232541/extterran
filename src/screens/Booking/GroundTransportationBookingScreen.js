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
import { CheckBox, Picker } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

const HEIGHT = Dimensions.get("window").height;

export default class GroundTransportationBookingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: "",
      lang_id: "",
      firstname: "",
      lastname: "",
      identification: "",
      phone: "",
      province: "",
      district: "",
      subdistrict: "",
      zipcode: "",
      address: "",
      address_moo: "",
      address_village: "",
      address_alley: "",
      address_road: "",
      startDate: "DD/MM/YYYY",
      endDate: "DD/MM/YYYY",
      startTime: "00:00",
      endTime: "00:00",
      isDatePickerVisible: false,
      date: new Date(),
      isTimePickerVisible: false,
      isStartTime: false,
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
                identification: row.identification,
                phone: row.phone,
                province:
                  this.state.lang === "EN" ? row.pv_name_en : row.pv_name_th,
                district:
                  this.state.lang === "EN" ? row.dt_name_en : row.dt_name_th,
                subdistrict:
                  this.state.lang === "EN" ? row.sdt_name_en : row.sdt_name_th,
                zipcode: row.zipcode,
                address: row.address,
                address_moo: row.address_moo,
                address_village: row.address_village,
                address_alley: row.address_alley,
                address_road: row.address_road,
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {}
  }

  formatTime = (date) => {
    let d = new Date(date),
      hours = d.getHours().toString(),
      minutes = d.getMinutes().toString();

    hours.length < 2 ? (hours = "0" + hours) : null;
    minutes.length < 2 ? (minutes = "0" + minutes) : null;

    return [hours, minutes].join(":");
  };

  showTimePicker = (props) => {
    this.setState({ isTimePickerVisible: true });
    if (props == "start") {
      this.setState({ isStartTime: true });
    }
  };

  hideTimePicker = () => {
    this.setState({ isTimePickerVisible: false });
  };

  handleTimePicker = (date) => {
    console.log(this.state.isStartTime);
    date = this.formatTime(date);
    if (this.state.isStartTime) {
      this.setState({ startTime: date, isStartTime: false });
    } else {
      this.setState({ endTime: date });
    }
    this.hideTimePicker();
  };

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
  };

  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };
  handleConfirm = (dates) => {
    var date = this.formatDate(dates);
    var dates = this.formatDatetotal(dates);

    if (this.state.isStart) {
      this.setState({ startDate: date, startcul: dates, isStart: false });
      if (this.state.endcul != 0) {
        this.culDate(dates, this.state.endcul);
      }
    } else {
      this.setState({ endDate: date, endcul: dates });
      if (this.state.startcul != 0) {
        this.culDate(this.state.startcul, dates);
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
              <Text style={{ paddingTop: 16, fontSize: 18 }}>
                Ground Transportation
              </Text>
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

            <Text>Resident:</Text>
            <Text style={styles.textInput}>ที่อยู่</Text>
            <TextInput
              style={styles.inputStyle}
              value={
                this.state.address +
                " หมู่" +
                this.state.address_moo +
                " หมู่บ้าน" +
                this.state.address_village +
                " ซอย" +
                this.state.address_alley +
                " ถนน" +
                this.state.address_road +
                " "
              }
            />

            <Text>Phone No:</Text>
            <Text style={styles.textInput}>เบอร์โทรศัพท์</Text>
            <TextInput style={styles.inputStyle} value={this.state.phone} />

            <Text>Province:</Text>
            <Text style={styles.textInput}>จังหวัด</Text>
            <TextInput style={styles.inputStyle} value={this.state.province} />

            <Text>District:</Text>
            <Text style={styles.textInput}>อำเภอ</Text>
            <TextInput style={styles.inputStyle} value={this.state.district} />

            <Text>Subdistrict:</Text>
            <Text style={styles.textInput}>ตำบล</Text>
            <TextInput
              style={styles.inputStyle}
              value={this.state.subdistrict}
            />

            <Text>Zip:</Text>
            <Text style={styles.textInput}>รหัสไปรษณีย์</Text>
            <TextInput
              style={styles.inputStyle}
              value={this.state.zipcode.toString()}
            />
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
              <TouchableOpacity onPress={() => this.showDatePicker()}>
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

              <Text>From:</Text>
              <Text style={styles.textInput}>ต้นทาง</Text>
              <TextInput
                style={styles.inputStyle1}
                placeholder="กรุณากรอกต้นทาง"
              ></TextInput>

              <Text>To:</Text>
              <Text style={styles.textInput}>ปลายทาง</Text>
              <TextInput
                style={styles.inputStyle1}
                placeholder="กรุณากรอกปลายทาง"
              ></TextInput>
            </View>
          </View>
          {/* จบส่วนที่2 */}

          {/* Action Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.btnAddFlightStyle}>
              <Text style={{ color: "white" }}>เพิ่ม</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingVertical: 40,
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
  },
  btnAddFlightStyle: {
    backgroundColor: "#0097fc",
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
});
