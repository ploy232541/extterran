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
import { Button, CheckBox, Picker } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import Icons from "react-native-vector-icons/Ionicons";
import { Alert } from "react-native";

const HEIGHT = Dimensions.get("window").height;

export default class GroundTransportationBookingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: "",
      lang: "",
      lang_id: "",
      firstname: "",
      lastname: "",
      identification: "",
      resident: "",
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
      startTime: "00:00",
      froms: "",
      tos: "",
      isDatePickerVisible: false,
      date: new Date(),
      isTimePickerVisible: false,
      isStartTime: false,
      formGround: "",
      toGround: "",
      tem: -1,
      ground: [],
      groundItem: {
        data: {
          dates: "DD/MM/YYYY",
          startTime: "00:00",
          froms: "",
          tos: "",
        },
      },
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
                identification: row.identification,
                phone: row.phone,
                province:
                  this.state.lang === "EN" ? row.pv_name_en : row.pv_name_th,
                district:
                  this.state.lang === "EN" ? row.dt_name_en : row.dt_name_th,
                subdistrict:
                  this.state.lang === "EN" ? row.sdt_name_en : row.sdt_name_th,
                zipcode: row.zipcode ? row.zipcode : "-",
                address: row.address ? row.address : "-",
                address_moo: row.address_moo ? row.address_moo : "-",
                address_village: row.address_village
                  ? row.address_village
                  : "-",
                address_alley: row.address_alley ? row.address_alley : "-",
                address_road: row.address_road ? row.address_road : "-",
                resident: row.address
                  ? row.address
                  : "-" + " หมู่" + row.address_moo
                  ? row.address_moo
                  : "-" + " หมู่บ้าน" + row.address_village
                  ? row.address_village
                  : "-" + " ซอย" + row.address_alley
                  ? row.address_alley
                  : "-" + " ถนน" + row.address_road
                  ? row.address_road
                  : "-",
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {}
  }

  // เวลา
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
        let ground = [...this.state.ground];
        let item = { ...ground[tem] };
        let data = { ...item["data"] };
        data.startTime = date;
        item["data"] = data;
        ground[tem] = item;
        this.setState({ ground: ground, tem: -1, isStartTime: false });
      }
    } else if (this.state.tem >= 0) {
      if (this.state.tem >= 0) {
        let tem = this.state.tem;
        let ground = [...this.state.ground];
        let item = { ...ground[tem] };
        let data = { ...item["data"] };
        data.endTime = date;
        item["data"] = data;
        ground[tem] = item;
        this.setState({ ground: ground, tem: -1 });
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
        let ground = [...this.state.ground];
        let item = { ...ground[tem] };
        let data = { ...item["data"] };
        data.dates = datess;
        item["data"] = data;
        ground[tem] = item;
        this.setState({ ground: ground, tem: -1 });
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
  deleteGround(index, courseItem) {
    let itemCopy = [...courseItem];
    itemCopy.splice(index, 1);
    this.setState({
      ground: itemCopy,
    });
  }
  //บันทึกข้อมูล
  onPressSend = () => {
    try {
      const {
        startDate,
        startTime,
        froms,
        tos,
        user_id,
        district,
        subdistrict,
        zipcode,
        resident,
        province,
        ground,
      } = this.state;
      if (startDate == "DD/MM/YYYY") {
        this.state.lang === "EN"
          ? Alert.alert("Please select a departure date")
          : Alert.alert("กรุณาเลือกวันเดินทาง");
      } else if (startTime == "00:00") {
        this.state.lang === "EN"
          ? Alert.alert("Please select a travel time")
          : Alert.alert("กรุณาเลือกเวลาเดินทาง");
      } else if (froms == "") {
        this.state.lang === "EN"
          ? Alert.alert("Please select a departure .")
          : Alert.alert("โปรดเลือกต้นทาง");
      } else if (tos == "") {
        this.state.lang === "EN"
          ? Alert.alert("Please select destination ")
          : Alert.alert("โปรดเลือกปลายทาง");
      } else {
        var end_i = ground.length - 1;
        var err = false;

        if (ground.length > 0) {
          var index = 0;
          do {
            err = true;
            var param = ground[index].data;

            if (param.dates == "DD/MM/YYYY") {
              this.state.lang === "EN"
                ? Alert.alert(
                    "Please select a departure date" +
                      " \n ( field " +
                      (index + 2) +
                      ")"
                  )
                : Alert.alert(
                    "กรุณาเลือกวันเดินทาง" +
                      " \n (ช่องกรอกที่  " +
                      (index + 2) +
                      ")"
                  );
            } else if (param.startTime == "00:00") {
              this.state.lang === "EN"
                ? Alert.alert(
                    "Please select a travel time" +
                      " \n ( field " +
                      (index + 2) +
                      ")"
                  )
                : Alert.alert(
                    "กรุณาเลือกเวลาเดินทาง" +
                      " \n (ช่องกรอกที่  " +
                      (index + 2) +
                      ")"
                  );
            } else if (param.froms == "") {
              this.state.lang === "EN"
                ? Alert.alert(
                    "Please select a departure " +
                      " \n ( field " +
                      (index + 2) +
                      ")"
                  )
                : Alert.alert(
                    "โปรดเลือกต้นทาง" + " \n (ช่องกรอกที่  " + (index + 2) + ")"
                  );
            } else if (param.tos == "") {
              this.state.lang === "EN"
                ? Alert.alert(
                    "Please select destination " +
                      " \n ( field " +
                      (index + 2) +
                      ")"
                  )
                : Alert.alert(
                    "โปรดเลือกปลายทาง" +
                      " \n (ช่องกรอกที่  " +
                      (index + 2) +
                      ")"
                  );
            } else {
              err = !err;
            }
            index++;
          } while (index <= end_i && err != true);
        }
        if ((err != true && ground.length > 0) || ground.length < 1) {
          const data = {
            user_id,
            resident,
            province,
            district,
            subdistrict,
            zip: zipcode,
            froms,
            tos,
            startDate,
            startTime,
            ground,
          };
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
                    .post(`/Training/InsertGroundBooking`, data)
                    .then((response) => {
                      const result = response.data;

                      if (result === true) {
                        Alert.alert(
                          this.state.lang === "EN" ? "Alert" : "แจ้งเตือน",
                          this.state.lang === "EN"
                            ? "Problem reported"
                            : "บันทึกรถสำเร็จ",
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
                            : "ไม่สามารถบันทึกที่พักได้"
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
      froms: "",
      tos: "",
      startDate: "DD/MM/YYYY",
      startTime: "00:00",
      ground: [],
    });
  };

  render() {
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
            marginBottom: 20,
          }}
        >
          {/* Start ground booking form section 1 */}
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
                : "บริษัท เอ็กซ์เธอร์แอน (ประเทศไทย) จำกัด"}
            </Text>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 16,
                marginTop: 12,
                marginBottom: 15,
              }}
            >
              {this.state.lang === "EN" ? "Ground Transportation" : "รถยนต์"}
            </Text>
            {/* </View> */}

            <View>
              <Divider style={{ backgroundColor: "black", borderWidth: 2 }} />
            </View>

            {/* ส่วนที่1 */}
            <View style={{ margin: 20, marginHorizontal: 8 }}>
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

              <Text>Resident:</Text>
              <Text style={styles.textInput}>ที่อยู่</Text>
              <TextInput
                style={styles.inputStyle}
                value={
                  this.state.lang === "EN"
                    ? this.state.address +
                      " " +
                      "Moo:" +
                      this.state.address_moo +
                      " " +
                      "Village:" +
                      this.state.address_village +
                      " " +
                      "Alley:" +
                      this.state.address_alley +
                      " " +
                      "Road:" +
                      this.state.address_road
                    : this.state.address +
                      " " +
                      "หมู่:" +
                      this.state.address_moo +
                      " " +
                      "หมู่บ้าน:" +
                      this.state.address_village +
                      " " +
                      "ซอย:" +
                      this.state.address_alley +
                      " " +
                      "ถนน:" +
                      this.state.address_road
                }
              />

              <Text>Phone No:</Text>
              <Text style={styles.textInput}>เบอร์โทรศัพท์</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.phone ? this.state.phone : "-"}
              />

              <Text>Province:</Text>
              <Text style={styles.textInput}>จังหวัด</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.province ? this.state.province : "-"}
              />

              <Text>District:</Text>
              <Text style={styles.textInput}>อำเภอ</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.district ? this.state.district : "-"}
              />

              <Text>Subdistrict:</Text>
              <Text style={styles.textInput}>ตำบล</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.subdistrict ? this.state.subdistrict : "-"}
              />

              <Text>Zip:</Text>
              <Text style={styles.textInput}>รหัสไปรษณีย์</Text>
              <TextInput
                style={styles.inputStyle}
                value={this.state.zipcode ? this.state.zipcode.toString() : "-"}
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
          {/* จบส่วนที่1 */}

          {/* ส่วนที่2 */}
          <View style={styles.containerSec2}>
            <View style={styles.contentInSec2}>
              <Text>Date:</Text>
              <Text style={styles.textInput}>วันออกเดินทาง</Text>
              <TouchableOpacity onPress={() => this.showDatePicker("start")}>
                <View style={styles.inputDate}>
                  <Text style={{ color: "#000" }}>{this.state.startDate}</Text>
                </View>
              </TouchableOpacity>

              <Text>Time:</Text>
              <Text style={styles.textInput}>เวลาเดินทาง</Text>
              <TouchableOpacity onPress={() => this.showTimePicker("start")}>
                <View style={styles.inputDate}>
                  <Text style={{ color: "#000" }}>{this.state.startTime}</Text>
                </View>
              </TouchableOpacity>

              <Text>From:</Text>
              <Text style={styles.textInput}>ต้นทาง</Text>
              <TextInput
                style={styles.inputStyle1}
                placeholder={
                  this.state.lang === "EN"
                    ? "Please enter form."
                    : "กรุณากรอกต้นทาง"
                }
                value={this.state.froms}
                onChangeText={(text) => this.setState({ froms: text })}
              ></TextInput>

              <Text>To:</Text>
              <Text style={styles.textInput}>ปลายทาง</Text>
              <TextInput
                style={styles.inputStyle1}
                placeholder={
                  this.state.lang === "EN"
                    ? "Please enter to."
                    : "กรุณากรอกปลายทาง"
                }
                value={this.state.tos}
                onChangeText={(text) => this.setState({ tos: text })}
              ></TextInput>
            </View>
          </View>
          {/* จบส่วนที่2 */}

          {/* เพิ่ม */}
          {this.state.ground.map((item, index) => {
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
                      // onPress={() => this.showTimePicker("start", index)}
                      onPress={() => this.showTimePicker("start", index)}
                    >
                      <View style={styles.inputDate}>
                        <Text style={{ color: "#bfc6ea" }}>
                          {item.data.startTime}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <Text>From:</Text>
                    <Text style={styles.textInput}>ต้นทาง</Text>
                    <TextInput
                      style={styles.inputStyle1}
                      placeholder={
                        this.state.lang === "EN"
                          ? "Please enter form."
                          : "กรุณากรอกต้นทาง"
                      }
                      onChangeText={(text) => {
                        let ground = [...this.state.ground];
                        let item = { ...ground[index] };
                        let data = { ...item["data"] };
                        data.froms = text;
                        item["data"] = data;
                        ground[index] = item;
                        this.setState({ ground: ground });
                      }}
                    ></TextInput>

                    <Text>To:</Text>
                    <Text style={styles.textInput}>ปลายทาง</Text>
                    <TextInput
                      style={styles.inputStyle1}
                      placeholder={
                        this.state.lang === "EN"
                          ? "Please enter to."
                          : "กรุณากรอกปลายทาง"
                      }
                      onChangeText={(text) => {
                        let ground = [...this.state.ground];
                        let item = { ...ground[index] };
                        let data = { ...item["data"] };
                        data.tos = text;
                        item["data"] = data;
                        ground[index] = item;
                        this.setState({ ground: ground });
                      }}
                    ></TextInput>
                  </View>

                  <View style={styles.buttonContainer1}>
                    <Button
                      iconLeft
                      light
                      style={styles.btnDelGroundStyle}
                      onPress={() =>
                        this.deleteGround(index, this.state.ground)
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
                </View>
              </View>
            );
          })}
          {/* เพิ่ม */}

          {/* โชว์ DateTimePickerModal*/}
          <DateTimePickerModal
            isDarkModeEnabled
            textColor="#fff"
            locale={this.state.lang == "EN" ? "en_EN" : "th_TH"}
            locale="th"
            isVisible={this.state.isDatePickerVisible}
            minimumDate={new Date()}
            mode="date"
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
          />

          <DateTimePickerModal
            isDarkModeEnabled
            textColor="#fff"
            locale="th"
            isVisible={this.state.isTimePickerVisible}
            mode="time"
            onConfirm={this.handleTimePicker}
            onCancel={this.hideTimePicker}
          />

          {/* Action Button */}
          <View style={styles.buttonContainer}>
            <Button
              style={styles.btnAddGroundStyle}
              onPress={() =>
                this.setState({
                  ground: [...this.state.ground, this.state.groundItem],
                })
              }
            >
              <Icon
                name="plus"
                size={20}
                style={{ color: "white", marginLeft: 10, marginRight: 5 }}
              />
              <Text style={{ color: "white", marginRight: 10 }}>
                {this.state.lang === "EN" ? "Add" : "เพิ่ม"}
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
    marginRight: 20,
  },
  btnAddGroundStyle: {
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#005ce6",
    borderRadius: 10,
  },
  btnDelGroundStyle: {
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
});
