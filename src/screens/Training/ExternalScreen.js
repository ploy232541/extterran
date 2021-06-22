import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Picker, Tab } from "native-base";
import { Avatar } from "react-native-paper";
import { Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "react-native-paper";
import { set } from "react-native-reanimated";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import HomeScreen from "../Home/HomeScreen";
import MyProgramsScreen from "../MyProgramsScreen";
import ProfileScreen from "../Profile/ProfileScreen";
import { Alert } from "react-native";
import { httpClient } from "../../core/HttpClient";
import { AsyncStorage } from "react-native";

let dimensions = Dimensions.get("window");
let pickerWidth = dimensions.width - 56;
const HEIGHT = Dimensions.get("window").height;

export default class ExternalScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUser: "กรุณาเลือกผู้ใช้",
      course: "กรุณาเลือกหลักสูตร",
      trainingNeedItem: {
        employee_id: "",
        data: [],
      },
      courseItem: {
        courseName: "",
        trainingProvider: "",
        trainingPurpose: "",
        startDate: "",
        file: "",
        oher: "",
      },
      currentDate: "dd/mm/yy",
      isStart: false,
      isDatePickerVisible: false,
      trainingNeed: [],
      select_2: [],
      select_1: [],
      startDate: "DD/MM/YYYY",
      isDatePickerVisible: false,
      trainingNeed: [],
      dateexternal: [],
      dateexternalitem: {
        data: {
          course: "",
          Provider: "",
          purpose: "",
          purpose_id: "",
          dates: "DD/MM/YYYY",
          cost: "",
          other: "",
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
        .get(`/Training/EmployeeTrainingNeed/${id}`)
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

      httpClient
        .get(`/Training/TrainingNeedPurpose/`)
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
    } catch (error) {
      Alert.alert(error);
    }
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
        let dateexternal = [...this.state.dateexternal];
        let item = { ...dateexternal[tem] };
        let data = { ...item["data"] };
        data.dates = datess;
        item["data"] = data;
        dateexternal[tem] = item;
        this.setState({ dateexternal: dateexternal });
        console.log(dateexternal);
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

  deleteCourse(index, courseItem) {
    let itemCopy = [...courseItem];
    itemCopy.splice(index, 1);
    this.setState({ courseItem: itemCopy });
  }

  render() {
    return (
      <View style={styles.background}>
        <ScrollView>
          <View style={styles.textHeader}>
            <Text style={{ color: "#333333", fontSize: "24" }}>
            Training Needs - In house
            </Text>
          </View>

          {/* <Divider style={{ paddingBottom: 1, marginTop: 15 }} /> */}
          <View
            style={{
              marginVertical: 20,
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

          {/* Start Card by aek*/}
          {/* จะทำการแสดงพนักงาน */}
          {this.state.trainingNeed.map((item, index) => {
            console.log(item);
            return (
              <View>
                <ScrollView>
                  <View style={styles.containerSec2}>
                    <View style={styles.contentInSec}>
                      <View
                        style={{
                          flexDirection: "column",
                          justifyContent: "space-around",
                          paddingHorizontal: 8,
                          marginBottom: 8,
                        }}
                      >
                        <Text style={styles.textStyle1}>
                          {this.state.lang === "EN"
                            ? "Employee Name"
                            : "ชื่อพนักงาน"}
                        </Text>

                        <View>
                          <Picker
                            mode="dropdown"
                            iosIcon={
                              <Icon
                                name="angle-down"
                                style={{ width: "8%", paddingHorizontal: 2}}
                              />
                            }
                            style={styles.inputLightStyle}
                            placeholder={
                              this.state.lang === "EN" ? "Selecte" : "เลือก"
                            }
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            // selectedValue={this.state.purpose}
                            // onValueChange={(text) =>
                            //   this.setState({ purpose: text })
                            // }
                            textStyle={{ fontSize: 14 }}
                          >
                            <Picker.Item
                              label={
                                this.state.lang === "EN"
                                  ? "Please select "
                                  : "กรุณาเลือก"
                              }
                              value=""
                            />
                            {this.state.select_2.map((data) => {
                              return (
                                <Picker.Item
                                  label={
                                    this.state.lang === "EN"
                                      ? data.firstname_en +
                                        "(" +
                                        data.lastname_en +
                                        ")"
                                      : data.firstname +
                                        "(" +
                                        data.lastname +
                                        ")"
                                  }
                                  value={data.user_id}
                                />
                              );
                            })}
                          </Picker>
                        </View>
                      </View>

                      <Divider style={{ paddingBottom: 1, marginTop: 10 }} />

                      {/* Start กรอบใน */}
                      <View style={{ marginTop: 24 }}>
                        <View style={styles.containerSec3}>
                          <View
                            style={{
                              flexDirection: "column",
                              justifyContent: "space-around",
                              paddingHorizontal: 10,
                              // marginBottom: 8,
                            }}
                          >
                            <TextInput
                              style={styles.inputStyle4}
                              placeholder={
                                this.state.lang === "EN"
                                  ? "Course Name"
                                  : "ชื่อหลักสูตร"
                              }
                            ></TextInput>

                            <TextInput
                              style={styles.inputStyle4}
                              placeholder={
                                this.state.lang === "EN"
                                  ? "Training Provider"
                                  : "ผู้ให้บริการฝึกอบรม"
                              }
                            ></TextInput>

                            <View>
                              <Picker
                                mode="dropdown"
                                iosIcon={
                                  <Icon
                                    name="angle-down"
                                    style={{
                                      width: "8%",
                                      paddingHorizontal: 2,
                                    }}
                                  />
                                }
                                style={styles.inputLightStyle}
                                placeholder={
                                  this.state.lang === "EN"
                                    ? "Selecte a purpose"
                                    : "เลือกจุดประสงค์"
                                }
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                // selectedValue={this.state.toFlight}
                                // onValueChange={(text) =>
                                //   this.setState({ toFlight: text })
                                // }
                                textStyle={{ fontSize: 14 }}
                              >
                                <Picker.Item
                                  label={
                                    this.state.lang === "EN"
                                      ? "Please select a purpose"
                                      : "กรุณาเลือกจุดประสงค์"
                                  }
                                  value=""
                                />
                                {this.state.select_1.map((data) => {
                                  return (
                                    <Picker.Item
                                      label={
                                        this.state.lang === "EN"
                                          ? data.purpose_en
                                          : data.purpose_th
                                      }
                                      value={data.id}
                                    />
                                  );
                                })}
                              </Picker>
                            </View>

                            <View>
                              <TouchableOpacity
                                onPress={() => this.showDatePicker("start")}
                              >
                                <View style={styles.inputStyle5}>
                                  <Text style={{ color: "#bfc6ea" }}>
                                    {this.state.startDate}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>

                            <TextInput
                              style={styles.inputStyle4}
                              placeholder={
                                this.state.lang === "EN"
                                  ? "Training Cost"
                                  : "ราคา"
                              }
                            ></TextInput>

                            <TextInput
                              style={styles.inputStyle4}
                              placeholder={
                                this.state.lang === "EN" ? "Other" : "อื่นๆ"
                              }
                            ></TextInput>

                            <Text
                              style={{
                                paddingHorizontal: 8,
                                paddingVertical: 15,
                              }}
                            >
                              {this.state.lang === "EN"
                                ? "Attach File"
                                : "แนบไฟล์"}
                            </Text>
                            <TouchableOpacity
                              style={{
                                backgroundColor: "#4392de",
                                width: "40%",
                                height: "8%",
                                marginTop: 5,
                                marginBottom: 15,
                                marginLeft: 4,
                                borderRadius: 10,
                              }}
                            >
                              <View
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  flex: 1,
                                }}
                              >
                                <Text
                                  style={{
                                    marginLeft: 10,
                                    marginRight: 10,
                                    color: "white",
                                  }}
                                >
                                  {this.state.lang === "EN" ? "File" : "ไฟล์"}
                                </Text>
                              </View>
                            </TouchableOpacity>

                            <Divider
                              style={{
                                paddingBottom: 1,

                                marginBottom: 4,
                                marginTop: 10,
                              }}
                            />
                          </View>

                          <DateTimePickerModal
                            isVisible={this.state.isDatePickerVisible}
                            mode="date"
                            onConfirm={this.handleConfirm}
                            onCancel={this.hideDatePicker}
                          />

                          <View style={styles.pickerContainer2}>
                            <TouchableOpacity
                              style={styles.addButton}
                              // onPress={() => setCards([...cards, "1"])}
                            >
                              <Text style={styles.addButtonText}>+</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.deleteButton}
                              // onPress={() => deleteCourse(cardIndex, card, setCard)}
                            >
                              <Text style={styles.addButtonText}>-</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>

                    <Button
                      mode="contained"
                      style={styles.btnDelCard}
                      onPress={() => deleteCourse(cardIndex, card, setCard)}
                      >
                        <Icon name="trash" color="#fff" size="26" />
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 16,
                          }}
                        >
                          {this.state.lang === "EN"
                            ? "Delete Employee"
                            : "ลบพนักงาน"}
                        </Text>
                    </Button>
                  </View>
                  {/* End กรอบนอก&กรอบใน */}
                </ScrollView>
              </View>
            );
          })}

          {/* <Button style={styles.submitButton}>
            <Text style={{ color: "#fff" }}>Submit</Text>
          </Button> */}
           <View>
            {/* เมื่อกดปุ่มนี้จะทำการเพิ่มพนักงาน */}
            <Button
              style={styles.btnStyle1}
              onPress={() => {
                let trainingNeedItem = this.state.trainingNeedItem;
                trainingNeedItem["data"] = [
                  ...trainingNeedItem["data"],
                  this.state.courseItem,
                ];
                let trainingNeed = [
                  ...this.state.trainingNeed,
                  trainingNeedItem,
                ];
                this.setState({
                  trainingNeed: trainingNeed,
                });
              }}
            >
              <Icon name="user-plus" color="#fff" size="26" />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                }}
              >
                {this.state.lang === "EN" ? "Add Employee" : "เพิ่มพนักงาน"}
              </Text>
            </Button>
          </View>
          
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingVertical: 12,
              paddingHorizontal: 24,
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
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
    width: 500,
  },
  //กรอบข้อมูล
  containerSec2: {
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#999999",
    marginHorizontal: 10,
    marginBottom: 50,
  },
  textHeader: {
    alignItems: "center",
    padding: 15,
  },
  //ชื่อหัวข้อ
  textStyle1: {
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  cardStyle: {
    marginVertical: 100,
    //marginTop: 12,
  },
  /// picker styles
  userPickerStyles: {
    width: pickerWidth,
    borderWidth: 1,
    borderColor: "#B1B1B1",
    marginTop: 24,
    marginBottom: 24,
    marginLeft: 14,
    // marginVertical: 24,
    height: 60,
  },
  coursePickerStyles: {
    //height: 10,
    width: pickerWidth - 56,
    borderWidth: 1,
    borderColor: "#B1B1B1",
    marginHorizontal: 16,
  },
  ///กรอบเพิ่มข้อมูล
  pickerContainer: {
    flexDirection: "row",
    marginVertical: 1,
    marginTop: 5,
    marginBottom: 12,
    marginLeft: 1,
    marginRight: -95,
  },
  pickerContainer2: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
    marginBottom: 12,
  },
  addButtonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 5,
    marginTop: -2,
    marginLeft: 1,
  },
  /// add button
  addButton: {
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4392de",
    width: 36,
    height: 36,
    marginLeft: 10,
    marginRight: 8,
    marginTop: 5,
  },
  /// del button
  deleteButton: {
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    width: 36,
    height: 36,
    marginLeft: 8,
    marginRight: 2,
    marginTop: 5,
  },
  containerSec1: {
    marginHorizontal: 20,
  },
  containerSec3: {
    // width: "95%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#999999",
    marginHorizontal: 10,
    // marginRight: 8,
    // marginLeft: 10,
  },
  contentInSec: {
    padding: 2,
  },
  btnStyle1: {
    height: 40,
    backgroundColor: "#F0AD4E",
    marginLeft: 12,
    marginRight: 12,
    marginTop: 12,
  },
  submitButton: {
    alignSelf: "center",
    marginVertical: 8,
    backgroundColor: "#3BB54A",
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 4,
    height: 44,
    marginHorizontal: 8,
    marginTop: 18,
    marginBottom: 10,
    flex: 1,
    justifyContent: "center",
  },
  input1: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 4,
    height: 44,
    marginHorizontal: 8,
    marginBottom: 10,
    flex: 1,
    justifyContent: "center",
  },
  inputDate: {
    borderWidth: 1,
    borderRadius: 4,
    height: 44,
    marginHorizontal: 8,
    marginBottom: 10,
    flex: 1,
    justifyContent: "center",
  },
  btnDelCard: {
    marginTop: 1,
    marginVertical: 18,
    marginHorizontal: 10,
    backgroundColor: "red",
  },
  inputLightStyle: {
    borderWidth: 1,
    borderRadius: 10,
    height: HEIGHT / 20,
    width: "100%",
    marginTop: 15,
    marginBottom: 2,
    borderColor: "#007aff",
  },
  inputStyle4: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#007aff",
    height: HEIGHT / 20,
    marginTop: 15,
    paddingLeft: 10,
    marginBottom: 2,
  },
  inputStyle5: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#007aff",
    height: HEIGHT / 20,
    marginTop: 15,
    paddingLeft: 10,
    marginBottom: 2,
    justifyContent: "center",
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
});
