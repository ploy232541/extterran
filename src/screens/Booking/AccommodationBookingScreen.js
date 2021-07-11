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
// เริ่ม
export default class AccommodationBookingScreen extends Component {
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
      province_id: "",
      district: "",
      subdistrict: "",
      zipcode: "",
      startDate: "DD/MM/YYYY",
      endDate: "DD/MM/YYYY",
      isDatePickerVisible: false,
      date: new Date(),
      select_1: [],
      select_3: [],
      select_4: [],
      tem: -1,
      accommodation: [],
      hotel: [],
      purpose: "",
      purpose_id: "",
      accom: "",
      user_id: "",
      purposeEtc: "",
      hotelItem:[],
      accommodationItem: {
        data: {
          //dates: "DD/MM/YYYY",
          startDate: "DD/MM/YYYY",
          endDate: "DD/MM/YYYY",
          province_id: "",
          accommodation: "",
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
                zipcode: row.zipcode,
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });

      httpClient
        .get(`/Training/AccommodationBookingScreenPurpose/`)
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
        .get(`/Training/FormBookingAccommodation/`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            this.setState({
              select_3: result,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

      httpClient
        .get(`/Training/FormBookingAccommodationHotel/`)
        .then((response) => {
          const result = response.data;
          if (result != null) {
            this.setState({
              select_4: result,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {}
  }

  formatDate = (date) => {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };
  showDatePicker = (props, index) => {
    this.setState({ isDatePickerVisible: true });
    if (props == "start") {
      this.setState({ isStart: true });
    }
    if (props == "start" && index >= 0) {
      this.setState({ isStart: true, tem: index });
    }
    if (props != "start" && props >= 0) {
      this.setState({ tem: props });
    }
  };
  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };
  handleConfirm = (date) => {
    var date = this.formatDate(date);
    if (this.state.isStart && this.state.tem == -1) {
      this.setState({ startDate: date, isStart: false });
    } else if (this.state.isStart && this.state.tem >= 0) {
      let tem = this.state.tem;
      let accommodation = [...this.state.accommodation];
      let item = { ...accommodation[tem] };
      let data = { ...item["data"] };
      data.startDate = date;
      item["data"] = data;
      accommodation[tem] = item;
      this.setState({ accommodation: accommodation, tem: -1, isStart: false });
    } else if (this.state.tem >= 0) {
      let tem = this.state.tem;
      let accommodation = [...this.state.accommodation];
      let item = { ...accommodation[tem] };
      let data = { ...item["data"] };
      data.endDate = date;
      item["data"] = data;
      accommodation[tem] = item;
      this.setState({ accommodation: accommodation, tem: -1 });
    } else {
      this.setState({ endDate: date, isStart: false, tem: -1 });
    }

    this.hideDatePicker();
  };
  deleteAccommodation(index) {
    let itemCopy = [...this.state.accommodation];
    itemCopy.splice(index, 1);
    this.setState({
      accommodation: itemCopy,
    });
  }

  //บันทึกข้อมูล
  onPressSend = () => {
    try {
      const {
        user_id,
        purposeEtc,
        purpose_id,
        province,
        province_id,
        district,
        subdistrict,
        zipcode,
        accom,
        startDate,
        endDate,
        accommodation,
      } = this.state;
      if (
        (purpose_id == "" && purpose_id != 6) ||
        (purposeEtc == "" && purpose_id == 6)
      ) {
        this.state.lang === "EN"
          ? Alert.alert("Please select a booking accommodations purpose.")
          : Alert.alert("กรุณาเลือกวัตถุประสงค์ในการจองที่พัก");
      } else if (province_id == "") {
        this.state.lang === "EN"
          ? Alert.alert("Please select a province")
          : Alert.alert("กรุณาเลือกจังหวัด");
      } else if (accom == "") {
        this.state.lang === "EN"
          ? Alert.alert("Please enter your accommodations")
          : Alert.alert("กรุณากรอกที่พัก");
      } else if (startDate == "DD/MM/YYYY") {
        this.state.lang === "EN"
          ? Alert.alert("Please select a Check-in date")
          : Alert.alert("กรุณาเลือกวันเช็คอิน");
      } else if (endDate == "DD/MM/YYYY") {
        this.state.lang === "EN"
          ? Alert.alert("Please select a Check-out date")
          : Alert.alert("กรุณาเลือกวันเช็คเอาต์");
      } else {
        var i = 0;
        var end_i = accommodation.length - 1;
        var err = false;
        if (accommodation.length > 0) {
          do {
            err = true;
            var item = accommodation[i].data;
            if (item.province_id == "") {
              this.state.lang === "EN"
                ? Alert.alert(
                    "Please select a province" +
                      " \n (Province selection box  " +
                      (i + 2) +
                      ")"
                  )
                : Alert.alert(
                    "กรุณาเลือกจังหวัด" +
                      " \n (ช่องเลือกจังหวัด  " +
                      (i + 2) +
                      ")"
                  );
            } else if (item.accommodation == "") {
              this.state.lang === "EN"
                ? Alert.alert(
                    "Please enter your accommodations" +
                      " \n (Accommodation field  " +
                      (i + 2) +
                      ")"
                  )
                : Alert.alert(
                    "กรุณากรอกที่พัก" + " \n (ช่องกรอกที่พัก  " + (i + 2) + ")"
                  );
            } else if (item.startDate == "DD/MM/YYYY") {
              this.state.lang === "EN"
                ? Alert.alert(
                    "Please select a Check-in date" +
                      " \n (Check-in box  " +
                      (i + 2) +
                      ")"
                  )
                : Alert.alert(
                    "กรุณาเลือกวันเช็คอิน" +
                      " \n (ช่องเช็คอิน  " +
                      (i + 2) +
                      ")"
                  );
            } else if (item.endDate == "DD/MM/YYYY") {
              this.state.lang === "EN"
                ? Alert.alert(
                    "Please select a Check-out date" +
                      " \n (Check-out box  " +
                      (i + 2) +
                      ")"
                  )
                : Alert.alert(
                    "กรุณาเลือกวันเช็คเอ้าต์" +
                      " \n (ช่องเช็คเอ้าต์  " +
                      (i + 2) +
                      ")"
                  );
            } else {
              err = !err;
            }
            i++;
          } while (i <= end_i && err != true);
        }

        if (
          (err != true && accommodation.length > 0) ||
          accommodation.length < 1
        ) {
          const data = {
            user_id,
            purpose_etc: purposeEtc,
            purpose_id,
            province,
            province_id,
            district,
            subdistrict,
            zip: zipcode,
            accom,
            startDate,
            endDate,
            accommodation,
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
                    .post(`/Training/InsertAccomBooking`, data)
                    .then((response) => {
                      const result = response.data;

                      if (result === true) {
                        Alert.alert(
                          this.state.lang === "EN" ? "Alert" : "แจ้งเตือน",
                          this.state.lang === "EN"
                            ? "Problem reported"
                            : "บันทึกที่พักสำเร็จ",
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
      startDate: "DD/MM/YYYY",
      endDate: "DD/MM/YYYY",
      province_id: "",
      purpose_id: "",
      purposeEtc: "",
      accom: "",
      accommodation: [],
    });
  };

  render() {
    return (
      <View style={styles.background}>
        <ScrollView>
          {/* Start accommodation booking form section 1 */}
          <View style={styles.containerSec1}>
            <View style={styles.textHeader}>
              <Text style={{ color: "#398DDD", fontSize: 20 }}>
                บริษัทเอ็กซ์เธอร์แลน ประเทศไทย จำกัด
              </Text>
              <Text style={{ paddingTop: 16, fontSize: 18 }}>
                Accommodation
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

            <Text>Purpose:</Text>
            <Text style={styles.textInput}>วัตถุประสงค์ในการจองที่พัก</Text>
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
              selectedValue={this.state.purpose_id}
              onValueChange={(text) => {
                this.setState({ purpose_id: text, purposeEtc: "" });
                console.log(this.state.purpose_id);
              }}
              textStyle={{ fontSize: 14 }}
            >
              <Picker.Item
                label={
                  this.state.lang === "EN"
                    ? "Please select your hotel purpose"
                    : "กรุณาเลือกวัตถุประสงค์ในการจองที่พัก"
                }
                value=""
              />
              {this.state.select_1.map((data) => {
                return (
                  <Picker.Item
                    label={
                      this.state.lang === "EN"
                        ? data.purpose_hotel_en
                        : data.purpose_hotel_th
                    }
                    value={data.id}
                  />
                );
              })}
            </Picker>

            {/* กรณีเลือกอื่นๆ */}

            {this.state.purpose_id == 6 && (
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
              <Text>Province:</Text>
              <Text style={styles.textInput}>จังหวัด</Text>
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
                  this.state.lang === "EN" ? "Selecte" : "กรุณาเลือกจังหวัด"
                }
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.province_id}
                onValueChange={(text) => {
                  this.setState({ province_id: text });
                  try {
                    httpClient
                      .get(`/Training/getHotel/${text}`)
                      .then((response) => {
                        const result = response.data;
                        if (result != null) {
                          this.setState({
                            hotel: result,
                          });
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  } catch (error) {}
                }}
                textStyle={{ fontSize: 14 }}
              >
         
                {this.state.select_3.map((data) => {
                  return (
                    <Picker.Item
                      label={
                        this.state.lang === "EN"
                          ? data.pv_name_en
                          : data.pv_name_th
                      }
                      value={data.pv_id}
                    />
                  );
                })}
              </Picker>

              {/* <Text>Accommodation (Province, Hotel name):</Text>
              <Text style={styles.textInput}>ที่พัก (จังหวัด ชื่อโรงแรม)</Text>
              <TextInput
                style={styles.inputStyle1}
                placeholder="ที่พัก (จังหวัด ชื่อโรงแรม)"
                value={this.state.accom}
                onChangeText={(text) => this.setState({ accom: text })}
              ></TextInput> */}

              <Text>Accommodation (Province, Hotel name):</Text>
              <Text style={styles.textInput}>ที่พัก (จังหวัด ชื่อโรงแรม)</Text>
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
                  this.state.lang === "EN" ? "Selecte" : "เลือกที่พัก"
                }
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.accom}
                onValueChange={(text) => this.setState({ accom: text })}
                textStyle={{ fontSize: 14 }}
              >
                {this.state.hotel.map((data) => {
                  return (
                    <Picker.Item
                      label={
                        this.state.lang === "EN"
                          ? data.hotel_name_en
                          : data.hotel_name_th
                      }
                      value={data.hotel_id}
                    />
                  );
                })}
              </Picker>

              <Text>Check in date (D/M/Y):</Text>
              <Text style={styles.textInput}>เช็คอิน</Text>
              <TouchableOpacity onPress={() => this.showDatePicker("start")}>
                <View style={styles.inputDate}>
                  <Text style={{ color: "#bfc6ea" }}>
                    {this.state.startDate}
                  </Text>
                </View>
              </TouchableOpacity>

              <Text>Check out date (D/M/Y):</Text>
              <Text style={styles.textInput}>เช็คเอาต์</Text>
              <TouchableOpacity onPress={() => this.showDatePicker()}>
                <View style={styles.inputDate}>
                  <Text style={{ color: "#bfc6ea" }}>{this.state.endDate}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* จบส่วนที่2 */}

          {/* เพิ่มที่พัก */}
          {this.state.accommodation.map((item, index) => {
            
            return (
              <View style={{ marginTop: "5%" }}>
                <View style={styles.containerSec2}>
                  <View style={styles.contentInSec2}>
                    <Text>Province:</Text>
                    <Text style={styles.textInput}>จังหวัด</Text>
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
                        this.state.lang === "EN" ? "Selecte" : "กรุณาเลือกจังหวัด"
                      }
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={item.data.province_id}
                      onValueChange={(text) => {
                        try {
                          let accommodation = [...this.state.accommodation];
                          let item = { ...accommodation[index] };
                          let data = { ...item["data"] };
                          data.province_id = text;
                          item["data"] = data;
                          accommodation[index] = item;
                          this.setState({ accommodation: accommodation });
                          httpClient
                            .get(`/Training/getHotel/${text}`)
                            .then((response) => {
                              const result = response.data;
                              if (result != null) {
                    
                               this.setState({hotelItem:result})
                              
                              }
                            })
                            .catch((error) => {
                              console.log(error);
                            });
                        } catch (error) {}
                       
                       
                      }}
                      textStyle={{ fontSize: 14 }}
                    >
                    
                      {this.state.select_3.map((data) => {
                        return (
                          <Picker.Item
                            label={
                              this.state.lang === "EN"
                                ? data.pv_name_en
                                : data.pv_name_th
                            }
                            value={data.pv_id}
                          />
                        );
                      })}
                    </Picker>

                    <Text>Accommodation (Province, Hotel name):</Text>
                    <Text style={styles.textInput}>
                      ที่พัก (จังหวัด ชื่อโรงแรม)
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
                placeholder={
                  this.state.lang === "EN" ? "Selecte" : "เลือกที่พัก"
                }
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={item.data.accommodation}
                onValueChange={(text) => {
                  let accommodation = [...this.state.accommodation];
                  let item = { ...accommodation[index] };
                  let data = { ...item["data"] };
                  data.accommodation = text;
                  item["data"] = data;
                  accommodation[index] = item;
                  this.setState({ accommodation: accommodation });
                }}
                textStyle={{ fontSize: 14 }}
              >
                {this.state.hotelItem.map((data) => {
                  return (
                    <Picker.Item
                      label={
                        this.state.lang === "EN"
                          ? data.hotel_name_en
                          : data.hotel_name_th
                      }
                      value={data.hotel_id}
                    />
                  );
                })}
              </Picker>
                  

                    <Text>Check in date (D/M/Y):</Text>
                    <Text style={styles.textInput}>เช็คอิน</Text>
                    <TouchableOpacity
                      onPress={() => this.showDatePicker("start", index)}
                    >
                      <View style={styles.inputDate}>
                        <Text style={{ color: "#bfc6ea" }}>
                          {item.data.startDate}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <Text>Check out date (D/M/Y):</Text>
                    <Text style={styles.textInput}>เช็คเอาต์</Text>
                    <TouchableOpacity
                      onPress={() => this.showDatePicker(index)}
                    >
                      <View style={styles.inputDate}>
                        <Text style={{ color: "#bfc6ea" }}>
                          {item.data.endDate}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <View style={styles.buttonContainer1}>
                      <Button
                        iconLeft
                        light
                        style={styles.btnDelaccommodationStyle}
                        onPress={() => this.deleteAccommodation(index)}
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
              </View>
            );
          })}
          {/* เพิ่มที่พัก */}

          {/* โชว์ DateTimePickerModal*/}
          <DateTimePickerModal
            isVisible={this.state.isDatePickerVisible}
            mode="date"
            onConfirm={this.handleConfirm}
            onCancel={this.hideDatePicker}
          />

          {/* Action Button */}
          <View style={styles.buttonContainer}>
            <Button
              style={styles.btnAddAccommodationStyle}
              onPress={() =>
                this.setState({
                  accommodation: [
                    ...this.state.accommodation,
                    this.state.accommodationItem,
                  ],
                })
              }
            >
              <Icon
                name="plus"
                size={20}
                style={{ color: "white", marginLeft: 10, marginRight: 5 }}
              />
              <Text style={{ color: "white", marginRight: 10 }}>
                {this.state.lang === "EN" ? "Add Accommodation" : "เพิ่มที่พัก"}
              </Text>
            </Button>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingVertical: 20,
              marginBottom: 40,
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
    borderWidth: 2,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 18,
    borderColor: "#398DDD",
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
  btnAddAccommodationStyle: {
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#005ce6",
    borderRadius: 10,
  },
  btnDelaccommodationStyle: {
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
